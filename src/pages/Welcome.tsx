import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/welcome.css";

export default function Welcome() {
  const navigate = useNavigate();
  const [camera, setCamera] = useState(true);
  const [interaction, setInteraction] = useState(true);
  const [research, setResearch] = useState(false);
  useEffect(() => {
    document.title = "DualMind · Welcome and consent";
  }, []);

  function continueSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("dualmind.camera-consent", camera ? "enabled" : "disabled");
    localStorage.setItem("dualmind.interaction-consent", interaction ? "enabled" : "disabled");
    localStorage.setItem("dualmind.app-switching-consent", interaction ? "enabled" : "disabled");
    localStorage.setItem("dualmind.research-consent", research ? "enabled" : "disabled");
    window.dispatchEvent(new Event("dualmind:consent-changed"));
    navigate("/calibration");
  }

  return (
    <div className="s-welcome">
      <div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap" }}>
        <section
          style={{
            flex: "1 1 420px",
            boxSizing: "border-box",
            background: "#1E1B4B",
            color: "#fff",
            padding: "56px",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              aria-hidden="true"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4338CA"
                strokeWidth="2"
              >
                <circle cx="9" cy="12" r="5"></circle>
                <circle cx="15" cy="12" r="5"></circle>
              </svg>
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontWeight: "700",
                fontSize: "22px",
              }}
            >
              DualMind
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "460px",
            }}
          >
            <h1
              style={{ fontSize: "44px", lineHeight: "1.1", fontWeight: "600" }}
            >
              A workspace that notices when you're running low.
            </h1>
            <p
              style={{
                margin: "0",
                fontSize: "17px",
                lineHeight: "1.6",
                color: "#C7D2FE",
              }}
            >
              DualMind estimates focus, fatigue and distraction from your webcam
              and typing rhythm, then adjusts your tasks, breaks and
              notifications — only when it's confident.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "460px",
            }}
          >
            <div style={{ display: "flex", gap: "14px" }}>
              <span
                aria-hidden="true"
                style={{
                  flex: "none",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#312E81",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C7D2FE"
                  strokeWidth="1.8"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2"></rect>
                  <path d="M8 10V7a4 4 0 0 1 8 0v3"></path>
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: "600" }}>
                  Video never leaves your laptop
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#C7D2FE",
                    lineHeight: "1.5",
                  }}
                >
                  Frames are analysed in the browser and discarded.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "14px" }}>
              <span
                aria-hidden="true"
                style={{
                  flex: "none",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#312E81",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C7D2FE"
                  strokeWidth="1.8"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                  <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"></path>
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: "600" }}>Timing, not content</div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#C7D2FE",
                    lineHeight: "1.5",
                  }}
                >
                  We record how you type, never what you type.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "14px" }}>
              <span
                aria-hidden="true"
                style={{
                  flex: "none",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#312E81",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C7D2FE"
                  strokeWidth="1.8"
                >
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M10 21h4"></path>
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: "600" }}>
                  Fewer, better-timed nudges
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#C7D2FE",
                    lineHeight: "1.5",
                  }}
                >
                  A hard cap on interruptions per hour, set by you.
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          style={{
            flex: "1.2 1 520px",
            boxSizing: "border-box",
            padding: "56px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            style={{
              width: "100%",
              maxWidth: "560px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
            onSubmit={continueSetup}
          >
            <div
              style={{ display: "flex", gap: "8px" }}
              aria-label="Step 1 of 3"
            >
              <span
                style={{
                  flex: "1",
                  height: "4px",
                  borderRadius: "2px",
                  background: "#4338CA",
                }}
              ></span>
              <span
                style={{
                  flex: "1",
                  height: "4px",
                  borderRadius: "2px",
                  background: "#E4E7EC",
                }}
              ></span>
              <span
                style={{
                  flex: "1",
                  height: "4px",
                  borderRadius: "2px",
                  background: "#E4E7EC",
                }}
              ></span>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#475467",
                }}
              >
                Step 1 of 3 · Permissions
              </div>
              <h2 style={{ fontSize: "30px", fontWeight: "600" }}>
                Choose what DualMind can sense
              </h2>
              <p style={{ margin: "0", color: "#475467", lineHeight: "1.6" }}>
                You can change any of these later in Privacy &amp; settings.
              </p>
            </div>
            <label className="opt">
              <input type="checkbox" checked={camera} onChange={(e) => setCamera(e.target.checked)} />
              <span
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span style={{ fontWeight: "600" }}>
                  Webcam attention &amp; fatigue cues{" "}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#027A48",
                      background: "#ECFDF3",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      marginLeft: "6px",
                    }}
                  >
                    Recommended
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#475467",
                    lineHeight: "1.5",
                  }}
                >
                  Blink rate, eye openness, head pose and gaze direction,
                  computed on-device.
                </span>
              </span>
            </label>
            <label className="opt">
              <input type="checkbox" checked={interaction} onChange={(e) => setInteraction(e.target.checked)} />
              <span
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span style={{ fontWeight: "600" }}>
                  Typing &amp; mouse rhythm
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#475467",
                    lineHeight: "1.5",
                  }}
                >
                  Key timing, pauses, mouse speed and tab switches. Works
                  without the camera.
                </span>
              </span>
            </label>
            <label className="opt">
              <input type="checkbox" checked={research} onChange={(e) => setResearch(e.target.checked)} />
              <span
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span style={{ fontWeight: "600" }}>
                  Contribute to the research study{" "}
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#475467",
                    }}
                  >
                    (optional)
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#475467",
                    lineHeight: "1.5",
                  }}
                >
                  Share anonymised numeric features and short in-session
                  check-ins to help evaluate DualMind.
                </span>
              </span>
            </label>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                padding: "14px",
                background: "#EEF2FF",
                borderRadius: "12px",
                fontSize: "13px",
                color: "#312E81",
                lineHeight: "1.5",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                style={{ flex: "none", marginTop: "1px" }}
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 8h.01M11 12h1v4h1"></path>
              </svg>
              <span>
                DualMind estimates behaviour patterns. It does not read brain
                activity or diagnose any condition.
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/settings"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Read full privacy notice
              </Link>
              <button type="submit" className="btn pri">
                Agree and continue
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
