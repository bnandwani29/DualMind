import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFaceTracking } from "../hooks/useFaceTracking";
import "../styles/pages/calibration.css";

const OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
const features = [
  "Create a baseline from camera-derived eye and face-presence signals",
  "Measure typing timing and pause patterns without saving typed text",
  "Keep raw camera frames on this device; save only aggregate numbers",
];

type CalibrationData = {
  version: 1; calibratedAt: string; cameraEnabled: boolean; durationSeconds: number;
  blinkCount: number; blinkRatePerMinute: number; meanInterKeyIntervalMs: number | null;
  typingPauseRatio: number | null; backspaceCount: number; keystrokeCount: number;
  perclosProxy: number; eyeAspectRatio: number | null; headYawProxy: number | null;
  headPitchProxy: number | null; gazeOffScreenRatio: number;
};

export default function Calibration() {
  const navigate = useNavigate();
  const { videoRef, snapshot, start, stop } = useFaceTracking();
  const [step, setStep] = useState<1 | 2>(1);
  const [seconds, setSeconds] = useState(60);
  const [activeCameraSeconds, setActiveCameraSeconds] = useState(0);
  const [typingSeconds, setTypingSeconds] = useState(0);
  const [typedKeys, setTypedKeys] = useState(0);
  const typedKeysRef = useRef(0);
  const intervalsRef = useRef<number[]>([]);
  const lastKeyAtRef = useRef<number | null>(null);
  const pauseCountRef = useRef(0);
  const backspaceCountRef = useRef(0);
  const cameraConsented = localStorage.getItem("dualmind.camera-consent") === "enabled";

  useEffect(() => { document.title = "DualMind · Calibration"; }, []);
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (step === 1 && snapshot.detected) {
        setActiveCameraSeconds((elapsed) => {
          const next = elapsed + 1;
          if (next >= 60) { setStep(2); setSeconds(30); return 60; }
          setSeconds(60 - next);
          return next;
        });
      } else if (step === 2 && typedKeysRef.current > 0 && lastKeyAtRef.current !== null && performance.now() - lastKeyAtRef.current < 3000) {
        setTypingSeconds((elapsed) => {
          const next = elapsed + 1;
          setSeconds(Math.max(0, 30 - next));
          return Math.min(next, 30);
        });
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, snapshot.detected]);

  function trackKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab" || event.key.startsWith("Arrow") || event.key === "Shift" || event.key === "Control" || event.key === "Alt") return;
    const now = performance.now();
    if (event.key === "Backspace") backspaceCountRef.current += 1;
    if (lastKeyAtRef.current !== null) {
      const gap = now - lastKeyAtRef.current;
      if (gap <= 10000) intervalsRef.current.push(gap);
      if (gap > 2000) pauseCountRef.current += 1;
    }
    lastKeyAtRef.current = now;
    typedKeysRef.current += 1;
    setTypedKeys(typedKeysRef.current);
  }

  function saveCalibration(cameraEnabled: boolean) {
    const gaps = intervalsRef.current;
    const profile: CalibrationData = {
      version: 1, calibratedAt: new Date().toISOString(), cameraEnabled,
      durationSeconds: activeCameraSeconds,
      blinkCount: cameraEnabled ? snapshot.blinkCount : 0,
      blinkRatePerMinute: cameraEnabled && activeCameraSeconds ? snapshot.blinkCount / (activeCameraSeconds / 60) : 0,
      perclosProxy: cameraEnabled && snapshot.faceSeenFrames ? snapshot.closedEyeFrames / snapshot.faceSeenFrames : 0,
      eyeAspectRatio: cameraEnabled ? snapshot.eyeAspectRatio : null,
      headYawProxy: cameraEnabled ? snapshot.headYawProxy : null,
      headPitchProxy: cameraEnabled ? snapshot.headPitchProxy : null,
      gazeOffScreenRatio: cameraEnabled && snapshot.gazeOffScreen ? 1 : 0,
      meanInterKeyIntervalMs: gaps.length ? gaps.reduce((sum, n) => sum + n, 0) / gaps.length : null,
      typingPauseRatio: gaps.length ? pauseCountRef.current / gaps.length : null,
      backspaceCount: backspaceCountRef.current, keystrokeCount: typedKeys,
    };
    localStorage.setItem("dualmind.calibration.v1", JSON.stringify(profile));
    localStorage.setItem("dualmind.camera-consent", cameraEnabled ? "enabled" : "disabled");
    stop();
    navigate("/dashboard");
  }

  const progress = step === 1 ? (activeCameraSeconds / 60) * 100 : (typingSeconds / 30) * 100;
  const lightStatus = snapshot.lightLevel === null ? "Waiting for camera" : snapshot.lightLevel < 45 ? "Low — add light" : snapshot.lightLevel > 215 ? "Very bright" : "Good";

  return (
    <div className="s-calibration">
      <main className="cal-shell">
        <header className="cal-top"><Link to="/welcome" className="cal-brand"><span className="cal-brand-icon">◉</span>DualMind</Link><span className="cal-step-label">Step {step + 1} of 3 · Calibration</span></header>
        <section className="cal-heading"><div>Privacy first · Frames stay on your device</div><h1>Let's learn your normal</h1><p>A short baseline helps the system compare your eye and typing patterns with your own typical behaviour. These are behavioural proxies, not a diagnosis or direct measure of attention.</p></section>
        <div className="cal-layout">
          <section className="cal-camera-card" aria-label="On-device face tracking preview">
            <video ref={videoRef} className="cal-video" autoPlay muted playsInline aria-label="Local camera preview" />
            <svg className="cal-landmarks" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
              {snapshot.detected && OVAL.map((from, i) => {
                const a = snapshot.landmarks[from]; const b = snapshot.landmarks[OVAL[i + 1]];
                return a && b ? <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8b9cff" strokeWidth="0.004" /> : null;
              })}
              {snapshot.detected && [33, 133, 362, 263, 1, 10, 152].map((id) => {
                const p = snapshot.landmarks[id]; return p ? <circle key={id} cx={p.x} cy={p.y} r="0.008" fill="#d2d9ff" /> : null;
              })}
            </svg>
            {!snapshot.detected && <div className="cal-face-guide" aria-hidden="true"><span /></div>}
            <div className="cal-badges"><span className={`cal-badge ${snapshot.detected ? "good" : snapshot.status === "error" ? "bad" : "neutral"}`}><i />{snapshot.detected ? "Face detected" : snapshot.status === "error" ? "Camera unavailable" : snapshot.status === "starting" ? "Starting…" : "Camera off"}</span><span className="cal-badge neutral">Processing on this device</span></div>
            {cameraConsented && snapshot.status !== "live" && snapshot.status !== "error" && <button type="button" className="cal-start" onClick={() => void start()} disabled={snapshot.status === "starting"}>{snapshot.status === "starting" ? "Starting camera…" : "Start camera"}</button>}
            <div className="cal-caption"><div><strong>{snapshot.detected ? step === 1 ? "Look at the screen as you normally would" : "Keep the camera on while you type" : snapshot.status === "error" ? "Camera access needs attention" : "Start the camera to begin calibration"}</strong><span>{step === 1 ? `${seconds}s left · 60 seconds with your face in view` : `${seconds}s left · type a short sample below`}</span></div><div className="cal-progress"><span style={{ width: `${progress}%` }} /></div>{snapshot.status === "error" && <p role="alert" className="cal-error">{snapshot.message}</p>}</div>
          </section>
          <aside className="cal-aside">
            <section className="cal-card"><h2>Calibration steps</h2>{features.map((feature, i) => <div className="cal-feature" key={feature}><span className={i + 1 <= step ? "done" : "pending"}>{i + 1 < step ? "✓" : i + 1}</span><p>{feature}</p></div>)}
              <div className="cal-step-state"><b>Step {step === 1 ? "1" : "2"} of 2</b><span>{step === 1 ? snapshot.detected ? "Measuring eye blink baseline" : "Waiting for a detected face" : "Measuring typing rhythm"}</span></div>
            </section>
            <section className="cal-card"><h2>Live signal quality</h2><div className="cal-metric"><span>Camera</span><b>{snapshot.status === "live" ? "Connected" : snapshot.status === "error" ? "Unavailable" : "Not started"}</b></div><div className="cal-metric"><span>Face landmarks</span><b className={snapshot.detected ? "ok" : "muted"}>{snapshot.detected ? "Tracking" : "Waiting"}</b></div><div className="cal-metric"><span>Lighting</span><b className={lightStatus === "Good" ? "ok" : "muted"}>{lightStatus}</b></div><div className="cal-metric"><span>Blinks measured</span><b>{snapshot.blinkCount}</b></div><p className="cal-privacy">Video is analyzed in this browser only. It is never sent to the backend or saved. Only calibration statistics are stored in this browser.</p></section>
            {step === 2 && <section className="cal-card cal-typing"><h2>Type a short sample</h2><p>Type naturally for 30 seconds. We count timing and pauses only. Text is not recorded.</p><textarea aria-label="Typing rhythm calibration sample" placeholder="Start typing here…" onKeyDown={trackKey} disabled={snapshot.status !== "live" || !snapshot.detected} /></section>}
            <button type="button" className="btn pri cal-action" disabled={!cameraConsented || (step === 1 ? activeCameraSeconds < 60 : typingSeconds < 30 || typedKeys < 5)} onClick={() => saveCalibration(true)}>{step === 1 ? "Complete camera baseline" : "Finish calibration"}</button>
            {!cameraConsented && <div className="cal-note">Camera sensing is off based on your consent choice. Continue with interaction-only signals below.</div>}
            {cameraConsented && snapshot.status === "error" && <button type="button" className="btn cal-action" onClick={() => void start()}>Try camera again</button>}
            <button type="button" className="btn cal-action" onClick={() => saveCalibration(false)}>Skip — use interaction signals only</button>
            <small className="cal-note">Camera permission can be revoked in your browser at any time.</small>
          </aside>
        </div>
      </main>
    </div>
  );
}
