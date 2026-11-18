const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

// An intentionally transparent cold-start proxy. These scores are not a trained
// or empirically calibrated classifier and must not be presented as diagnoses.
export function estimateState(features, calibration = {}) {
  const faceAbsence = clamp(number(features.faceAbsenceRatio));
  const switches = number(features.taskSwitchesPerHour);
  const pauses = clamp(number(features.typingPauseRatio));
  const sessionHours = clamp(number(features.sessionMinutes) / 90);
  const blinkRate = number(features.blinkRatePerMinute);
  const baselineBlink = number(calibration.blinkRatePerMinute);
  const blinkChange = baselineBlink > 0 ? clamp((blinkRate / baselineBlink - 1) / 1.5) : 0;
  const perclos = number(features.perclosProxy);
  const baselinePerclos = number(calibration.perclosProxy);
  const eyeClosureChange = clamp((perclos - baselinePerclos - 0.03) / 0.22);
  const fatigueScore = clamp(0.34 * blinkChange + 0.34 * eyeClosureChange + 0.32 * sessionHours);
  const distractionScore = clamp(0.35 * clamp(switches / 8) + 0.27 * pauses + 0.15 * faceAbsence + 0.15 * clamp(number(features.gazeOffScreenRatio)) + 0.08 * clamp(number(features.headYawProxy) / 0.5));
  const focusedScore = clamp(1 - Math.max(fatigueScore, distractionScore));
  const scores = { focused: focusedScore, fatigued: fatigueScore, distracted: distractionScore };
  const total = scores.focused + scores.fatigued + scores.distracted || 1;
  const probabilities = Object.fromEntries(Object.entries(scores).map(([key, value]) => [key, value / total]));
  const sorted = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  const margin = sorted[0][1] - sorted[1][1];
  // A conservative confidence proxy prevents the UI from treating raw heuristic
  // scores as statistically calibrated probabilities.
  const confidence = clamp(0.5 + margin * 0.45, 0.5, 0.95);
  return { probabilities, state: sorted[0][0], confidence, estimator: "cold_start_heuristic_unvalidated" };
}
