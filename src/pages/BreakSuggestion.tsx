import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import "../styles/pages/break-suggestion.css";

export default function BreakSuggestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [signal, setSignal] = useState<Record<string, number | string> | null>(null);
  const [decision, setDecision] = useState<{ state: string; confidence: number } | null>(() => (location.state as { decision?: { state: string; confidence: number } } | null)?.decision || null);
  useEffect(() => {
    document.title = "DualMind · Smart break suggestion";
    void api<{ features: Record<string, number | string> }[]>("/observe").then((windows) => setSignal(windows[windows.length - 1]?.features || null)).catch(() => {});
    if (!decision) void api<{ state: string; confidence: number }[]>("/decisions").then((items) => setDecision(items[items.length - 1] || null)).catch(() => {});
  }, [decision]);

  async function dismiss(reward: number) {
    try {
      const pending = JSON.parse(localStorage.getItem("dualmind.pending-feedback") || "null");
      if (pending?.decisionId) await api("/feedback", { method: "POST", body: JSON.stringify({ decisionId: pending.decisionId, reward }) });
      localStorage.removeItem("dualmind.pending-feedback");
    } catch { /* The suggestion remains dismissible if the backend is unavailable. */ }
    navigate("/dashboard");
  }

  function snooze() {
    try {
      const pending = JSON.parse(localStorage.getItem("dualmind.pending-feedback") || "null");
      if (pending) localStorage.setItem("dualmind.pending-feedback", JSON.stringify({ ...pending, dueAt: Date.now() + 10 * 60_000 }));
    } catch { /* optional */ }
    navigate("/dashboard");
  }

  return (
    <div className="s-break-suggestion">
      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          background: "#F5F6F8",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            flex: "1 1 232px",
            background: "#fff",
            borderRight: "1px solid #E4E7EC",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxSizing: "border-box",
          }}
        >
          <div className="sk" style={{ height: "32px", width: "140px" }}></div>
          <div
            className="sk"
            style={{ height: "20px", marginTop: "20px" }}
          ></div>
          <div
            className="sk"
            style={{ height: "20px", background: "#C7D2FE" }}
          ></div>
          <div className="sk" style={{ height: "20px" }}></div>
          <div className="sk" style={{ height: "20px" }}></div>
          <div className="sk" style={{ height: "20px" }}></div>
        </div>
        <div
          aria-hidden="true"
          style={{
            flex: "999 1 560px",
            padding: "32px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            boxSizing: "border-box",
          }}
        >
          <div className="sk" style={{ height: "40px", width: "50%" }}></div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1.6 1 480px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div
                className="sk"
                style={{
                  height: "260px",
                  background: "#fff",
                  border: "1px solid #E4E7EC",
                }}
              ></div>
              <div
                className="sk"
                style={{
                  height: "260px",
                  background: "#fff",
                  border: "1px solid #E4E7EC",
                }}
              ></div>
            </div>
            <div
              className="sk"
              style={{
                flex: "1 1 320px",
                height: "540px",
                background: "#fff",
                border: "1px solid #E4E7EC",
              }}
            ></div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            inset: "0",
            background: "rgba(16,24,40,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bt"
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 24px 48px rgba(16,24,40,.25)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "28px 28px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "#FFFAEB",
                    color: "#93370D",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#F59E0B",
                    }}
                  ></span>
                  {decision?.state || "Break suggestion"} · {decision ? `${Math.round(decision.confidence * 100)}% proxy confidence` : "heuristic estimate"}
                </span>
                <span style={{ fontSize: "13px", color: "#475467" }}>
                  Optional · based on recent signals
                </span>
              </div>
              <h2
                id="bt"
                style={{
                  fontSize: "26px",
                  fontWeight: "600",
                  lineHeight: "1.2",
                }}
              >
                Time for a 5-minute reset?
              </h2>
              <p
                style={{
                  margin: "0",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#344054",
                }}
              >
                This suggestion came from recent behavioural-proxy estimates. It is optional; use your judgement about whether a short pause fits your work.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Link to="/breather" className="btn pri" onClick={() => localStorage.setItem("dualmind.break-started-at", String(Date.now()))}>
                  Take a 5-minute break
                </Link>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn"
                    style={{ flex: "1 1 160px" }}
                    onClick={snooze}
                  >
                    Snooze 10 min
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ flex: "1 1 160px" }}
                    onClick={() => void dismiss(-0.5)}
                  >
                    Not now
                  </button>
                </div>
              </div>
            </div>
            <details
              open
              style={{
                borderTop: "1px solid #E4E7EC",
                background: "#F9FAFB",
                padding: "16px 28px 20px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#3730A3",
                  minHeight: "28px",
                }}
              >
                Why am I seeing this?
              </summary>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "10px",
                }}
              >
                <div className="sig">
                  <span>Blink rate</span>
                    <span style={{ fontWeight: "600" }}>{signal?.blinkRatePerMinute !== undefined ? `${Number(signal.blinkRatePerMinute).toFixed(1)} / min` : "No recent window"}</span>
                </div>
                <div className="sig">
                  <span>Eyes mostly closed (PERCLOS)</span>
                  <span style={{ fontWeight: "600" }}>{signal?.perclosProxy !== undefined ? `${(Number(signal.perclosProxy) * 100).toFixed(0)}% proxy` : "No recent window"}</span>
                </div>
                <div className="sig">
                  <span>Typing pauses</span>
                  <span style={{ fontWeight: "600" }}>{signal?.typingPauseRatio !== undefined ? `${(Number(signal.typingPauseRatio) * 100).toFixed(0)}% pauses` : "No recent window"}</span>
                </div>
                <div className="sig" style={{ borderBottom: "0" }}>
                  <span>Time since last break</span>
                  <span style={{ fontWeight: "600" }}>{signal?.timeSinceBreakMinutes !== undefined ? `${Math.round(Number(signal.timeSinceBreakMinutes))} min` : "Not available"}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#475467",
                  lineHeight: "1.5",
                  marginTop: "8px",
                }}
              >
                Estimates use a heuristic and have not been validated in human studies. Your response is stored as feedback for later suggestions.
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
