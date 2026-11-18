import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, Task } from "../lib/api";
import { readActiveSession } from "../lib/activeSession";
import "../styles/pages/breather.css";

export default function Breather() {
  const [remaining, setRemaining] = useState(300);
  const [elapsed, setElapsed] = useState(0);
  const [exercise, setExercise] = useState("Breathing");
  const [taskTitle, setTaskTitle] = useState("Focus session");
  useEffect(() => {
    document.title = "DualMind · Stress-relief break";
    const active = readActiveSession();
    if (active?.taskId) void api<Task[]>("/tasks").then((tasks) => setTaskTitle(tasks.find((task) => task.id === active.taskId)?.title || "Focus session")).catch(() => {});
  }, []);
  useEffect(() => {
    const timer = window.setInterval(() => { setRemaining((value) => Math.max(0, value - 1)); setElapsed((value) => value + 1); }, 1000);
    return () => window.clearInterval(timer);
  }, []);
  const phaseSeconds = exercise === "Breathing" ? 4 : exercise === "Eye rest 20-20-20" ? 20 : 30;
  const phaseIndex = Math.floor(elapsed / phaseSeconds) % (exercise === "Breathing" ? 4 : exercise === "Eye rest 20-20-20" ? 3 : 2);
  const phaseLabels = exercise === "Breathing" ? ["Breathe in", "Hold gently", "Breathe out", "Rest"] : exercise === "Eye rest 20-20-20" ? ["Look across the room", "Close your eyes gently", "Look at a nearby object"] : exercise === "Neck & shoulder stretch" ? ["Roll your shoulders gently", "Relax your neck"] : ["Stand, walk and sip water", "Take an easy pause"];
  const phaseRemaining = phaseSeconds - (elapsed % phaseSeconds);
  const rounds = Math.min(6, Math.floor(elapsed / 60) + 1);
  function endBreak() {
    window.dispatchEvent(new Event("dualmind:break-completed"));
    localStorage.removeItem("dualmind.break-started-at");
  }

  return (
    <div className="s-breather">
      <div
        style={{
          minHeight: "100vh",
          boxSizing: "border-box",
          padding: "32px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
          background: "#EEF2F6",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              Break
            </span>
          </div>
          <div style={{ fontSize: "14px", color: "#334155" }}>
            <span style={{ fontWeight: "600" }}>{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</span> left · in-app nudges paused
          </div>
        </div>
        <div
          role="radiogroup"
          aria-label="Break activity"
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            role="radio"
            aria-checked={exercise === "Breathing"}
            className={exercise === "Breathing" ? "act on" : "act"}
            onClick={() => { setExercise("Breathing"); setElapsed(0); }}
          >
            Breathing
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={exercise === "Eye rest 20-20-20"}
            className={exercise === "Eye rest 20-20-20" ? "act on" : "act"}
            onClick={() => { setExercise("Eye rest 20-20-20"); setElapsed(0); }}
          >
            Eye rest 20-20-20
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={exercise === "Neck & shoulder stretch"}
            className={exercise === "Neck & shoulder stretch" ? "act on" : "act"}
            onClick={() => { setExercise("Neck & shoulder stretch"); setElapsed(0); }}
          >
            Neck &amp; shoulder stretch
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={exercise === "Walk & water"}
            className={exercise === "Walk & water" ? "act on" : "act"}
            onClick={() => { setExercise("Walk & water"); setElapsed(0); }}
          >
            Walk &amp; water
          </button>
        </div>
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "28px",
            padding: "16px 0",
          }}
        >
          <div
            role="img"
            aria-label={`${exercise} guide, ${phaseLabels[phaseIndex]}`}
            style={{
              width: "340px",
              height: "340px",
              borderRadius: "50%",
              background: "#E0E7FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "270px",
                height: "270px",
                borderRadius: "50%",
                background: "#C7D2FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: "#4338CA",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Grotesk'",
                    fontSize: "28px",
                    fontWeight: "600",
                  }}
                >
                  {remaining ? phaseLabels[phaseIndex] : "Break complete"}
                </div>
                <div style={{ fontSize: "16px", color: "#E0E7FF" }}>{remaining ? phaseRemaining : "✓"}</div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "28px", fontWeight: "600" }}>
              {exercise === "Breathing" ? "Box breathing" : exercise}
            </h1>
            <p
              style={{
                margin: "0",
                color: "#334155",
                fontSize: "16px",
                lineHeight: "1.6",
                maxWidth: "460px",
              }}
            >
              {exercise === "Breathing" ? "In for 4, hold for 4, out for 4, hold for 4. Let your shoulders drop on each exhale." : exercise === "Eye rest 20-20-20" ? "Give your eyes a short change of focus. Keep the exercise comfortable." : exercise === "Neck & shoulder stretch" ? "Move gently, stop if anything feels uncomfortable, and relax your shoulders." : "Stand up if you can, walk a little, and drink some water."}
            </p>
          </div>
          <div
            style={{ display: "flex", gap: "6px" }}
            aria-label={`Round ${rounds} of 6 · ${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds left`}
          >
            {Array.from({ length: 5 }, (_, index) => <span key={index} style={{ width: "32px", height: "6px", borderRadius: "3px", background: rounds > index ? "#4338CA" : "#CBD5E1" }} />)}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "13px", color: "#475569" }}>Back to</span>
            <span style={{ fontWeight: "600" }}>
              {taskTitle}
            </span>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={() => setRemaining((value) => value + 120)}>
              +2 min
            </button>
            <Link
              to="/focus"
              className="btn"
              onClick={endBreak}
              style={{
                background: "#1E1B4B",
                borderColor: "#1E1B4B",
                color: "#fff",
              }}
            >
              End break
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
