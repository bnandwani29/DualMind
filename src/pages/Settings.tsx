import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiResponse } from "../lib/api";
import { supabase } from "../lib/supabase";
import "../styles/pages/settings.css";

export default function Settings() {
  const [camera, setCamera] = useState(() => localStorage.getItem("dualmind.camera-consent") === "enabled");
  const [interaction, setInteraction] = useState(() => localStorage.getItem("dualmind.interaction-consent") === "enabled");
  const [appSwitching, setAppSwitching] = useState(() => localStorage.getItem("dualmind.app-switching-consent") === "enabled");
  const [research, setResearch] = useState(() => localStorage.getItem("dualmind.research-consent") === "enabled");
  const [confidence, setConfidence] = useState(75);
  const [nudgesPerHour, setNudgesPerHour] = useState(4);
  const [notice, setNotice] = useState("");
  const [dataPreview, setDataPreview] = useState("");
  useEffect(() => {
    document.title = "DualMind · Privacy and settings";
    void api<{ confidenceThreshold: number; nudgesPerHour: number }>("/settings").then((settings) => {
      setConfidence(settings.confidenceThreshold ?? 75); setNudgesPerHour(settings.nudgesPerHour ?? 4);
    }).catch(() => setNotice("Backend unavailable. Start it with npm run server to save settings."));
  }, []);

  function updateConsent(key: string, enabled: boolean, update: (value: boolean) => void) {
    update(enabled); localStorage.setItem(key, enabled ? "enabled" : "disabled");
    window.dispatchEvent(new Event("dualmind:consent-changed"));
    setNotice("Sensing preference saved in this browser.");
  }
  async function updateSetting(changes: Record<string, number>) {
    try { await api("/settings", { method: "PATCH", body: JSON.stringify(changes) }); setNotice("Setting saved."); }
    catch { setNotice("Could not save this setting. Check that the backend is running."); }
  }
  async function deleteData() {
    if (!window.confirm("Delete all your stored tasks, sessions, signal windows, decisions and calibration data? This cannot be undone.")) return;
    try {
      await api("/data", { method: "DELETE" });
      for (const key of ["dualmind.calibration.v1", "dualmind.camera-consent", "dualmind.interaction-consent", "dualmind.app-switching-consent", "dualmind.research-consent", "dualmind.pending-feedback", "dualmind.active-session", "dualmind.break-started-at"]) localStorage.removeItem(key);
      setCamera(false); setInteraction(false); setAppSwitching(false); setResearch(false); setConfidence(75); setNudgesPerHour(0); setNotice("Your stored DualMind data was deleted.");
      window.dispatchEvent(new Event("dualmind:consent-changed"));
    } catch { setNotice("Could not delete data. Check that the backend is running."); }
  }
  async function viewData() {
    try { setDataPreview(JSON.stringify(await api("/data"), null, 2)); }
    catch { setNotice("Could not load your stored data. Please sign in again."); }
  }
  async function downloadCsv() {
    try {
      const response = await apiResponse("/export.csv");
      if (!response.ok) throw new Error("Could not export data.");
      const url = URL.createObjectURL(await response.blob()); const anchor = document.createElement("a");
      anchor.href = url; anchor.download = "dualmind-data.csv"; anchor.click(); URL.revokeObjectURL(url);
    } catch { setNotice("Could not export your data. Please sign in again."); }
  }

  return (
    <div className="s-settings">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexWrap: "wrap",
          background: "#F5F6F8",
        }}
      >
        <aside
          style={{
            flex: "1 1 232px",
            boxSizing: "border-box",
            background: "#fff",
            borderRight: "1px solid #E4E7EC",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 8px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "9px",
                background: "#4338CA",
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
                stroke="#fff"
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
                fontSize: "19px",
              }}
            >
              DualMind
            </span>
          </div>
          <nav
            className="nav"
            aria-label="Main"
            style={{ display: "flex", flexDirection: "column", gap: "2px" }}
          >
            <Link to="/dashboard">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"></path>
              </svg>
              Dashboard
            </Link>
            <Link to="/focus">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Focus session
            </Link>
            <Link to="/tasks">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M10 6h10M10 12h10M10 18h10M4 6h2M4 12h2M4 18h2"></path>
              </svg>
              Tasks
            </Link>
            <Link to="/queue">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3l9 5-9 5-9-5z"></path>
                <path d="M3 13l9 5 9-5"></path>
              </svg>
              Adaptive queue
            </Link>
            <Link to="/analytics">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 20V11M11 20V5M17 20v-7M3 20h18"></path>
              </svg>
              Analytics
            </Link>
            <Link to="/groups">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="8" r="3.5"></circle>
                <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.5.6 4 2.8 4 6"></path>
              </svg>
              Groups
            </Link>
            <Link to="/achievements">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="9" r="6"></circle>
                <path d="M8.5 14L7 22l5-3 5 3-1.5-8"></path>
              </svg>
              Achievements
            </Link>
            <Link to="/settings" className="on">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"></path>
              </svg>
              Privacy &amp; settings
            </Link>
          </nav>
          <div
            style={{
              marginTop: "auto",
              background: "#F5F6F8",
              borderRadius: "12px",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#12B76A",
                }}
              ></span>
              Sensing on
            </div>
            <div
              style={{ fontSize: "12px", color: "#475467", lineHeight: "1.5" }}
            >
              Camera processed on this device. Only numbers are saved.
            </div>
          </div>
        </aside>
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
          {notice && <div role="status" style={{ padding: 12, borderRadius: 9, background: "#EEF2FF", color: "#3730A3", fontSize: 14 }}>{notice}</div>}
          <header
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}><h1 style={{ fontSize: "30px", fontWeight: "600" }}>Privacy &amp; settings</h1><div style={{ fontSize: "14px", color: "#475467" }}>You decide what is sensed, what is kept, and how often DualMind can interrupt.</div></div>
            {supabase && <button className="btn" onClick={() => void supabase?.auth.signOut()}>Sign out</button>}
          </header>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                flex: "1.4 1 480px",
                minWidth: "0",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <section className="card" style={{ padding: "8px 24px" }}>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    padding: "16px 0 4px",
                  }}
                >
                  Sensing
                </h2>
                <label className="set">
                  <span className="t">
                    <b>Webcam cues</b>
                    <span>
                      Eye openness, blinks, head pose and gaze — processed in
                      the browser, frames discarded.
                    </span>
                  </span>
                  <input type="checkbox" role="switch" checked={camera} onChange={(e) => updateConsent("dualmind.camera-consent", e.target.checked, setCamera)} />
                </label>
                <label className="set">
                  <span className="t">
                    <b>Typing &amp; mouse rhythm</b>
                    <span>
                      Timing and counts only. Never the keys you press or text
                      you write.
                    </span>
                  </span>
                  <input type="checkbox" role="switch" checked={appSwitching} onChange={(e) => updateConsent("dualmind.app-switching-consent", e.target.checked, setAppSwitching)} />
                </label>
                <label className="set">
                  <span className="t">
                    <b>Tab &amp; app switching</b>
                    <span>
                      Counts switches by coarse category, not window titles.
                    </span>
                  </span>
                  <input type="checkbox" role="switch" checked={interaction} onChange={(e) => updateConsent("dualmind.interaction-consent", e.target.checked, setInteraction)} />
                </label>
                <div className="set" style={{ borderBottom: "0" }}>
                  <span className="t">
                    <b>Personal baseline</b>
                    <span>Last calibrated 3 days ago</span>
                  </span>
                  <Link to="/calibration" className="btn">
                    Recalibrate
                  </Link>
                </div>
              </section>
              <section className="card" style={{ padding: "8px 24px 20px" }}>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    padding: "16px 0 4px",
                  }}
                >
                  Interventions
                </h2>
                <div className="set" style={{ flexWrap: "wrap" }}>
                  <label
                    htmlFor="conf"
                    className="t"
                    style={{ flex: "1 1 220px" }}
                  >
                    <b>Act only when confidence is at least</b>
                    <span>Higher means fewer but surer nudges.</span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: "1 1 220px",
                    }}
                  >
                    <input
                      id="conf"
                      type="range"
                      min="50"
                      max="95"
                      value={confidence}
                      onChange={(e) => { const value = Number(e.target.value); setConfidence(value); void updateSetting({ confidenceThreshold: value }); }}
                      style={{ flex: "1", accentColor: "#4338CA" }}
                    />
                    <span
                      style={{
                        fontWeight: "700",
                        width: "44px",
                        textAlign: "right",
                      }}
                    >
                      {confidence}%
                    </span>
                  </div>
                </div>
                <div className="set" style={{ flexWrap: "wrap" }}>
                  <label
                    htmlFor="bud"
                    className="t"
                    style={{ flex: "1 1 220px" }}
                  >
                    <b>Most nudges per hour</b>
                    <span>Your interruption budget.</span>
                  </label>
                  <select
                    id="bud"
                    value={nudgesPerHour}
                    onChange={(e) => { const value = Number(e.target.value); setNudgesPerHour(value); void updateSetting({ nudgesPerHour: value }); }}
                    style={{
                      minHeight: "44px",
                      border: "1px solid #D0D5DD",
                      borderRadius: "10px",
                      padding: "0 12px",
                      font: "14px Inter,sans-serif",
                      background: "#fff",
                    }}
                  >
                    <option value="0">0 per hour</option><option value="2">2 per hour</option><option value="4">4 per hour</option><option value="6">6 per hour</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    paddingTop: "14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    DualMind may
                  </div>
                  <label className="ck">
                    <input type="checkbox" defaultChecked />
                    Reorder my task queue
                  </label>
                  <label className="ck">
                    <input type="checkbox" defaultChecked />
                    Suggest micro-breaks and stress-relief activities
                  </label>
                  <label className="ck">
                    <input type="checkbox" defaultChecked />
                    Turn on ambient focus mode and hold notifications
                  </label>
                  <label className="ck">
                    <input type="checkbox" />
                    Surface a short nudge task when I'm distracted
                  </label>
                </div>
              </section>
            </div>
            <div
              style={{
                flex: "1 1 340px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <section
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  Your data
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <span>Stored</span>
                    <span style={{ fontWeight: "600", textAlign: "right" }}>
                      Window features &amp; states
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <span>Never stored</span>
                    <span style={{ fontWeight: "600", textAlign: "right" }}>
                      Video, keystroke content
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <span>Kept for</span>
                    <span style={{ fontWeight: "600" }}>90 days</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <span>Research sharing</span>
                    <span style={{ fontWeight: "600" }}>{research ? "On" : "Off"}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    paddingTop: "6px",
                  }}
                >
                  <button type="button" className="btn" onClick={() => void viewData()}>View my stored data</button>
                  <button type="button" className="btn" onClick={() => void downloadCsv()}>Download as CSV</button>
                  {dataPreview && <pre style={{ maxHeight: 320, overflow: "auto", padding: 12, borderRadius: 8, background: "#F9FAFB", fontSize: 11 }}>{dataPreview}</pre>}
                  <button type="button" className="btn danger" onClick={() => void deleteData()}>
                    Delete all my data
                  </button>
                </div>
              </section>
              <section
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
                  Notifications
                </h2>
                <label
                  className="ck"
                  style={{ justifyContent: "space-between" }}
                >
                  Deadline reminders
                  <input type="checkbox" defaultChecked />
                </label>
                <label
                  className="ck"
                  style={{ justifyContent: "space-between" }}
                >
                  Group session invites
                  <input type="checkbox" defaultChecked />
                </label>
                <label
                  className="ck"
                  style={{ justifyContent: "space-between" }}
                >
                  Streak at risk alert
                  <input type="checkbox" defaultChecked />
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "14px",
                    paddingTop: "4px",
                  }}
                >
                  <span>Quiet hours</span>
                  <span style={{ fontWeight: "600" }}>11 PM – 7 AM</span>
                </div>
              </section>
              <div
                style={{
                  fontSize: "12px",
                  color: "#475467",
                  lineHeight: "1.6",
                }}
              >
                DualMind is an assistive tool. It estimates behaviour, not brain
                activity, and is not meant for employer monitoring.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
