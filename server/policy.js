const ACTIONS = ["reorder_queue", "suggest_break", "ambient_mode", "nudge_task"];
const WINDOW_MS = 30_000;
const COOLDOWN_MS = 10 * 60_000;
const BUDGET_WINDOW_MS = 60 * 60_000;
const DIM = 6;

function vector(context, probabilities) {
  return [1, probabilities.fatigued || 0, probabilities.distracted || 0, context.confidence || 0, Math.min(1, (context.sessionMinutes || 0) / 60), Math.min(1, (context.taskDifficulty || 2) / 3)];
}
function solve(matrix, vectorValue) {
  const a = matrix.map((row, i) => [...row, vectorValue[i]]);
  for (let col = 0; col < DIM; col++) {
    let pivot = col;
    for (let row = col + 1; row < DIM; row++) if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    [a[col], a[pivot]] = [a[pivot], a[col]];
    const divisor = a[col][col] || 1e-9;
    for (let j = col; j <= DIM; j++) a[col][j] /= divisor;
    for (let row = 0; row < DIM; row++) if (row !== col) {
      const factor = a[row][col];
      for (let j = col; j <= DIM; j++) a[row][j] -= factor * a[col][j];
    }
  }
  return a.map((row) => row[DIM]);
}
function linUcbScore(arm, x, alpha = 0.35) {
  const theta = solve(arm.A, arm.b);
  const mean = theta.reduce((sum, coefficient, i) => sum + coefficient * x[i], 0);
  const invX = solve(arm.A, x);
  const uncertainty = Math.sqrt(Math.max(0, x.reduce((sum, value, i) => sum + value * invX[i], 0)));
  return mean + alpha * uncertainty;
}
function updateArm(arm, x, reward) {
  for (let i = 0; i < DIM; i++) {
    arm.b[i] += reward * x[i];
    for (let j = 0; j < DIM; j++) arm.A[i][j] += x[i] * x[j];
  }
  arm.observations += 1;
}
export function ensureBandit(db) {
  db.bandit ||= Object.fromEntries(ACTIONS.map((action) => [action, { A: Array.from({ length: DIM }, (_, i) => Array.from({ length: DIM }, (_, j) => i === j ? 1 : 0)), b: Array(DIM).fill(0), observations: 0 }]));
  db.policy ||= { lastInterventionAt: null, recentInterventions: [], lastState: null, statePersistence: 0 };
}

export function decide(db, features, estimate, context = {}) {
  ensureBandit(db);
  const now = Date.now();
  const settings = db.settings;
  const gate = {
    confidence: estimate.confidence >= (Number(settings.confidenceThreshold) || 75) / 100,
    persistence: db.policy.lastState === estimate.state ? db.policy.statePersistence + 1 >= 2 : false,
    cooldown: !db.policy.lastInterventionAt || now - db.policy.lastInterventionAt >= COOLDOWN_MS,
    budget: db.policy.recentInterventions.filter((t) => now - t < BUDGET_WINDOW_MS).length < (Number.isFinite(Number(settings.nudgesPerHour)) ? Number(settings.nudgesPerHour) : 4),
  };
  db.policy.statePersistence = db.policy.lastState === estimate.state ? db.policy.statePersistence + 1 : 1;
  db.policy.lastState = estimate.state;
  const noAction = { action: "none", reason: "safe_default", gate, estimator: estimate.estimator };
  if (estimate.state === "focused") return noAction;
  if (!gate.confidence || !gate.persistence || !gate.cooldown || !gate.budget) return { ...noAction, reason: "confidence_persistence_cooldown_or_budget_gate" };

  const candidates = estimate.state === "fatigued" ? ["suggest_break", "reorder_queue", "ambient_mode"] : ["ambient_mode", "nudge_task", "reorder_queue"];
  const x = vector(context, estimate.probabilities);
  let action;
  const observations = Object.values(db.bandit).reduce((sum, arm) => sum + arm.observations, 0);
  if (observations < 6) {
    // Transparent cold-start rules while feedback is sparse.
    if (estimate.state === "fatigued" && Number(features.sessionMinutes) >= 25) action = "suggest_break";
    else if (estimate.state === "distracted" && Number(features.taskSwitchesPerHour) >= 3) action = "ambient_mode";
    else action = "reorder_queue";
  } else {
    action = candidates.reduce((best, candidate) => linUcbScore(db.bandit[candidate], x) > linUcbScore(db.bandit[best], x) ? candidate : best, candidates[0]);
  }
  const decision = { id: crypto.randomUUID(), action, state: estimate.state, confidence: estimate.confidence, createdAt: new Date(now).toISOString(), context: x, gate, algorithm: observations < 6 ? "cold_start_rule" : "linucb" };
  db.decisions.push(decision);
  db.policy.lastInterventionAt = now;
  db.policy.recentInterventions.push(now);
  db.policy.recentInterventions = db.policy.recentInterventions.filter((t) => now - t < BUDGET_WINDOW_MS);
  return decision;
}

export function recordFeedback(db, decisionId, reward) {
  ensureBandit(db);
  const decision = db.decisions.find((item) => item.id === decisionId);
  if (!decision) return null;
  if (!ACTIONS.includes(decision.action)) return null;
  const clampedReward = Math.max(-1, Math.min(1, Number(reward)));
  if (!Number.isFinite(clampedReward)) return null;
  updateArm(db.bandit[decision.action], decision.context, clampedReward);
  decision.reward = clampedReward;
  decision.feedbackAt = new Date().toISOString();
  return decision;
}
