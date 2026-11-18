import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { estimateState } from "./state-estimator.js";
import { decide, ensureBandit, recordFeedback } from "./policy.js";

const root = dirname(fileURLToPath(import.meta.url));
const dataFile = process.env.DUALMIND_DATA_FILE || join(root, "data", "db.json");
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
const production = process.env.NODE_ENV === "production";
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (production && (!process.env.DATABASE_URL || !supabaseUrl || !supabaseAnonKey)) {
  throw new Error("Production requires DATABASE_URL, SUPABASE_URL, and SUPABASE_ANON_KEY.");
}
if ((supabaseUrl || supabaseAnonKey) && (!process.env.DATABASE_URL || !supabaseUrl || !supabaseAnonKey)) {
  throw new Error("When enabling Supabase locally, configure DATABASE_URL, SUPABASE_URL, and SUPABASE_ANON_KEY together.");
}
const pool = process.env.DATABASE_URL ? new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 }) : null;
const distDir = resolve(root, "..", "dist");
const observationTimes = new Map();
const userLocks = new Map();
const seed = {
  tasks: [
    { id: randomUUID(), title: "Implement LinUCB policy update", notes: "Research code", difficulty: "Hard", estimate: 50, deadline: "2026-11-18", status: "In progress", createdAt: new Date().toISOString() },
    { id: randomUUID(), title: "Write Related Work section", notes: "Research paper", difficulty: "Medium", estimate: 40, deadline: "2026-11-19", status: "To do", createdAt: new Date().toISOString() },
    { id: randomUUID(), title: "Review DAiSEE label mapping", notes: "Dataset", difficulty: "Easy", estimate: 20, deadline: "2026-11-20", status: "To do", createdAt: new Date().toISOString() },
    { id: randomUUID(), title: "Design consent form for user study", notes: "Ethics", difficulty: "Medium", estimate: 30, deadline: "2026-11-21", status: "To do", createdAt: new Date().toISOString() },
    { id: randomUUID(), title: "Reply to group about Thursday session", notes: "Admin", difficulty: "Easy", estimate: 5, deadline: "2026-11-18", status: "To do", createdAt: new Date().toISOString() },
    { id: randomUUID(), title: "Temperature-scaling calibration script", notes: "Research code", difficulty: "Hard", estimate: 60, deadline: "2026-11-23", status: "To do", createdAt: new Date().toISOString() },
    { id: randomUUID(), title: "Set up MediaPipe face mesh", notes: "Research code", difficulty: "Hard", estimate: 90, deadline: "2026-11-15", status: "Done", createdAt: new Date().toISOString() },
  ],
  sessions: [],
  settings: { webcamCues: true, activityRhythm: true, appSwitching: true, confidenceThreshold: 75, nudgesPerHour: 4 },
  groups: [],
  featureWindows: [],
  decisions: [],
  queueOverrides: [],
  queueFeedback: [],
};

let localDb;
if (pool) await pool.query("CREATE TABLE IF NOT EXISTS dualmind_user_state (user_id text PRIMARY KEY, state jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())");
else {
  await mkdir(dirname(dataFile), { recursive: true });
  try { localDb = JSON.parse(await readFile(dataFile, "utf8")); }
  catch { localDb = structuredClone(seed); await writeFile(dataFile, JSON.stringify(localDb, null, 2)); }
  localDb.featureWindows ||= []; localDb.decisions ||= []; localDb.queueOverrides ||= []; localDb.queueFeedback ||= []; ensureBandit(localDb);
}
function newUserState() {
  const value = structuredClone(seed);
  value.tasks = value.tasks.map((task) => ({ ...task, id: randomUUID() }));
  ensureBandit(value); return value;
}
async function loadState(userId) {
  if (!pool) return localDb;
  await pool.query("INSERT INTO dualmind_user_state(user_id,state) VALUES($1,$2::jsonb) ON CONFLICT(user_id) DO NOTHING", [userId, JSON.stringify(newUserState())]);
  const { rows } = await pool.query("SELECT state FROM dualmind_user_state WHERE user_id=$1", [userId]);
  const value = rows[0].state;
  value.featureWindows ||= []; value.decisions ||= []; value.queueOverrides ||= []; value.queueFeedback ||= []; ensureBandit(value);
  return value;
}
async function persist(value, userId) {
  if (pool) await pool.query("UPDATE dualmind_user_state SET state=$2::jsonb, updated_at=now() WHERE user_id=$1", [userId, JSON.stringify(value)]);
  else { localDb = value; await writeFile(dataFile, JSON.stringify(value, null, 2)); }
}
async function lockUser(userId) {
  const previous = userLocks.get(userId) || Promise.resolve();
  let unlock;
  const current = new Promise((resolveLock) => { unlock = resolveLock; });
  const tail = previous.then(() => current);
  userLocks.set(userId, tail);
  await previous;
  let released = false;
  return () => {
    if (released) return;
    released = true; unlock();
    if (userLocks.get(userId) === tail) userLocks.delete(userId);
  };
}
async function authenticate(req) {
  if (!production && !supabaseUrl) return "local-development-user";
  const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || "")?.[1];
  if (!token) return null;
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: supabaseAnonKey, authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const user = await response.json(); return typeof user.id === "string" ? user.id : null;
  } catch { return null; }
}

