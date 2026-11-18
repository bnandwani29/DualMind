import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Props = { active: string };

export default function Sidebar({ active }: Props) {
  const [camera, setCamera] = useState(() => localStorage.getItem("dualmind.camera-consent") === "enabled");
  const [interaction, setInteraction] = useState(() => localStorage.getItem("dualmind.interaction-consent") === "enabled" || localStorage.getItem("dualmind.app-switching-consent") === "enabled");
  useEffect(() => {
    const sync = () => {
      setCamera(localStorage.getItem("dualmind.camera-consent") === "enabled");
      setInteraction(localStorage.getItem("dualmind.interaction-consent") === "enabled" || localStorage.getItem("dualmind.app-switching-consent") === "enabled");
    };
    window.addEventListener("dualmind:consent-changed", sync);
    return () => window.removeEventListener("dualmind:consent-changed", sync);
  }, []);
  const sensing = camera || interaction;
  return (
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
        <Link
          to="/dashboard"
          className={active === "/dashboard" ? "on" : undefined}
        >
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
        <Link to="/focus" className={active === "/focus" ? "on" : undefined}>
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
        <Link to="/tasks" className={active === "/tasks" ? "on" : undefined}>
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
        <Link to="/queue" className={active === "/queue" ? "on" : undefined}>
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
        <Link
          to="/analytics"
          className={active === "/analytics" ? "on" : undefined}
        >
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
        <Link to="/groups" className={active === "/groups" ? "on" : undefined}>
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
        <Link
          to="/achievements"
          className={active === "/achievements" ? "on" : undefined}
        >
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
        <Link
          to="/settings"
          className={active === "/settings" ? "on" : undefined}
        >
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
              background: sensing ? "#12B76A" : "#98A2B3",
            }}
          ></span>
          {sensing ? "Sensing on" : "Sensing off"}
        </div>
        <div style={{ fontSize: "12px", color: "#475467", lineHeight: "1.5" }}>
          {camera ? "Camera frames stay on this device; only aggregate numbers are used." : interaction ? "Timing, counts and page switches only; typed content is not recorded." : "Camera and interaction sensing are paused."}
        </div>
        <Link to="/settings" style={{ fontSize: "12px", fontWeight: "600" }}>
          Pause or manage
        </Link>
      </div>
    </aside>
  );
}
