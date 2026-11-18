import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { api, Task } from "../lib/api";
import { readActiveSession, writeActiveSession } from "../lib/activeSession";
import "../styles/pages/focus.css";

type Estimate = { state: string; confidence: number; estimator: string };

export default function FocusSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState(() => searchParams.get("taskId") || readActiveSession()?.taskId || "");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [running, setRunning] = useState(() => readActiveSession()?.running || false);
  const [elapsedMs, setElapsedMs] = useState(() => readActiveSession()?.elapsedMs || 0);
  const [startedAt, setStartedAt] = useState<string | null>(() => readActiveSession()?.startedAt || null);
  const [message, setMessage] = useState("");
  const runStartedAtRef = useRef(readActiveSession()?.runStartedAt || 0);
  const elapsedBaseRef = useRef(readActiveSession()?.elapsedMs || 0);

  useEffect(() => {
    document.title = "DualMind · Focus session";
    void api<Task[]>("/tasks").then(setTasks).catch(() => setMessage("Could not load tasks. Check the backend is running."));
    void api<{ estimate?: Estimate }[]>("/observe").then((windows) => {
      const latest = windows[windows.length - 1]; if (latest?.estimate) setEstimate(latest.estimate as Estimate);
    }).catch(() => {});
    const onDecision = (event: Event) => setEstimate((event as CustomEvent<{ estimate?: Estimate }>).detail?.estimate || null);
    window.addEventListener("dualmind:decision", onDecision);
    return () => window.removeEventListener("dualmind:decision", onDecision);
  }, []);

  useEffect(() => {
    if (!running) return;
    const tick = window.setInterval(() => {
      const elapsed = elapsedBaseRef.current + Date.now() - runStartedAtRef.current;
      setElapsedMs(elapsed);
      const draft = readActiveSession();
      if (draft) writeActiveSession({ ...draft, taskId, startedAt: draft.startedAt, elapsedMs: elapsedBaseRef.current, runStartedAt: runStartedAtRef.current, running: true });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [running]);

  const selectedTask = tasks.find((task) => task.id === taskId);
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const time = `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;

  function begin() {
    const newStart = startedAt || new Date().toISOString();
    if (!startedAt) { setStartedAt(newStart); elapsedBaseRef.current = 0; setElapsedMs(0); }
    runStartedAtRef.current = Date.now(); setRunning(true); setMessage("");
    writeActiveSession({ taskId, startedAt: newStart, elapsedMs: elapsedBaseRef.current, runStartedAt: runStartedAtRef.current, running: true });
    window.dispatchEvent(new Event("dualmind:focus-start"));
  }
  function pause() {
    elapsedBaseRef.current += Date.now() - runStartedAtRef.current;
    setElapsedMs(elapsedBaseRef.current); setRunning(false);
    if (startedAt) writeActiveSession({ taskId, startedAt, elapsedMs: elapsedBaseRef.current, runStartedAt: 0, running: false });
    window.dispatchEvent(new Event("dualmind:focus-pause"));
  }
  async function finish(markDone: boolean) {
    const durationMs = elapsedBaseRef.current + (running ? Date.now() - runStartedAtRef.current : 0);
    const seconds = Math.floor(durationMs / 1000);
    setRunning(false);
    if (seconds < 1 || !startedAt) { setMessage("Start a focus session before ending it."); return; }
    writeActiveSession({ taskId, startedAt, elapsedMs: durationMs, runStartedAt: 0, running: false });
    try {
      await api("/sessions", { method: "POST", body: JSON.stringify({ taskId: selectedTask?.id || null, taskTitle: selectedTask?.title || "Focus session", durationSeconds: seconds, startedAt, state: estimate?.state || "focused" }) });
      if (markDone && selectedTask) {
        const updated = await api<Task>(`/tasks/${selectedTask.id}`, { method: "PATCH", body: JSON.stringify({ status: "Done" }) });
        setTasks((all) => all.map((task) => task.id === updated.id ? updated : task));
      }
      setMessage(`Saved ${Math.floor(seconds / 60)} min ${seconds % 60} sec of focus.`);
      window.dispatchEvent(new Event("dualmind:focus-end"));
      setStartedAt(null); elapsedBaseRef.current = 0; setElapsedMs(0);
      writeActiveSession(null);
      navigate("/dashboard");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save this session."); }
  }

  return <div className="s-focus"><div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap", background: "#F5F6F8" }}>
    <Sidebar active="/focus" />
    <main style={{ flex: "999 1 560px", minWidth: 0, boxSizing: "border-box", padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div><div style={{ color: "#667085", fontSize: 13 }}>Focus session</div><h1 style={{ margin: "6px 0", fontSize: 30, fontWeight: 600 }}>Work at your own pace</h1></div>
        <Link to="/ambient" className="btn">Ambient focus mode</Link>
      </header>
      {message && <div role="status" style={{ padding: 12, borderRadius: 9, background: "#EEF2FF", color: "#3730A3", fontSize: 14 }}>{message}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
        <section className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: 30 }}>
          <div style={{ color: "#475467", fontSize: 14 }}>Elapsed focus time</div>
          <div aria-live="off" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 64, fontWeight: 700, color: "#1E1B4B", fontVariantNumeric: "tabular-nums" }}>{time}</div>
          <div style={{ fontSize: 14, color: "#475467" }}>{running ? "Session running" : startedAt ? "Session paused" : "Ready when you are"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {!running ? <button type="button" className="btn pri" onClick={begin}>{startedAt ? "Resume" : "Start focus"}</button> : <button type="button" className="btn" onClick={pause}>Pause</button>}
            <button type="button" className="btn" disabled={!startedAt} onClick={() => void finish(false)}>End and save</button>
          </div>
        </section>
        <section className="card" style={{ display: "flex", flexDirection: "column", gap: 15, padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Choose a task</h2>
          <select value={taskId} onChange={(event) => { setTaskId(event.target.value); const draft = readActiveSession(); if (draft) writeActiveSession({ ...draft, taskId: event.target.value }); }} style={{ minHeight: 44, border: "1px solid #D0D5DD", borderRadius: 9, padding: "0 12px", background: "white", fontSize: 14 }}>
            <option value="">No task selected</option>{tasks.filter((task) => task.status !== "Done").map((task) => <option key={task.id} value={task.id}>{task.title} · {task.estimate} min</option>)}
          </select>
          {selectedTask && <><div style={{ color: "#475467", fontSize: 14 }}>{selectedTask.difficulty} · {selectedTask.status}{selectedTask.deadline ? ` · due ${selectedTask.deadline}` : ""}</div><button type="button" className="btn pri" onClick={() => void finish(true)} disabled={!startedAt}>End session and mark task done</button></>}
          <div style={{ borderTop: "1px solid #EAECF0", paddingTop: 14 }}><div style={{ fontWeight: 600, marginBottom: 6 }}>Recent state estimate</div>{estimate ? <div style={{ color: "#475467", fontSize: 14 }}>Estimated proxy: {estimate.state} · {Math.round(estimate.confidence * 100)}% heuristic confidence</div> : <div style={{ color: "#667085", fontSize: 14 }}>State appears after the first 30-second signal window. This proxy is not scientifically validated.</div>}</div>
          <p style={{ margin: 0, color: "#667085", fontSize: 12, lineHeight: 1.5 }}>Camera frames remain in your browser. The session stores only its duration, optional task link and estimated behavioural proxy.</p>
        </section>
      </div>
    </main>
  </div></div>;
}
