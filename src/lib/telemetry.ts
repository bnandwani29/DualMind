type Totals = {
  startedAt: number; activeMs: number; keyIntervals: number[]; keystrokes: number;
  backspaces: number; pauses: number; clickCount: number; scrollCount: number;
  routeSwitches: number; mouseSpeeds: number[]; lastKeyAt: number | null;
  lastMouse: { x: number; y: number; at: number } | null; lastActivityAt: number;
  faceFrames: number; faceMissingFrames: number; blinks: number; lightTotal: number; lightCount: number;
  closedEyeFrames: number; numericFaceSamples: number; yawTotal: number; pitchTotal: number;
  gazeTotal: number; eyeAspectTotal: number; mouthOpenTotal: number;
};

let totals: Totals | null = null;
let timer: number | undefined;
let lastBreakAt = Date.now();
let sessionStartedAt = Date.now();
let focusActiveStartedAt: number | null = null;
let focusElapsedMs = 0;
let listenersInstalled = false;

function freshTotals(): Totals {
  const now = Date.now();
  return { startedAt: now, activeMs: 0, keyIntervals: [], keystrokes: 0, backspaces: 0, pauses: 0, clickCount: 0, scrollCount: 0, routeSwitches: 0, mouseSpeeds: [], lastKeyAt: null, lastMouse: null, lastActivityAt: now, faceFrames: 0, faceMissingFrames: 0, blinks: 0, lightTotal: 0, lightCount: 0, closedEyeFrames: 0, numericFaceSamples: 0, yawTotal: 0, pitchTotal: 0, gazeTotal: 0, eyeAspectTotal: 0, mouthOpenTotal: 0 };
}

function preferences() {
  return {
    interaction: localStorage.getItem("dualmind.interaction-consent") === "enabled",
    appSwitching: localStorage.getItem("dualmind.app-switching-consent") === "enabled",
    camera: localStorage.getItem("dualmind.camera-consent") === "enabled",
  };
}

export function recordFaceSignals(detected: boolean, blink: boolean, lightLevel: number | null, features?: { closedEyes?: boolean; yaw?: number; pitch?: number; gaze?: number; eyeAspectRatio?: number; mouthOpen?: number }) {
  if (!totals) return;
  totals.faceFrames += 1;
  if (!detected) totals.faceMissingFrames += 1;
  if (blink) totals.blinks += 1;
  if (features && detected) {
    totals.numericFaceSamples += 1;
    if (features.closedEyes) totals.closedEyeFrames += 1;
    totals.yawTotal += Math.abs(features.yaw || 0);
    totals.pitchTotal += Math.abs(features.pitch || 0);
    totals.gazeTotal += features.gaze || 0;
    totals.eyeAspectTotal += features.eyeAspectRatio || 0;
    totals.mouthOpenTotal += features.mouthOpen || 0;
  }
  if (lightLevel !== null) recordLightLevel(lightLevel);
}

export function recordLightLevel(lightLevel: number) {
  if (!totals) return;
  totals.lightTotal += lightLevel;
  totals.lightCount += 1;
}

