import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/ambient.css";

export default function AmbientMode() {
  useEffect(() => {
    document.title = "DualMind · Ambient focus mode";
  }, []);

  return (
    <div className="s-ambient">
      <div
        style={{
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: "28px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          background: "#0B0E1A",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "#1E1B4B",
                color: "#C7D2FE",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"></path>
              </svg>
              Ambient focus mode
            </span>
            <span style={{ fontSize: "13px", color: "#9CA3AF" }}>
              Turned on after frequent tab switching
            </span>
          </div>
          <Link to="/focus" className="btn">
            Exit ambient mode
          </Link>
        </header>
        <div
          style={{
            flex: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "720px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "28px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "#9CA3AF",
              }}
            >
              Now working on
            </div>
            <h1
              style={{
                fontSize: "40px",
                fontWeight: "600",
                color: "#F9FAFB",
                lineHeight: "1.2",
              }}
            >
              Implement LinUCB policy update
            </h1>
            <div
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "96px",
                fontWeight: "500",
                color: "#fff",
                letterSpacing: "-.02em",
              }}
            >
              31:05
            </div>
            <div
              style={{
                width: "100%",
                maxWidth: "440px",
                height: "4px",
                borderRadius: "2px",
                background: "#1F2540",
              }}
            >
              <div
                style={{
                  width: "62%",
                  height: "4px",
                  borderRadius: "2px",
                  background: "#818CF8",
                }}
              ></div>
            </div>
            <div
              style={{
                width: "100%",
                maxWidth: "440px",
                textAlign: "left",
                background: "#11162A",
                border: "1px solid #1F2540",
                borderRadius: "16px",
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  color: "#9CA3AF",
                  marginBottom: "4px",
                }}
              >
                Next step
              </div>
              <label className="sub">
                <input type="checkbox" />
                <span>Implement reward update after 10-min horizon</span>
              </label>
            </div>
          </div>
        </div>
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            borderTop: "1px solid #1F2540",
            paddingTop: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              aria-hidden="true"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#141A2E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A5B4FC"
                strokeWidth="1.8"
              >
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M10 21h4M3 3l18 18"></path>
              </svg>
            </span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#F3F4F6",
                }}
              >
                3 notifications held
              </span>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>
                Delivered at 4:55 PM or when you exit
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              fontSize: "13px",
              color: "#9CA3AF",
              flexWrap: "wrap",
            }}
          >
            <span>Sidebar &amp; analytics hidden</span>
            <span>Group chat muted</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#60A5FA",
                }}
              ></span>
              Estimated: Focused · 74%
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
