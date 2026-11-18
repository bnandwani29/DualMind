import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { api } from "../lib/api";
import "../styles/pages/dashboard.css";

type Summary = { tasksOpen: number; tasksDone: number; focusMinutesToday: number; sessionsToday: number; interventionsToday: number; latestWindow: { estimate?: { state: string; confidence: number; probabilities: Record<string, number> } } | null };
type ObserveUpdate = { estimate: { state: string; confidence: number; probabilities: Record<string, number> } };
const emptySummary: Summary = { tasksOpen: 0, tasksDone: 0, focusMinutesToday: 0, sessionsToday: 0, interventionsToday: 0, latestWindow: null };

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [budget, setBudget] = useState(4);
  const [estimate, setEstimate] = useState<ObserveUpdate["estimate"] | null>(null);
  useEffect(() => {
    document.title = "DualMind · Dashboard";
    void api<Partial<Summary>>("/dashboard").then((data) => setSummary({ ...emptySummary, ...data })).catch(() => {});
    void api<{ nudgesPerHour: number }>("/settings").then((data) => setBudget(data.nudgesPerHour ?? 4)).catch(() => {});
    const onDecision = (event: Event) => setEstimate((event as CustomEvent<ObserveUpdate>).detail?.estimate || null);
    window.addEventListener("dualmind:decision", onDecision);
    return () => window.removeEventListener("dualmind:decision", onDecision);
  }, []);

  const currentEstimate = estimate || summary.latestWindow?.estimate || null;
  const stateName = currentEstimate?.state || "Collecting signals";
  const confidencePercent = Math.round((currentEstimate?.confidence || 0) * 100);
  const focusedPercent = Math.round((currentEstimate?.probabilities?.focused || 0) * 100);
  const fatiguedPercent = Math.round((currentEstimate?.probabilities?.fatigued || 0) * 100);
  const distractedPercent = Math.round((currentEstimate?.probabilities?.distracted || 0) * 100);
  const focusHours = Math.floor(summary.focusMinutesToday / 60);
  const focusMinutes = summary.focusMinutesToday % 60;

  return (
    <div className="s-dashboard">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexWrap: "wrap",
          background: "#F5F6F8",
        }}
      >
        <Sidebar active="/dashboard" />
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
          <header
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <div className="lbl">{new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</div>
              <h1 style={{ fontSize: "32px", fontWeight: "600" }}>
                Good evening — you're in a good flow
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                className="chip"
                style={{ background: "#EFF4FF", color: "#1D4ED8" }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#2563EB",
                  }}
                ></span>
                Estimated proxy: {stateName}{currentEstimate ? ` · ${confidencePercent}%` : ""}
              </span>
              <Link to="/focus" className="btn pri">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 4l13 8-13 8z"></path>
                </svg>
                Start focus session
              </Link>
            </div>
          </header>
          <section
            aria-label="Today at a glance"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: "16px",
            }}
          >
            <div
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div className="lbl">Focus time today</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                {focusHours ? `${focusHours}h ` : ""}{focusMinutes}m
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#027A48",
                  fontWeight: "600",
                }}
              >
                {summary.sessionsToday} focus sessions recorded today
              </div>
            </div>
            <div
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div className="lbl">Tasks done</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                {summary.tasksDone}{" "}
                <span style={{ fontSize: "18px", color: "#475467" }}>/ {summary.tasksDone + summary.tasksOpen}</span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: "3px",
                  background: "#EEF0F4",
                }}
              >
                <div
                  style={{
                    width: `${summary.tasksDone + summary.tasksOpen ? summary.tasksDone / (summary.tasksDone + summary.tasksOpen) * 100 : 0}%`,
                    height: "6px",
                    borderRadius: "3px",
                    background: "#4338CA",
                  }}
                ></div>
              </div>
            </div>
            <div
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div className="lbl">Streak</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                {summary.sessionsToday ? "Active today" : "No streak yet"}
              </div>
              <div style={{ fontSize: "13px", color: "#475467" }}>
                A day counts after 60 minutes of focus
              </div>
            </div>
            <div
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div className="lbl">Nudges this hour</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                {summary.interventionsToday}{" "}
                <span style={{ fontSize: "18px", color: "#475467" }}>
                  / {budget} max
                </span>
              </div>
              <div style={{ fontSize: "13px", color: "#475467" }}>
                Interruption budget
              </div>
            </div>
          </section>
          <section style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            <div
              className="card"
              style={{
                flex: "1 1 380px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                    Current state
                  </h2>
                  <div style={{ fontSize: "13px", color: "#475467" }}>
                    Transparent, unvalidated behavioural proxy · updates every 30 s
                  </div>
                </div>
                <span className="chip">{currentEstimate ? `${confidencePercent}% proxy confidence` : "Waiting for first window"}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  role="img"
                  aria-label={currentEstimate ? `${stateName}, ${confidencePercent} percent proxy confidence` : "Waiting for a signal window"}
                  style={{
                    width: "132px",
                    height: "132px",
                    borderRadius: "50%",
                    background: `conic-gradient(#2563EB 0 ${focusedPercent}%,#EEF0F4 ${focusedPercent}% 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "104px",
                      height: "104px",
                      borderRadius: "50%",
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Space Grotesk'",
                        fontSize: "28px",
                        fontWeight: "700",
                      }}
                    >
                      {focusedPercent}%
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#1D4ED8",
                      }}
                    >
                      {currentEstimate ? stateName : "Waiting"}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    flex: "1 1 200px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>Focused</span>
                      <span>{focusedPercent}%</span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        background: "#EEF0F4",
                      }}
                    >
                      <div
                        style={{
                          width: `${focusedPercent}%`,
                          height: "8px",
                          borderRadius: "4px",
                          background: "#2563EB",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>Fatigued</span>
                      <span>{fatiguedPercent}%</span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        background: "#EEF0F4",
                      }}
                    >
                      <div
                        style={{
                          width: `${fatiguedPercent}%`,
                          height: "8px",
                          borderRadius: "4px",
                          background: "#F59E0B",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>Distracted</span>
                      <span>{distractedPercent}%</span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        background: "#EEF0F4",
                      }}
                    >
                      <div
                        style={{
                          width: `${distractedPercent}%`,
                          height: "8px",
                          borderRadius: "4px",
                          background: "#5B21B6",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span className="chip">Camera · on-device</span>
                <span className="chip">Typing rhythm</span>
                <span className="chip">Mouse activity</span>
                <span className="chip">Task switching</span>
              </div>
            </div>
            <div
              className="card"
              style={{
                flex: "1.3 1 420px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Up next</h2>
                <Link
                  to="/queue"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                >
                  Open queue
                </Link>
              </div>
              <div
                style={{
                  background: "#EFF4FF",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color: "#1E3A8A",
                }}
              >
                You're focused — harder work moved to the top while it lasts.
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 0",
                    borderBottom: "1px solid #EEF0F4",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk'",
                      fontWeight: "700",
                      color: "#475467",
                      width: "20px",
                    }}
                  >
                    1
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "15px" }}>
                      Implement LinUCB policy update
                    </div>
                    <div style={{ fontSize: "13px", color: "#475467" }}>
                      Research code · 50 min
                    </div>
                  </div>
                  <span
                    className="chip"
                    style={{ background: "#FEF3F2", color: "#B42318" }}
                  >
                    Hard
                  </span>
                  <span className="chip">Due today</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 0",
                    borderBottom: "1px solid #EEF0F4",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk'",
                      fontWeight: "700",
                      color: "#475467",
                      width: "20px",
                    }}
                  >
                    2
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "15px" }}>
                      Write Related Work section
                    </div>
                    <div style={{ fontSize: "13px", color: "#475467" }}>
                      Research paper · 40 min
                    </div>
                  </div>
                  <span
                    className="chip"
                    style={{ background: "#FFFAEB", color: "#B54708" }}
                  >
                    Medium
                  </span>
                  <span className="chip">Thu</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 0",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk'",
                      fontWeight: "700",
                      color: "#475467",
                      width: "20px",
                    }}
                  >
                    3
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "15px" }}>
                      Review DAiSEE label mapping
                    </div>
                    <div style={{ fontSize: "13px", color: "#475467" }}>
                      Dataset · 20 min
                    </div>
                  </div>
                  <span
                    className="chip"
                    style={{ background: "#ECFDF3", color: "#027A48" }}
                  >
                    Easy
                  </span>
                  <span className="chip">Fri</span>
                </div>
              </div>
            </div>
          </section>
          <section style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            <div
              className="card"
              style={{
                flex: "1.6 1 480px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                  Today's state timeline
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    fontSize: "12px",
                    color: "#344054",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: "#2563EB",
                      }}
                    ></span>
                    Focused
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: "#F59E0B",
                      }}
                    ></span>
                    Fatigued
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: "#5B21B6",
                      }}
                    ></span>
                    Distracted
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: "#D0D5DD",
                      }}
                    ></span>
                    Break / away
                  </span>
                </div>
              </div>
              <div
                role="img"
                aria-label="State timeline from 2 PM to now"
                style={{
                  display: "flex",
                  height: "36px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  gap: "2px",
                }}
              >
                <div style={{ flex: "14", background: "#2563EB" }}></div>
                <div style={{ flex: "3", background: "#5B21B6" }}></div>
                <div style={{ flex: "10", background: "#2563EB" }}></div>
                <div style={{ flex: "5", background: "#F59E0B" }}></div>
                <div style={{ flex: "4", background: "#D0D5DD" }}></div>
                <div style={{ flex: "16", background: "#2563EB" }}></div>
                <div style={{ flex: "2", background: "#5B21B6" }}></div>
                <div style={{ flex: "12", background: "#2563EB" }}></div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#475467",
                }}
              >
                <span>2 PM</span>
                <span>3 PM</span>
                <span>4 PM</span>
                <span>5 PM</span>
                <span>Now</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  borderTop: "1px solid #EEF0F4",
                  paddingTop: "14px",
                }}
              >
                <div style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
                  <span style={{ color: "#475467", width: "64px" }}>
                    —
                  </span>
                  <span>
                    <b>Intervention history</b> {summary.interventionsToday ? `${summary.interventionsToday} suggestion(s) today` : "will appear after the policy fires"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
                  <span style={{ color: "#475467", width: "64px" }}>
                    —
                  </span>
                  <span>
                    State is a heuristic proxy and has not been validated against human-subject data.
                  </span>
                </div>
              </div>
            </div>
            <div
              className="card"
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
                  DSA Prep group
                </h2>
                <Link
                  to="/groups"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                >
                  View
                </Link>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div style={{ display: "flex" }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#C7D2FE",
                      border: "2px solid #fff",
                    }}
                  ></span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#FDE68A",
                      border: "2px solid #fff",
                      marginLeft: "-8px",
                    }}
                  ></span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#A7F3D0",
                      border: "2px solid #fff",
                      marginLeft: "-8px",
                    }}
                  ></span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#FBCFE8",
                      border: "2px solid #fff",
                      marginLeft: "-8px",
                    }}
                  ></span>
                </div>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Group presence is not connected in this local demo.
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                  }}
                >
                  <span>Weekly group goal</span>
                  <span style={{ fontWeight: "600" }}>Not connected</span>
                </div>
                <div
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    background: "#EEF0F4",
                  }}
                >
                  <div
                    style={{
                      width: "72%",
                      height: "8px",
                      borderRadius: "4px",
                      background: "#4338CA",
                    }}
                  ></div>
                </div>
              </div>
              <Link
                to="/achievements"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "#F9FAFB",
                  textDecoration: "none",
                  color: "#101828",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "#EEF2FF",
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
                    stroke="#4338CA"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="9" r="6"></circle>
                    <path d="M8.5 14L7 22l5-3 5 3-1.5-8"></path>
                  </svg>
                </span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    New badge: Deep Diver
                  </span>
                  <span style={{ fontSize: "12px", color: "#475467" }}>
                    90 minutes of unbroken focus
                  </span>
                </span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