function send(res, status, data) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "x-frame-options": "DENY", "permissions-policy": "camera=(self), microphone=(), geolocation=()", ...(production ? { "strict-transport-security": "max-age=31536000" } : {}) });
  res.end(JSON.stringify(data));
}
async function serveStatic(res, requestPath) {
  let relativePath;
  try { relativePath = decodeURIComponent(requestPath === "/" ? "/index.html" : requestPath); }
  catch { return false; }
  const target = resolve(distDir, `.${relativePath}`);
  const fromDist = relative(distDir, target);
  if (fromDist.startsWith("..") || isAbsolute(fromDist)) return false;
  try {
    const data = await readFile(target);
    const contentType = ({ ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".task": "application/octet-stream", ".wasm": "application/wasm" })[extname(target)] || "application/octet-stream";
    const cacheControl = target.endsWith("index.html") ? "no-cache" : /\.(js|css)$/.test(target) ? "public, max-age=31536000, immutable" : "public, max-age=86400";
    res.writeHead(200, { "content-type": contentType, "cache-control": cacheControl, "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "x-frame-options": "DENY", "permissions-policy": "camera=(self), microphone=(), geolocation=()", ...(production ? { "strict-transport-security": "max-age=31536000" } : {}) }); res.end(data); return true;
  } catch { return false; }
}
async function body(req) {
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > 1_000_000) throw new Error("Request body too large"); }
  return raw ? JSON.parse(raw) : {};
}
function validateTask(value) {
  const title = String(value.title || "").trim();
  const difficulty = value.difficulty || "Medium";
  const estimate = Number(value.estimate);
  if (!title || title.length > 160) return "Title is required and must be at most 160 characters.";
  if (!["Easy", "Medium", "Hard"].includes(difficulty)) return "Difficulty must be Easy, Medium, or Hard.";
  if (!Number.isInteger(estimate) || estimate < 1 || estimate > 1440) return "Estimate must be between 1 and 1440 minutes.";
  return null;
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (req.method === "GET" && !url.pathname.startsWith("/api/")) {
    if (await serveStatic(res, url.pathname)) return;
    try { res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "x-frame-options": "DENY", "permissions-policy": "camera=(self), microphone=(), geolocation=()", ...(production ? { "strict-transport-security": "max-age=31536000" } : {}) }); return res.end(await readFile(join(distDir, "index.html"))); }
    catch { return send(res, 503, { error: "Frontend is not built. Run npm run build." }); }
  }
  const parts = url.pathname.split("/").filter(Boolean);
  try {
    if (req.method === "GET" && url.pathname === "/api/health") { if (pool) await pool.query("SELECT 1"); return send(res, 200, { ok: true, service: "dualmind-api" }); }
    const userId = await authenticate(req);
    if (!userId) return send(res, 401, { error: "Sign in to access DualMind data." });
    const releaseUser = await lockUser(userId);
    res.once("finish", releaseUser); res.once("close", releaseUser);
    const db = await loadState(userId);
    if (req.method === "GET" && url.pathname === "/api/tasks") {
      const q = (url.searchParams.get("q") || "").toLowerCase();
      const status = url.searchParams.get("status");
      const tasks = db.tasks.filter(t => (!q || `${t.title} ${t.notes}`.toLowerCase().includes(q)) && (!status || t.status === status));
      return send(res, 200, tasks);
    }
    if (req.method === "GET" && url.pathname === "/api/queue") {
      const state = db.featureWindows.at(-1)?.estimate?.state || "unknown";
      const tasks = db.tasks.filter(task => task.status !== "Done").map(task => {
        const daysUntilDue = task.deadline ? (Date.parse(`${task.deadline}T23:59:59`) - Date.now()) / 86400000 : null;
        const urgency = daysUntilDue === null ? 0 : Math.max(0, Math.min(50, 50 - Math.max(0, daysUntilDue) * 8));
        const difficulty = { Easy: 0, Medium: 1, Hard: 2 }[task.difficulty] ?? 1;
        const effort = state === "fatigued" ? Math.max(0, 30 - task.estimate * 0.35) + (2 - difficulty) * 4 : state === "distracted" ? Math.max(0, 24 - task.estimate * 0.8) + (2 - difficulty) * 3 : difficulty * 8 + Math.max(0, 20 - task.estimate * 0.25);
        const score = Math.round((urgency + effort + (task.status === "In progress" ? 3 : 0)) * 10) / 10;
        const reason = urgency > effort ? "Deadline is driving priority" : state === "fatigued" ? "Shorter, lighter work is preferred during the fatigue proxy" : state === "distracted" ? "A short task may help restart momentum" : state === "focused" ? "A more demanding task fits the current focus proxy" : "Deadline and task size set the default order";
        return { ...task, score, reason };
      }).sort((a, b) => b.score - a.score || String(a.deadline || "9999").localeCompare(String(b.deadline || "9999")));
      const overrides = db.queueOverrides.filter(id => tasks.some(task => task.id === id));
      if (overrides.length) tasks.sort((a, b) => (overrides.indexOf(a.id) < 0 ? 999 : overrides.indexOf(a.id)) - (overrides.indexOf(b.id) < 0 ? 999 : overrides.indexOf(b.id)));
      return send(res, 200, { mode: overrides.length ? "user_override" : "adaptive", state, tasks });
    }
    if (req.method === "POST" && url.pathname === "/api/queue/reorder") {
      const value = await body(req);
      const pending = db.tasks.filter(task => task.status !== "Done").map(task => task.id);
      let order = Array.isArray(value.order) ? value.order.filter(id => pending.includes(id)) : db.queueOverrides.filter(id => pending.includes(id));
      if (!order.length) {
        const latest = db.featureWindows.at(-1)?.estimate?.state || "unknown";
        const urgency = task => task.deadline ? Math.max(0, 50 - Math.max(0, (Date.parse(`${task.deadline}T23:59:59`) - Date.now()) / 86400000) * 8) : 0;
        order = db.tasks.filter(task => task.status !== "Done").sort((a, b) => urgency(b) - urgency(a) || (latest === "fatigued" ? a.estimate - b.estimate : b.estimate - a.estimate)).map(task => task.id);
      }
      const index = order.indexOf(String(value.taskId));
      const destination = index + (value.direction === "up" ? -1 : value.direction === "down" ? 1 : 0);
      if (index < 0 || destination < 0 || destination >= order.length) return send(res, 400, { error: "Task cannot move in that direction." });
      [order[index], order[destination]] = [order[destination], order[index]];
      db.queueOverrides = order;
      db.queueFeedback.push({ taskId: String(value.taskId), direction: value.direction, state: db.featureWindows.at(-1)?.estimate?.state || "unknown", at: new Date().toISOString() });
      await persist(db, userId); return send(res, 200, { ok: true, mode: "user_override", order });
    }
    if (req.method === "POST" && url.pathname === "/api/queue/reset") { db.queueOverrides = []; await persist(db, userId); return send(res, 200, { ok: true, mode: "adaptive" }); }
    if (req.method === "POST" && url.pathname === "/api/tasks") {
      const value = await body(req); const error = validateTask(value);
      if (error) return send(res, 400, { error });
      const task = { id: randomUUID(), title: String(value.title).trim(), notes: String(value.notes || "").slice(0, 2000), difficulty: value.difficulty || "Medium", estimate: Number(value.estimate), deadline: value.deadline || null, status: "To do", createdAt: new Date().toISOString() };
      db.tasks.unshift(task); await persist(db, userId); return send(res, 201, task);
    }
    if (parts[0] === "api" && parts[1] === "tasks" && parts[2]) {
      const index = db.tasks.findIndex(t => t.id === parts[2]);
      if (index < 0) return send(res, 404, { error: "Task not found." });
      if (req.method === "PATCH") {
        const changes = await body(req); const next = { ...db.tasks[index], ...changes };
        const error = validateTask(next); if (error) return send(res, 400, { error });
        if (!["To do", "In progress", "Done"].includes(next.status)) return send(res, 400, { error: "Invalid task status." });
        db.tasks[index] = next; await persist(db, userId); return send(res, 200, next);
      }
      if (req.method === "DELETE") { const [removed] = db.tasks.splice(index, 1); await persist(db, userId); return send(res, 200, removed); }
    }
    if (req.method === "GET" && url.pathname === "/api/sessions") return send(res, 200, db.sessions);
    if (req.method === "POST" && url.pathname === "/api/sessions") {
      const value = await body(req); const durationSeconds = Number(value.durationSeconds);
      if (!Number.isInteger(durationSeconds) || durationSeconds < 1 || durationSeconds > 86400) return send(res, 400, { error: "Session duration must be between 1 second and 24 hours." });
      const session = { id: randomUUID(), taskId: value.taskId || null, taskTitle: String(value.taskTitle || "Focus session").slice(0, 160), durationSeconds, durationMinutes: durationSeconds / 60, startedAt: value.startedAt || new Date().toISOString(), endedAt: new Date().toISOString(), state: value.state || "focused", createdAt: new Date().toISOString() };
      db.sessions.push(session); await persist(db, userId); return send(res, 201, session);
    }
    if (req.method === "GET" && url.pathname === "/api/dashboard") {
      const today = new Date().toISOString().slice(0, 10);
      const sessionsToday = db.sessions.filter(s => s.endedAt.slice(0, 10) === today);
      const interventionsToday = db.decisions.filter(d => d.createdAt.slice(0, 10) === today).length;
      const latestWindow = db.featureWindows.at(-1) || null;
      return send(res, 200, { tasksOpen: db.tasks.filter(t => t.status !== "Done").length, tasksDone: db.tasks.filter(t => t.status === "Done").length, focusMinutesToday: Math.round(sessionsToday.reduce((sum, s) => sum + s.durationMinutes, 0)), sessionsToday: sessionsToday.length, interventionsToday, latestWindow, nextTasks: db.tasks.filter(t => t.status !== "Done").slice(0, 5) });
    }
    if (req.method === "POST" && url.pathname === "/api/observe") {
      const previousObservation = observationTimes.get(userId) || 0;
      if (Date.now() - previousObservation < 25_000) return send(res, 429, { error: "Signal window received too soon." });
      observationTimes.set(userId, Date.now());
      const value = await body(req);
      const allowed = ["faceAbsenceRatio", "blinkRatePerMinute", "perclosProxy", "headYawProxy", "headPitchProxy", "gazeOffScreenRatio", "eyeAspectRatio", "mouthOpenProxy", "lightLevel", "typingMeanInterKeyMs", "typingPauseRatio", "backspaceRate", "mouseMeanSpeed", "mouseIdleRatio", "clickRate", "scrollRate", "taskSwitchesPerHour", "sessionMinutes", "timeSinceBreakMinutes"];
      const features = Object.fromEntries(allowed.filter(key => value.features?.[key] !== null && value.features?.[key] !== "" && Number.isFinite(Number(value.features?.[key]))).map(key => [key, Number(value.features[key])]));
      for (const key of ["faceAbsenceRatio", "typingPauseRatio", "mouseIdleRatio"]) if (features[key] !== undefined) features[key] = Math.max(0, Math.min(1, features[key]));
      const estimate = estimateState(features, { blinkRatePerMinute: Number(value.calibration?.blinkRatePerMinute) || 0, perclosProxy: Number(value.calibration?.perclosProxy) || 0 });
      const windowRecord = { id: randomUUID(), startedAt: value.startedAt || new Date().toISOString(), endedAt: new Date().toISOString(), features, estimate };
      db.featureWindows.push(windowRecord);
      db.featureWindows = db.featureWindows.filter(item => Date.now() - Date.parse(item.endedAt) <= 90 * 24 * 60 * 60 * 1000).slice(-100_000);
      const intervention = decide(db, features, estimate, { confidence: estimate.confidence, sessionMinutes: features.sessionMinutes || 0, taskDifficulty: Number(value.context?.taskDifficulty) || 2 });
      await persist(db, userId);
      return send(res, 200, { windowId: windowRecord.id, estimate, intervention });
    }
    if (req.method === "GET" && url.pathname === "/api/observe") return send(res, 200, db.featureWindows.slice(-500));
    if (req.method === "GET" && url.pathname === "/api/decisions") return send(res, 200, db.decisions.slice(-100));
    if (req.method === "POST" && url.pathname === "/api/feedback") {
      const value = await body(req);
      const updated = recordFeedback(db, String(value.decisionId || ""), value.reward);
      if (!updated) return send(res, 404, { error: "Decision not found or reward is invalid." });
      await persist(db, userId); return send(res, 200, { ok: true, decision: updated });
    }
    if (req.method === "GET" && url.pathname === "/api/data") return send(res, 200, { tasks: db.tasks, sessions: db.sessions, featureWindows: db.featureWindows, decisions: db.decisions, queueFeedback: db.queueFeedback, settings: db.settings });
    if (req.method === "GET" && url.pathname === "/api/export.csv") {
      const escape = (item) => `"${String(item ?? "").replaceAll('"', '""')}"`;
      const rows = [["type", "timestamp", "state", "confidence", "features"]];
      for (const item of db.featureWindows) rows.push(["feature_window", item.endedAt, item.estimate?.state, item.estimate?.confidence, JSON.stringify(item.features)]);
      for (const item of db.sessions) rows.push(["session", item.endedAt, item.state, "", JSON.stringify({ taskTitle: item.taskTitle, durationMinutes: item.durationMinutes })]);
      const csv = rows.map(row => row.map(escape).join(",")).join("\r\n");
      res.writeHead(200, { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=dualmind-data.csv", "cache-control": "no-store", "x-content-type-options": "nosniff", ...(production ? { "strict-transport-security": "max-age=31536000" } : {}) });
      return res.end(csv);
    }
    if (req.method === "DELETE" && url.pathname === "/api/data") {
      db.tasks = []; db.sessions = []; db.featureWindows = []; db.decisions = [];
      db.queueOverrides = []; db.queueFeedback = [];
      db.settings = { webcamCues: false, activityRhythm: false, appSwitching: false, confidenceThreshold: 75, nudgesPerHour: 0 };
      db.policy = { lastInterventionAt: null, recentInterventions: [], lastState: null, statePersistence: 0 };
      delete db.bandit; ensureBandit(db); await persist(db, userId); return send(res, 200, { ok: true });
    }
    if (req.method === "GET" && url.pathname === "/api/settings") return send(res, 200, db.settings);
    if (req.method === "PATCH" && url.pathname === "/api/settings") {
      const value = await body(req);
      if (value.confidenceThreshold !== undefined) {
        const threshold = Number(value.confidenceThreshold);
        if (!Number.isFinite(threshold) || threshold < 50 || threshold > 95) return send(res, 400, { error: "Confidence threshold must be between 50 and 95." });
        db.settings.confidenceThreshold = threshold;
      }
      if (value.nudgesPerHour !== undefined) {
        const budget = Number(value.nudgesPerHour);
        if (![0, 2, 4, 6].includes(budget)) return send(res, 400, { error: "Nudge budget must be 0, 2, 4 or 6 per hour." });
        db.settings.nudgesPerHour = budget;
      }
      await persist(db, userId); return send(res, 200, db.settings);
    }
    return send(res, 404, { error: "Route not found." });
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : 500;
    if (status === 500) console.error("DualMind request failed:", error);
    return send(res, status, { error: status === 400 ? "Invalid JSON request body." : production ? "Internal server error." : error.message || "Internal server error." });
  }
});
server.listen(port, "0.0.0.0", () => console.log(`DualMind is listening on port ${port}`));