export function startInteractionTelemetry() {
  if (listenersInstalled) return () => {};
  listenersInstalled = true;
  totals = freshTotals();
  const noteActivity = () => { if (totals) totals.lastActivityAt = Date.now(); };
  const onKey = (event: KeyboardEvent) => {
    if (!totals) return;
    const now = Date.now();
    if (totals.lastKeyAt !== null) {
      const gap = now - totals.lastKeyAt;
      if (gap <= 10_000) totals.keyIntervals.push(gap);
      if (gap > 2_000) totals.pauses += 1;
    }
    totals.lastKeyAt = now;
    totals.keystrokes += 1;
    if (event.key === "Backspace") totals.backspaces += 1;
    noteActivity();
  };
  const onMove = (event: MouseEvent) => {
    if (!totals) return;
    const now = Date.now();
    const last = totals.lastMouse;
    if (last) {
      const delta = now - last.at;
      if (delta > 0 && delta < 1500) totals.mouseSpeeds.push(Math.hypot(event.clientX - last.x, event.clientY - last.y) / delta);
    }
    totals.lastMouse = { x: event.clientX, y: event.clientY, at: now };
    noteActivity();
  };
  const onClick = () => { if (totals) totals.clickCount += 1; noteActivity(); };
  const onScroll = () => { if (totals) totals.scrollCount += 1; noteActivity(); };
  const onVisibility = () => { if (totals) totals.routeSwitches += 1; noteActivity(); };
  const onRoute = () => { if (totals) totals.routeSwitches += 1; noteActivity(); };
  const onBreak = () => { lastBreakAt = Date.now(); noteActivity(); };
  const onFocusStart = () => { if (focusActiveStartedAt === null) focusActiveStartedAt = Date.now(); noteActivity(); };
  const onFocusPause = () => { if (focusActiveStartedAt !== null) focusElapsedMs += Date.now() - focusActiveStartedAt; focusActiveStartedAt = null; lastBreakAt = Date.now(); noteActivity(); };
  const onFocusEnd = () => { onFocusPause(); focusElapsedMs = 0; sessionStartedAt = Date.now(); };
  const onConsent = () => { const p = preferences(); if (!p.interaction && !p.camera && !p.appSwitching) totals = freshTotals(); else if (!totals) totals = freshTotals(); };
  window.addEventListener("keydown", onKey);
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("click", onClick, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("dualmind:route-change", onRoute);
  window.addEventListener("dualmind:break-completed", onBreak);
  window.addEventListener("dualmind:focus-start", onFocusStart);
  window.addEventListener("dualmind:focus-pause", onFocusPause);
  window.addEventListener("dualmind:focus-end", onFocusEnd);
  window.addEventListener("dualmind:consent-changed", onConsent);

  timer = window.setInterval(async () => {
    const consent = preferences();
    if (!consent.interaction && !consent.camera && !consent.appSwitching) return;
    if (!totals) totals = freshTotals();
    const current = totals;
    const seconds = Math.max(1, (Date.now() - current.startedAt) / 1000);
    const gaps = current.keyIntervals;
    const speeds = current.mouseSpeeds;
    const features = {
      ...(consent.camera ? {
        faceAbsenceRatio: current.faceFrames ? current.faceMissingFrames / current.faceFrames : 1,
        blinkRatePerMinute: current.blinks / (seconds / 60),
        perclosProxy: current.numericFaceSamples ? current.closedEyeFrames / current.numericFaceSamples : 0,
        headYawProxy: current.numericFaceSamples ? current.yawTotal / current.numericFaceSamples : 0,
        headPitchProxy: current.numericFaceSamples ? current.pitchTotal / current.numericFaceSamples : 0,
        gazeOffScreenRatio: current.numericFaceSamples ? current.gazeTotal / current.numericFaceSamples : 0,
        eyeAspectRatio: current.numericFaceSamples ? current.eyeAspectTotal / current.numericFaceSamples : 0,
        mouthOpenProxy: current.numericFaceSamples ? current.mouthOpenTotal / current.numericFaceSamples : 0,
        lightLevel: current.lightCount ? current.lightTotal / current.lightCount : null,
      } : {}),
      ...(consent.interaction ? {
        typingMeanInterKeyMs: gaps.length ? gaps.reduce((sum, value) => sum + value, 0) / gaps.length : 0,
        typingPauseRatio: gaps.length ? current.pauses / gaps.length : 0,
        backspaceRate: current.keystrokes ? current.backspaces / current.keystrokes : 0,
        mouseMeanSpeed: speeds.length ? speeds.reduce((sum, value) => sum + value, 0) / speeds.length : 0,
        mouseIdleRatio: Math.min(1, Math.max(0, (Date.now() - current.lastActivityAt) / 30_000)),
        clickRate: current.clickCount * 2,
        scrollRate: current.scrollCount * 2,
        sessionMinutes: Math.max(0, (focusElapsedMs + (focusActiveStartedAt === null ? 0 : Date.now() - focusActiveStartedAt)) / 60_000),
        timeSinceBreakMinutes: Math.max(0, (Date.now() - lastBreakAt) / 60_000),
      } : {}),
      ...(consent.appSwitching ? { taskSwitchesPerHour: current.routeSwitches * 120 } : {}),
    };
    const calibration = localStorage.getItem("dualmind.calibration.v1");
    totals = freshTotals();
    try {
      const response = await api<{ estimate: unknown; intervention: unknown }>("/observe", { method: "POST", body: JSON.stringify({ startedAt: new Date(current.startedAt).toISOString(), features, calibration: calibration ? JSON.parse(calibration) : null }) });
      window.dispatchEvent(new CustomEvent("dualmind:decision", { detail: response }));
    } catch { /* Keep gathering the next numeric window; the API may be starting. */ }
  }, 30_000);
  const stop = () => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined; listenersInstalled = false; totals = null;
    window.removeEventListener("keydown", onKey); window.removeEventListener("mousemove", onMove);
    window.removeEventListener("click", onClick); window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("dualmind:route-change", onRoute);
    window.removeEventListener("dualmind:break-completed", onBreak);
    window.removeEventListener("dualmind:focus-start", onFocusStart);
    window.removeEventListener("dualmind:focus-pause", onFocusPause);
    window.removeEventListener("dualmind:focus-end", onFocusEnd);
    window.removeEventListener("dualmind:consent-changed", onConsent);
  };
  return stop;
}

export function resetSessionClock() { sessionStartedAt = Date.now(); focusActiveStartedAt = null; focusElapsedMs = 0; lastBreakAt = Date.now(); }
import { api } from "./api";
