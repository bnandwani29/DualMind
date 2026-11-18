import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFaceTracking } from "../hooks/useFaceTracking";
import { resetSessionClock, startInteractionTelemetry } from "../lib/telemetry";
import { pauseActiveSession } from "../lib/activeSession";
import { api } from "../lib/api";

export function SensorRuntime() {
  const { videoRef, start, stop } = useFaceTracking();
  const { pathname } = useLocation();

  useEffect(() => startInteractionTelemetry(), []);
  useEffect(() => { window.dispatchEvent(new CustomEvent("dualmind:route-change")); }, [pathname]);
  useEffect(() => {
    const syncCamera = () => {
      if (pathname !== "/welcome" && pathname !== "/calibration" && localStorage.getItem("dualmind.camera-consent") === "enabled") void start();
      else stop();
    };
    syncCamera();
    window.addEventListener("dualmind:consent-changed", syncCamera);
    return () => { window.removeEventListener("dualmind:consent-changed", syncCamera); stop(); };
  }, [pathname, start, stop]);
  useEffect(() => { resetSessionClock(); }, []);

  return <video ref={videoRef} autoPlay muted playsInline aria-hidden="true" style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", left: -2, bottom: -2 }} />;
}

type Decision = { id: string; action: string; state: string; confidence: number };
type ObserveResult = { estimate: { state: string; confidence: number; estimator: string }; intervention: Decision & { action: string } };
type PendingFeedback = { decisionId: string; action: string; dueAt: number };

const actionDetails: Record<string, { title: string; body: string; path: string }> = {
  suggest_break: { title: "Take a short reset", body: "A short break may help after a long work stretch.", path: "/break-suggestion" },
  reorder_queue: { title: "Review a lighter next task", body: "Choose a shorter task if your current state feels strained.", path: "/queue" },
  ambient_mode: { title: "Try ambient focus mode", body: "Reduce visual interruptions for your next focus block.", path: "/ambient" },
  nudge_task: { title: "Pick a quick win", body: "A small, clear task may help you get moving again.", path: "/tasks" },
};

export function PolicyNotice() {
  const [notice, setNotice] = React.useState<ObserveResult | null>(null);
  const [pending, setPending] = React.useState<PendingFeedback | null>(() => {
    try { const raw = localStorage.getItem("dualmind.pending-feedback"); return raw ? JSON.parse(raw) as PendingFeedback : null; } catch { return null; }
  });
  const [feedbackDue, setFeedbackDue] = React.useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const onDecision = (event: Event) => {
      const result = (event as CustomEvent<ObserveResult>).detail;
      if (!pending && result?.intervention?.action && result.intervention.action !== "none") setNotice(result);
    };
    window.addEventListener("dualmind:decision", onDecision);
    return () => window.removeEventListener("dualmind:decision", onDecision);
  }, [pending]);
  useEffect(() => {
    if (!pending) return;
    const check = () => setFeedbackDue(Date.now() >= pending.dueAt);
    check(); const timer = window.setInterval(check, 5000);
    return () => window.clearInterval(timer);
  }, [pending]);
  if (!notice && !(pending && feedbackDue)) return null;
  if (pending && feedbackDue) {
    const submit = async (reward: number) => {
      try { await api("/feedback", { method: "POST", body: JSON.stringify({ decisionId: pending.decisionId, reward }) }); } catch { /* feedback is optional */ }
      localStorage.removeItem("dualmind.pending-feedback"); setPending(null); setFeedbackDue(false);
    };
    return <aside className="dm-policy-notice" role="dialog" aria-live="polite"><div><strong>Quick check-in · 10 minutes later</strong><p>Did the “{pending.action.split("_").join(" ")}" suggestion help you stay on track? Your rating updates future suggestions.</p></div><div className="dm-policy-actions"><button onClick={() => void submit(1)}>Yes, helpful</button><button onClick={() => void submit(-1)}>No, not helpful</button></div></aside>;
  }
  if (!notice) return null;
  const intervention = notice.intervention as Decision;
  const detail = actionDetails[intervention.action];
  if (!detail) return null;
  const feedback = async (reward: number) => {
    try { await api("/feedback", { method: "POST", body: JSON.stringify({ decisionId: intervention.id, reward }) }); } catch { /* feedback is optional */ }
    setNotice(null);
  };
  return <aside className="dm-policy-notice" role="status" aria-live="polite">
    <div><strong>DualMind suggestion · estimated {intervention.state}</strong><p>{detail.body} <small>Heuristic estimate · {Math.round(intervention.confidence * 100)}% proxy confidence</small></p></div>
    <div className="dm-policy-actions"><button onClick={() => { const next = { decisionId: intervention.id, action: intervention.action, dueAt: Date.now() + 10 * 60_000 }; localStorage.setItem("dualmind.pending-feedback", JSON.stringify(next)); setPending(next); setNotice(null); if (intervention.action === "suggest_break") pauseActiveSession(); navigate(detail.path, { state: { decision: intervention } }); }}>Try suggestion</button><button onClick={() => void feedback(-0.5)}>Not now</button><button aria-label="Dismiss suggestion" onClick={() => setNotice(null)}>×</button></div>
  </aside>;
}
