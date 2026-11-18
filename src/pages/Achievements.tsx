import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/pages/achievements.css";

export default function Achievements() {
  useEffect(() => {
    document.title = "DualMind · Streaks and badges";
  }, []);

  return (
    <div className="s-achievements">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexWrap: "wrap",
          background: "#F5F6F8",
        }}
      >
        <Sidebar active="/achievements" />
        <main
          style={{
            flex: "999 1 560px",
            minWidth: "0",
            boxSizing: "border-box",
            padding: "32px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <h1 style={{ fontSize: "30px", fontWeight: "600" }}>Achievements</h1>
          <section style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            <div
              className="card"
              style={{
                flex: "1 1 320px",
                background: "#1E1B4B",
                borderColor: "#1E1B4B",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "#312E81",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Space Grotesk'",
                    fontSize: "30px",
                    fontWeight: "700",
                  }}
                >
                  7
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#C7D2FE",
                      fontWeight: "600",
                    }}
                  >
                    Level 7
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk'",
                      fontSize: "24px",
                      fontWeight: "600",
                    }}
                  >
                    Steady Mind
                  </div>
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    color: "#E0E7FF",
                  }}
                >
                  <span>2,340 XP</span>
                  <span>3,000 XP to Level 8</span>
                </div>
                <div
                  style={{
                    height: "10px",
                    borderRadius: "5px",
                    background: "#312E81",
                  }}
                >
                  <div
                    style={{
                      width: "78%",
                      height: "10px",
                      borderRadius: "5px",
                      background: "#A5B4FC",
                    }}
                  ></div>
                </div>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#C7D2FE",
                  lineHeight: "1.5",
                }}
              >
                XP comes from finished tasks and focus time — not from screen
                time alone.
              </div>
            </div>
            <div
              className="card"
              style={{
                flex: "1.6 1 440px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                    12-day streak
                  </h2>
                  <div style={{ fontSize: "13px", color: "#475467" }}>
                    A day counts with 60+ focus minutes. Best: 19 days.
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "#475467",
                  }}
                >
                  Less
                  <span
                    aria-hidden="true"
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      background: "#EEF0F4",
                    }}
                  ></span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      background: "#C7D2FE",
                    }}
                  ></span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      background: "#818CF8",
                    }}
                  ></span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      background: "#4338CA",
                    }}
                  ></span>
                  More
                </div>
              </div>
              <div
                role="img"
                aria-label="Last five weeks of daily focus; the last 12 days all qualify"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7,minmax(0,1fr))",
                  gap: "6px",
                  maxWidth: "420px",
                }}
              >
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#C7D2FE" }}></div>
                <div className="d" style={{ background: "#EEF0F4" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#EEF0F4" }}></div>
                <div className="d" style={{ background: "#C7D2FE" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#C7D2FE" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#EEF0F4" }}></div>
                <div className="d" style={{ background: "#C7D2FE" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#EEF0F4" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#C7D2FE" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#4338CA" }}></div>
                <div className="d" style={{ background: "#818CF8" }}></div>
                <div className="d" style={{ background: "#C7D2FE" }}></div>
                <div
                  className="d"
                  style={{
                    background: "#4338CA",
                    outline: "2px solid #101828",
                    outlineOffset: "2px",
                  }}
                ></div>
              </div>
            </div>
          </section>
          <section
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Badges</h2>
              <span style={{ fontSize: "14px", color: "#475467" }}>
                6 of 10 earned
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
                gap: "16px",
              }}
            >
              <div className="bdg">
                <span
                  className="ic"
                  style={{ background: "#EEF2FF" }}
                  aria-hidden="true"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4338CA"
                    strokeWidth="1.8"
                  >
                    <path d="M2 12c3-6 7-6 10 0s7 6 10 0"></path>
                    <path d="M12 3v4M12 17v4"></path>
                  </svg>
                </span>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>
                  Deep Diver
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  90 min unbroken focus
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#027A48",
                    fontWeight: "600",
                  }}
                >
                  Earned today
                </div>
              </div>
              <div className="bdg">
                <span
                  className="ic"
                  style={{ background: "#FFFAEB" }}
                  aria-hidden="true"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B54708"
                    strokeWidth="1.8"
                  >
                    <path d="M12 2c2 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3 0-3-1-5 0-7z"></path>
                  </svg>
                </span>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>
                  Week on Fire
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  7-day streak
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#027A48",
                    fontWeight: "600",
                  }}
                >
                  Earned 9 Nov
                </div>
              </div>
              <div className="bdg">
                <span
                  className="ic"
                  style={{ background: "#ECFDF3" }}
                  aria-hidden="true"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#027A48"
                    strokeWidth="1.8"
                  >
                    <path d="M4 18h12a4 4 0 0 0 0-8h-1V6H4z"></path>
                    <path d="M15 10h1a2 2 0 0 1 0 4h-1"></path>
                  </svg>
                </span>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>
                  Break Champion
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  Took 10 suggested breaks
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#027A48",
                    fontWeight: "600",
                  }}
                >
                  Earned 12 Nov
                </div>
              </div>
              <div className="bdg">
                <span
                  className="ic"
                  style={{ background: "#FDF2FA" }}
                  aria-hidden="true"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C11574"
                    strokeWidth="1.8"
                  >
                    <circle cx="9" cy="8" r="3.5"></circle>
                    <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 4.5a3.5 3.5 0 0 1 0 7"></path>
                  </svg>
                </span>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>
                  Team Player
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  5 group sessions
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#027A48",
                    fontWeight: "600",
                  }}
                >
                  Earned 14 Nov
                </div>
              </div>
              <div className="bdg">
                <span
                  className="ic"
                  style={{ background: "#EFF4FF" }}
                  aria-hidden="true"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1D4ED8"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"></path>
                  </svg>
                </span>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>
                  Early Bird
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  Focus before 8 AM, 3 times
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#027A48",
                    fontWeight: "600",
                  }}
                >
                  Earned 4 Nov
                </div>
              </div>
              <div className="bdg">
                <span
                  className="ic"
                  style={{ background: "#F4F3FF" }}
                  aria-hidden="true"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5B21B6"
                    strokeWidth="1.8"
                  >
                    <path d="M5 12l5 5 9-10"></path>
                  </svg>
                </span>
                <div style={{ fontWeight: "600", fontSize: "15px" }}>
                  Finisher
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  25 tasks completed
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#027A48",
                    fontWeight: "600",
                  }}
                >
                  Earned 2 Nov
                </div>
              </div>
              <div className="bdg" style={{ background: "#F9FAFB" }}>
                <span
                  className="ic"
                  style={{ background: "#EEF0F4" }}
                  aria-hidden="true"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#475467"
                    strokeWidth="1.8"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                    <path d="M8 11V8a4 4 0 0 1 8 0v3"></path>
                  </svg>
                </span>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#344054",
                  }}
                >
                  Marathoner
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  30-day streak
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "3px",
                    background: "#EEF0F4",
                  }}
                >
                  <div
                    style={{
                      width: "40%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "#818CF8",
                    }}
                  ></div>
                </div>
              </div>
              <div className="bdg" style={{ background: "#F9FAFB" }}>
                <span
                  className="ic"
                  style={{ background: "#EEF0F4" }}
                  aria-hidden="true"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#475467"
                    strokeWidth="1.8"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                    <path d="M8 11V8a4 4 0 0 1 8 0v3"></path>
                  </svg>
                </span>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#344054",
                  }}
                >
                  Zen Master
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  5 sessions, no distraction
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "3px",
                    background: "#EEF0F4",
                  }}
                >
                  <div
                    style={{
                      width: "60%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "#818CF8",
                    }}
                  ></div>
                </div>
              </div>
              <div className="bdg" style={{ background: "#F9FAFB" }}>
                <span
                  className="ic"
                  style={{ background: "#EEF0F4" }}
                  aria-hidden="true"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#475467"
                    strokeWidth="1.8"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                    <path d="M8 11V8a4 4 0 0 1 8 0v3"></path>
                  </svg>
                </span>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#344054",
                  }}
                >
                  Century
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  100 focus hours
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "3px",
                    background: "#EEF0F4",
                  }}
                >
                  <div
                    style={{
                      width: "52%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "#818CF8",
                    }}
                  ></div>
                </div>
              </div>
              <div className="bdg" style={{ background: "#F9FAFB" }}>
                <span
                  className="ic"
                  style={{ background: "#EEF0F4" }}
                  aria-hidden="true"
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#475467"
                    strokeWidth="1.8"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                    <path d="M8 11V8a4 4 0 0 1 8 0v3"></path>
                  </svg>
                </span>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#344054",
                  }}
                >
                  Group Goal
                </div>
                <div style={{ fontSize: "12px", color: "#475467" }}>
                  Hit a weekly group goal
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "3px",
                    background: "#EEF0F4",
                  }}
                >
                  <div
                    style={{
                      width: "72%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "#818CF8",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
