import { FormEvent, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { api, Task } from "../lib/api";
import "../styles/pages/tasks.css";

const control: React.CSSProperties = { width: "100%", boxSizing: "border-box", minHeight: 42, border: "1px solid #D0D5DD", borderRadius: 9, padding: "9px 11px", background: "white", font: "14px Inter,sans-serif" };
const button: React.CSSProperties = { border: "1px solid #D0D5DD", borderRadius: 9, minHeight: 40, padding: "0 14px", background: "white", cursor: "pointer", font: "600 14px Inter,sans-serif" };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [difficulty, setDifficulty] = useState<Task["difficulty"]>("Medium");
  const [statusFilter, setStatusFilter] = useState("All");

  async function refresh() {
    try { setTasks(await api<Task[]>("/tasks")); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load tasks. Start the API with npm run server."); }
  }
  useEffect(() => { document.title = "DualMind · Tasks"; void refresh(); }, []);

  const shown = useMemo(() => tasks.filter((task) =>
    (statusFilter === "All" || task.status === statusFilter) &&
    `${task.title} ${task.notes}`.toLowerCase().includes(query.toLowerCase())), [tasks, query, statusFilter]);
  const openCount = tasks.filter((task) => task.status !== "Done").length;
  const today = new Date().toISOString().slice(0, 10);
  const dueCount = tasks.filter((task) => task.status !== "Done" && task.deadline && task.deadline <= today).length;

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      await api<Task>("/tasks", { method: "POST", body: JSON.stringify({ title: form.get("title"), notes: form.get("notes"), difficulty, estimate: Number(form.get("estimate")), deadline: form.get("deadline") || null }) });
      event.currentTarget.reset(); setDifficulty("Medium"); await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not save task."); }
    finally { setSaving(false); }
  }

  async function updateTask(task: Task, changes: Partial<Task>) {
    try { const updated = await api<Task>(`/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify(changes) }); setTasks((all) => all.map((item) => item.id === updated.id ? updated : item)); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not update task."); }
  }
  async function deleteTask(task: Task) {
    try { await api<Task>(`/tasks/${task.id}`, { method: "DELETE" }); setTasks((all) => all.filter((item) => item.id !== task.id)); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not delete task."); }
  }

  return <div className="s-tasks"><div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap", background: "#F5F6F8" }}>
    <Sidebar active="/tasks" />
    <main style={{ flex: "999 1 560px", minWidth: 0, boxSizing: "border-box", padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div><h1 style={{ fontSize: 30, fontWeight: 600 }}>Tasks</h1><div style={{ fontSize: 14, color: "#475467", marginTop: 6 }}>{openCount} open · {dueCount} due today or overdue</div></div>
        <input aria-label="Search tasks" placeholder="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} style={{ ...control, width: 250 }} />
      </header>
      {error && <div role="alert" style={{ background: "#FEF3F2", color: "#B42318", borderRadius: 9, padding: 12, fontSize: 14 }}>{error}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
        <section className="card" style={{ flex: "1.7 1 520px", minWidth: 0, padding: 0, overflowX: "auto" }}>
          <div style={{ padding: "16px 18px", display: "flex", gap: 8, alignItems: "center", borderBottom: "1px solid #EAECF0" }}>
            <label htmlFor="task-filter" style={{ fontSize: 14, fontWeight: 600 }}>Show</label>
            <select id="task-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...control, width: 155, minHeight: 36, padding: "5px 8px" }}>
              {["All", "To do", "In progress", "Done"].map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 14 }}>
            <thead><tr>{["Task", "Difficulty", "Estimate", "Deadline", "Status", ""].map((head) => <th key={head} style={{ padding: "12px 10px", color: "#475467", fontSize: 12 }}>{head}</th>)}</tr></thead>
            <tbody>{shown.map((task) => <tr key={task.id} style={{ background: task.status === "Done" ? "#F9FAFB" : "white", borderTop: "1px solid #EAECF0" }}>
              <td style={{ padding: 10, minWidth: 155 }}><div style={{ fontWeight: 600, textDecoration: task.status === "Done" ? "line-through" : undefined }}>{task.title}</div>{task.notes && <div style={{ fontSize: 12, color: "#667085", marginTop: 4 }}>{task.notes}</div>}</td>
              <td style={{ padding: 10 }}>{task.difficulty}</td><td style={{ padding: 10, whiteSpace: "nowrap" }}>{task.estimate} min</td><td style={{ padding: 10, whiteSpace: "nowrap" }}>{task.deadline || "—"}</td>
              <td style={{ padding: 10 }}><select aria-label={`Status for ${task.title}`} value={task.status} onChange={(e) => void updateTask(task, { status: e.target.value as Task["status"] })} style={{ ...control, minHeight: 34, padding: "4px 6px", minWidth: 112 }}><option>To do</option><option>In progress</option><option>Done</option></select></td>
              <td style={{ padding: 8 }}><button type="button" aria-label={`Delete ${task.title}`} onClick={() => void deleteTask(task)} style={{ ...button, minHeight: 34, padding: "0 8px", color: "#B42318" }}>Delete</button></td>
            </tr>)}
            {shown.length === 0 && <tr><td colSpan={6} style={{ padding: 28, color: "#667085", textAlign: "center" }}>{tasks.length ? "No tasks match this search." : "No tasks yet. Add your first task."}</td></tr>}</tbody>
          </table>
        </section>
        <form className="card" aria-label="New task" onSubmit={createTask} style={{ flex: "1 1 300px", padding: 24, display: "flex", flexDirection: "column", gap: 15 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>New task</h2>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#344054" }}>Title<input name="title" required maxLength={160} placeholder="What needs doing?" style={{ ...control, marginTop: 6 }} /></label>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#344054" }}>Notes<textarea name="notes" rows={3} placeholder="Optional notes" style={{ ...control, marginTop: 6, resize: "vertical" }} /></label>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#344054" }}>Difficulty<select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Task["difficulty"])} style={{ ...control, marginTop: 6 }}><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#344054" }}>Estimate (minutes)<input name="estimate" type="number" min="1" max="1440" defaultValue="30" required style={{ ...control, marginTop: 6 }} /></label>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#344054" }}>Deadline<input name="deadline" type="date" style={{ ...control, marginTop: 6 }} /></label>
          <button type="submit" disabled={saving} className="btn pri" style={{ alignSelf: "flex-end" }}>{saving ? "Saving…" : "Add task"}</button>
        </form>
      </div>
    </main>
  </div></div>;
}
