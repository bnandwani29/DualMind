import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { api, Task } from "../lib/api";
import "../styles/pages/queue.css";

type QueueTask = Task & { score: number; reason: string };
type QueueData = { mode: "adaptive" | "user_override"; state: string; tasks: QueueTask[] };

export default function AdaptiveQueue() {
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function refresh() {
    try { setQueue(await api<QueueData>("/queue")); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load the adaptive queue."); }
  }
  useEffect(() => { document.title = "DualMind · Adaptive queue"; void refresh(); }, []);
  async function move(taskId: string, direction: "up" | "down") {
    try {
      await api("/queue/reorder", { method: "POST", body: JSON.stringify({ taskId, direction, order: queue?.tasks.map((task) => task.id) }) });
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not change the order."); }
  }
  async function resetOrder() { try { await api("/queue/reset", { method: "POST" }); await refresh(); } catch { setError("Could not restore the adaptive order."); } }
  const first = queue?.tasks[0];

  return <div className="s-queue"><div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap", background: "#F5F6F8" }}>
    <Sidebar active="/queue" />
    <main style={{ flex: "999 1 560px", minWidth: 0, boxSizing: "border-box", padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div><h1 style={{ fontSize: 30, fontWeight: 600 }}>Adaptive queue</h1><div style={{ color: "#475467", fontSize: 14, marginTop: 6 }}>Suggested order uses your deadlines, task size and latest behavioural proxy. You can move any task yourself.</div></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Link to="/tasks" className="btn">Manage tasks</Link>{queue?.mode === "user_override" && <button className="btn" onClick={() => void resetOrder()}>Restore adaptive order</button>}</div>
      </header>
      {error && <div role="alert" style={{ padding: 12, background: "#FEF3F2", color: "#B42318", borderRadius: 9 }}>{error}</div>}
      <section className="card" style={{ display: "flex", flexDirection: "column", gap: 16, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}><h2 style={{ fontSize: 20, fontWeight: 600 }}>Suggested next tasks</h2><span className="chip">{queue?.mode === "user_override" ? "Your order" : `Adaptive · ${queue?.state || "waiting for signals"}`}</span></div>
        {queue?.tasks.length ? queue.tasks.map((task, index) => <article key={task.id} style={{ display: "grid", gridTemplateColumns: "42px minmax(0,1fr) auto", gap: 14, alignItems: "center", padding: 15, border: "1px solid #EAECF0", borderRadius: 12, background: index === 0 ? "#F8F8FF" : "white" }}>
          <div aria-label={`Rank ${index + 1}`} style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: "50%", background: index === 0 ? "#4338CA" : "#EEF0F4", color: index === 0 ? "white" : "#344054", fontWeight: 700 }}>{index + 1}</div>
          <div><div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}><strong>{task.title}</strong>{task.status === "In progress" && <span className="chip">In progress</span>}</div><div style={{ marginTop: 5, color: "#667085", fontSize: 13 }}>{task.difficulty} · {task.estimate} min{task.deadline ? ` · due ${task.deadline}` : ""} · {task.reason}</div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><button aria-label={`Move ${task.title} up`} className="btn" disabled={index === 0} onClick={() => void move(task.id, "up")}>↑</button><button aria-label={`Move ${task.title} down`} className="btn" disabled={index === queue.tasks.length - 1} onClick={() => void move(task.id, "down")}>↓</button><button className="btn pri" onClick={() => navigate(`/focus?taskId=${encodeURIComponent(task.id)}`)}>Start</button></div>
        </article>) : <div style={{ color: "#667085", padding: 22, textAlign: "center" }}>{queue ? "No open tasks. Add a task to build your queue." : "Loading tasks…"}</div>}
        {first && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderTop: "1px solid #EAECF0", paddingTop: 16 }}><span style={{ color: "#667085", fontSize: 13 }}>Ranking is a transparent heuristic, not a validated prediction. Manual moves are retained as preference feedback.</span><button className="btn pri" onClick={() => navigate(`/focus?taskId=${encodeURIComponent(first.id)}`)}>Start next task</button></div>}
      </section>
    </main>
  </div></div>;
}
