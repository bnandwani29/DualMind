export type ActiveSessionDraft = {
  taskId: string;
  startedAt: string;
  elapsedMs: number;
  runStartedAt: number;
  running: boolean;
};

const STORAGE_KEY = "dualmind.active-session";

export function readActiveSession(): ActiveSessionDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as ActiveSessionDraft;
    return value && value.startedAt ? value : null;
  } catch { return null; }
}

export function writeActiveSession(session: ActiveSessionDraft | null) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}

export function pauseActiveSession() {
  const session = readActiveSession();
  if (!session?.running) return;
  session.elapsedMs += Math.max(0, Date.now() - session.runStartedAt);
  session.runStartedAt = 0;
  session.running = false;
  writeActiveSession(session);
  window.dispatchEvent(new Event("dualmind:focus-pause"));
}
