import { useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/pages/groups.css";

export default function Groups() {
  useEffect(() => {
    document.title = "DualMind · Groups";
  }, []);

  return (
    <div className="s-groups">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexWrap: "wrap",
          background: "#F5F6F8",
        }}
      >
        <Sidebar active="/groups" />
        <main
          style={{
            flex: "999 1 560px",
            minWidth: "0",
            boxSizing: "border-box",
            padding: "32px 40px",
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignContent: "flex-start",
          }}
        >
          <div
            style={{
              flex: "1 1 240px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Groups</h1>
              <button
                type="button"
                className="btn"
                aria-label="Create group"
                style={{ width: "44px", padding: "0" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
              </button>
            </div>
            <Link
              to="/groups"
              className="grp"
              style={{ background: "#EEF2FF" }}
            >
              <span
                className="av"
                style={{
                  background: "#C7D2FE",
                  color: "#312E81",
                  borderRadius: "12px",
                }}
              >
                DS
              </span>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "0",
                }}
              >
                <span style={{ fontWeight: "600", fontSize: "14px" }}>
                  DSA Prep
                </span>
                <span style={{ fontSize: "12px", color: "#475467" }}>
                  6 members · 4 focusing
                </span>
              </span>
            </Link>
            <Link to="/groups" className="grp">
              <span
                className="av"
                style={{
                  background: "#FDE68A",
                  color: "#78350F",
                  borderRadius: "12px",
                }}
              >
                MP
              </span>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "0",
                }}
              >
                <span style={{ fontWeight: "600", fontSize: "14px" }}>
                  Minor Project Team
                </span>
                <span style={{ fontSize: "12px", color: "#475467" }}>
                  4 members · 1 focusing
                </span>
              </span>
            </Link>
            <Link to="/groups" className="grp">
              <span
                className="av"
                style={{
                  background: "#A7F3D0",
                  color: "#064E3B",
                  borderRadius: "12px",
                }}
              >
                GA
              </span>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "0",
                }}
              >
                <span style={{ fontWeight: "600", fontSize: "14px" }}>
                  GATE 2027
                </span>
                <span style={{ fontSize: "12px", color: "#475467" }}>
                  12 members · 6 focusing
                </span>
              </span>
            </Link>
            <div
              style={{
                marginTop: "8px",
                background: "#fff",
                border: "1px dashed #D0D5DD",
                borderRadius: "12px",
                padding: "14px",
                fontSize: "13px",
                color: "#475467",
                lineHeight: "1.5",
              }}
            >
              Groups see whether you're focusing or on a break — never your
              camera or state scores.
            </div>
          </div>
          <div
            style={{
              flex: "3 1 560px",
              minWidth: "0",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <h2 style={{ fontSize: "28px", fontWeight: "600" }}>
                  DSA Prep
                </h2>
                <div style={{ fontSize: "14px", color: "#475467" }}>
                  Daily practice for placement season
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button type="button" className="btn">
                  Invite
                </button>
                <Link to="/focus" className="btn pri">
                  Join group session · 7 PM
                </Link>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
              <div
                className="card"
                style={{
                  flex: "1.2 1 340px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Members now
                </h3>
                <div className="mem">
                  <span
                    className="av"
                    style={{ background: "#C7D2FE", color: "#312E81" }}
                  >
                    RS
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      Riya S.
                    </div>
                    <div style={{ fontSize: "12px", color: "#475467" }}>
                      Graphs — shortest paths
                    </div>
                  </div>
                  <span
                    className="st"
                    style={{ background: "#EFF4FF", color: "#1D4ED8" }}
                  >
                    Focusing · 42 min
                  </span>
                </div>
                <div className="mem">
                  <span
                    className="av"
                    style={{ background: "#FDE68A", color: "#78350F" }}
                  >
                    AK
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      Arjun K.
                    </div>
                    <div style={{ fontSize: "12px", color: "#475467" }}>
                      DP — knapsack variants
                    </div>
                  </div>
                  <span
                    className="st"
                    style={{ background: "#EFF4FF", color: "#1D4ED8" }}
                  >
                    Focusing · 18 min
                  </span>
                </div>
                <div className="mem">
                  <span
                    className="av"
                    style={{ background: "#E9D5FF", color: "#4C1D95" }}
                  >
                    You
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      You
                    </div>
                    <div style={{ fontSize: "12px", color: "#475467" }}>
                      Implement LinUCB policy update
                    </div>
                  </div>
                  <span
                    className="st"
                    style={{ background: "#EFF4FF", color: "#1D4ED8" }}
                  >
                    Focusing · 24 min
                  </span>
                </div>
                <div className="mem">
                  <span
                    className="av"
                    style={{ background: "#A7F3D0", color: "#064E3B" }}
                  >
                    NP
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      Neha P.
                    </div>
                    <div style={{ fontSize: "12px", color: "#475467" }}>
                      Trees — LCA
                    </div>
                  </div>
                  <span
                    className="st"
                    style={{ background: "#EFF4FF", color: "#1D4ED8" }}
                  >
                    Focusing · 9 min
                  </span>
                </div>
                <div className="mem">
                  <span
                    className="av"
                    style={{ background: "#FBCFE8", color: "#831843" }}
                  >
                    KM
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      Kabir M.
                    </div>
                    <div style={{ fontSize: "12px", color: "#475467" }}>—</div>
                  </div>
                  <span
                    className="st"
                    style={{ background: "#FFFAEB", color: "#93370D" }}
                  >
                    On a break
                  </span>
                </div>
                <div className="mem" style={{ borderBottom: "0" }}>
                  <span
                    className="av"
                    style={{ background: "#E4E7EC", color: "#344054" }}
                  >
                    SA
                  </span>
                  <div style={{ flex: "1", minWidth: "0" }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      Sana A.
                    </div>
                    <div style={{ fontSize: "12px", color: "#475467" }}>
                      Last seen 2 h ago
                    </div>
                  </div>
                  <span
                    className="st"
                    style={{ background: "#F2F4F7", color: "#475467" }}
                  >
                    Offline
                  </span>
                </div>
              </div>
              <div
                style={{
                  flex: "1 1 300px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                    Weekly goal
                  </h3>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk'",
                      fontSize: "28px",
                      fontWeight: "600",
                    }}
                  >
                    18{" "}
                    <span style={{ fontSize: "16px", color: "#475467" }}>
                      / 25 focus hours
                    </span>
                  </div>
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "5px",
                      background: "#EEF0F4",
                    }}
                  >
                    <div
                      style={{
                        width: "72%",
                        height: "10px",
                        borderRadius: "5px",
                        background: "#4338CA",
                      }}
                    ></div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#475467" }}>
                    3 days left · on track
                  </div>
                </div>
                <div
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                    This week
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ fontWeight: "700", width: "18px" }}>1</span>
                    <span style={{ flex: "1" }}>Riya S.</span>
                    <span style={{ fontWeight: "600" }}>5h 10m</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      background: "#EEF2FF",
                      margin: "0 -8px",
                      padding: "6px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: "700", width: "18px" }}>2</span>
                    <span style={{ flex: "1", fontWeight: "600" }}>You</span>
                    <span style={{ fontWeight: "600" }}>4h 35m</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ fontWeight: "700", width: "18px" }}>3</span>
                    <span style={{ flex: "1" }}>Arjun K.</span>
                    <span style={{ fontWeight: "600" }}>3h 50m</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ fontWeight: "700", width: "18px" }}>4</span>
                    <span style={{ flex: "1" }}>Neha P.</span>
                    <span style={{ fontWeight: "600" }}>2h 25m</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                Group chat
              </h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <span
                  className="av"
                  style={{
                    background: "#C7D2FE",
                    color: "#312E81",
                    width: "32px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  RS
                </span>
                <div
                  style={{
                    background: "#F2F4F7",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  Anyone up for a 7 PM session? Doing 3 Dijkstra problems.
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    background: "#4338CA",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  In — after I finish this task.
                </div>
              </div>
              <label
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <span style={{ position: "absolute", left: "-9999px" }}>
                  Message
                </span>
                <input
                  type="text"
                  placeholder="Message DSA Prep"
                  style={{
                    flex: "1",
                    minHeight: "44px",
                    border: "1px solid #D0D5DD",
                    borderRadius: "10px",
                    padding: "0 14px",
                    font: "14px Inter,sans-serif",
                    boxSizing: "border-box",
                  }}
                />
                <button type="button" className="btn pri">
                  Send
                </button>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
