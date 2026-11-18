import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/pages/analytics.css";

export default function Analytics() {
  useEffect(() => {
    document.title = "DualMind · Analytics";
  }, []);

  return (
    <div className="s-analytics">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexWrap: "wrap",
          background: "#F5F6F8",
        }}
      >
        <Sidebar active="/analytics" />
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
              <h1 style={{ fontSize: "30px", fontWeight: "600" }}>Analytics</h1>
              <div style={{ fontSize: "14px", color: "#475467" }}>
                10 – 16 November
              </div>
            </div>
            <div
              role="tablist"
              aria-label="Range"
              style={{
                display: "flex",
                gap: "4px",
                background: "#EEF0F4",
                padding: "4px",
                borderRadius: "10px",
              }}
            >
              <button
                type="button"
                role="tab"
                aria-selected="false"
                className="tab"
              >
                Day
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="true"
                className="tab on"
              >
                Week
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="false"
                className="tab"
              >
                Month
              </button>
            </div>
          </header>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: "16px",
            }}
          >
            <div
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "20px",
              }}
            >
              <div className="lbl">Total focus</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                17h 20m
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#027A48",
                  fontWeight: "600",
                }}
              >
                +2h 10m vs last week
              </div>
            </div>
            <div
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "20px",
              }}
            >
              <div className="lbl">Longest focus stretch</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                94 min
              </div>
              <div style={{ fontSize: "13px", color: "#475467" }}>
                Wed, 10:05 AM
              </div>
            </div>
            <div
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "20px",
              }}
            >
              <div className="lbl">Task completion</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                23 / 28
              </div>
              <div style={{ fontSize: "13px", color: "#475467" }}>
                On time: 20
              </div>
            </div>
            <div
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "20px",
              }}
            >
              <div className="lbl">Nudges accepted</div>
              <div
                style={{
                  fontFamily: "'Space Grotesk'",
                  fontSize: "30px",
                  fontWeight: "600",
                }}
              >
                14 / 21
              </div>
              <div style={{ fontSize: "13px", color: "#475467" }}>
                7 dismissed or snoozed
              </div>
            </div>
          </section>
          <section style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            <div
              className="card"
              style={{
                flex: "1.5 1 460px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
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
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  Time by estimated state
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    fontSize: "12px",
                    color: "#344054",
                    flexWrap: "wrap",
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
                </div>
              </div>
              <div
                role="img"
                aria-label="Stacked bars of hours per day by state, Monday to Sunday"
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "18px",
                  height: "220px",
                  borderBottom: "1px solid #E4E7EC",
                  padding: "0 4px",
                }}
              >
                <div className="bar">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "44px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "14px",
                        background: "#5B21B6",
                        borderRadius: "6px 6px 0 0",
                      }}
                    ></div>
                    <div
                      style={{ height: "22px", background: "#F59E0B" }}
                    ></div>
                    <div
                      style={{ height: "120px", background: "#2563EB" }}
                    ></div>
                  </div>
                </div>
                <div className="bar">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "44px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "20px",
                        background: "#5B21B6",
                        borderRadius: "6px 6px 0 0",
                      }}
                    ></div>
                    <div
                      style={{ height: "18px", background: "#F59E0B" }}
                    ></div>
                    <div
                      style={{ height: "100px", background: "#2563EB" }}
                    ></div>
                  </div>
                </div>
                <div className="bar">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "44px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "10px",
                        background: "#5B21B6",
                        borderRadius: "6px 6px 0 0",
                      }}
                    ></div>
                    <div
                      style={{ height: "16px", background: "#F59E0B" }}
                    ></div>
                    <div
                      style={{ height: "168px", background: "#2563EB" }}
                    ></div>
                  </div>
                </div>
                <div className="bar">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "44px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "24px",
                        background: "#5B21B6",
                        borderRadius: "6px 6px 0 0",
                      }}
                    ></div>
                    <div
                      style={{ height: "30px", background: "#F59E0B" }}
                    ></div>
                    <div
                      style={{ height: "96px", background: "#2563EB" }}
                    ></div>
                  </div>
                </div>
                <div className="bar">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "44px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "16px",
                        background: "#5B21B6",
                        borderRadius: "6px 6px 0 0",
                      }}
                    ></div>
                    <div
                      style={{ height: "26px", background: "#F59E0B" }}
                    ></div>
                    <div
                      style={{ height: "110px", background: "#2563EB" }}
                    ></div>
                  </div>
                </div>
                <div className="bar">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "44px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "8px",
                        background: "#5B21B6",
                        borderRadius: "6px 6px 0 0",
                      }}
                    ></div>
                    <div
                      style={{ height: "10px", background: "#F59E0B" }}
                    ></div>
                    <div
                      style={{ height: "60px", background: "#2563EB" }}
                    ></div>
                  </div>
                </div>
                <div className="bar">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "44px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        height: "12px",
                        background: "#5B21B6",
                        borderRadius: "6px 6px 0 0",
                      }}
                    ></div>
                    <div
                      style={{ height: "20px", background: "#F59E0B" }}
                    ></div>
                    <div
                      style={{ height: "130px", background: "#2563EB" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  padding: "0 4px",
                  fontSize: "12px",
                  color: "#475467",
                }}
              >
                <span style={{ flex: "1", textAlign: "center" }}>Mon</span>
                <span style={{ flex: "1", textAlign: "center" }}>Tue</span>
                <span style={{ flex: "1", textAlign: "center" }}>Wed</span>
                <span style={{ flex: "1", textAlign: "center" }}>Thu</span>
                <span style={{ flex: "1", textAlign: "center" }}>Fri</span>
                <span style={{ flex: "1", textAlign: "center" }}>Sat</span>
                <span style={{ flex: "1", textAlign: "center" }}>Today</span>
              </div>
            </div>
            <div
              className="card"
              style={{
                flex: "1 1 340px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                Your best focus hours
              </h2>
              <div
                role="img"
                aria-label="Heatmap of focus by weekday and time; strongest on weekday mornings 9 to 11"
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px repeat(6,minmax(0,1fr))",
                  gap: "4px",
                  fontSize: "11px",
                  color: "#475467",
                  alignItems: "center",
                }}
              >
                <span></span>
                <span style={{ textAlign: "center" }}>8a</span>
                <span style={{ textAlign: "center" }}>10a</span>
                <span style={{ textAlign: "center" }}>12p</span>
                <span style={{ textAlign: "center" }}>2p</span>
                <span style={{ textAlign: "center" }}>4p</span>
                <span style={{ textAlign: "center" }}>8p</span>
                <span>Mon</span>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <div className="hm" style={{ background: "#4338CA" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <div className="hm" style={{ background: "#E0E7FF" }}></div>
                <div className="hm" style={{ background: "#818CF8" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <span>Tue</span>
                <div className="hm" style={{ background: "#818CF8" }}></div>
                <div className="hm" style={{ background: "#4338CA" }}></div>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <div className="hm" style={{ background: "#EEF2FF" }}></div>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <div className="hm" style={{ background: "#E0E7FF" }}></div>
                <span>Wed</span>
                <div className="hm" style={{ background: "#6366F1" }}></div>
                <div className="hm" style={{ background: "#312E81" }}></div>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <div className="hm" style={{ background: "#818CF8" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <span>Thu</span>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <div className="hm" style={{ background: "#6366F1" }}></div>
                <div className="hm" style={{ background: "#E0E7FF" }}></div>
                <div className="hm" style={{ background: "#EEF2FF" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <span>Fri</span>
                <div className="hm" style={{ background: "#818CF8" }}></div>
                <div className="hm" style={{ background: "#4338CA" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <div className="hm" style={{ background: "#E0E7FF" }}></div>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <div className="hm" style={{ background: "#EEF2FF" }}></div>
                <span>Sat</span>
                <div className="hm" style={{ background: "#EEF2FF" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <div className="hm" style={{ background: "#E0E7FF" }}></div>
                <div className="hm" style={{ background: "#EEF2FF" }}></div>
                <span>Sun</span>
                <div className="hm" style={{ background: "#E0E7FF" }}></div>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
                <div className="hm" style={{ background: "#C7D2FE" }}></div>
                <div className="hm" style={{ background: "#818CF8" }}></div>
                <div className="hm" style={{ background: "#6366F1" }}></div>
                <div className="hm" style={{ background: "#A5B4FC" }}></div>
              </div>
              <div
                style={{
                  background: "#EEF2FF",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  color: "#312E81",
                  lineHeight: "1.5",
                }}
              >
                You focus best 9–11 AM on weekdays. DualMind will slot hard
                tasks there.
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
                gap: "14px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                Which nudges help you
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span>Micro-break</span>
                  <span style={{ fontWeight: "600" }}>7 of 8 accepted</span>
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
                      width: "88%",
                      height: "8px",
                      borderRadius: "4px",
                      background: "#4338CA",
                    }}
                  ></div>
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span>Ambient focus mode</span>
                  <span style={{ fontWeight: "600" }}>4 of 5</span>
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
                      width: "80%",
                      height: "8px",
                      borderRadius: "4px",
                      background: "#4338CA",
                    }}
                  ></div>
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span>Queue reorder</span>
                  <span style={{ fontWeight: "600" }}>2 of 4 kept</span>
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
                      width: "50%",
                      height: "8px",
                      borderRadius: "4px",
                      background: "#4338CA",
                    }}
                  ></div>
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span>Quick nudge task</span>
                  <span style={{ fontWeight: "600" }}>1 of 4</span>
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
                      width: "25%",
                      height: "8px",
                      borderRadius: "4px",
                      background: "#4338CA",
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div
              className="card"
              style={{
                flex: "1 1 380px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                Patterns this week
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  padding: "10px 0",
                  borderBottom: "1px solid #EEF0F4",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#F59E0B",
                    marginTop: "7px",
                    flex: "none",
                  }}
                ></span>
                <span>
                  Fatigue usually appears after <b>55–65 minutes</b> without a
                  break.
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  padding: "10px 0",
                  borderBottom: "1px solid #EEF0F4",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#5B21B6",
                    marginTop: "7px",
                    flex: "none",
                  }}
                ></span>
                <span>
                  Distraction peaks on <b>Thursday afternoons</b>.
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  padding: "10px 0",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#2563EB",
                    marginTop: "7px",
                    flex: "none",
                  }}
                ></span>
                <span>
                  After an accepted break, focus recovers within{" "}
                  <b>about 4 minutes</b>.
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
