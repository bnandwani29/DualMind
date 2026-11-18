import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { authConfigured, supabase } from "../lib/supabase";

function AuthScreen() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (!supabase) throw new Error("Authentication is not configured.");
      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        setMessage(data.session ? "Account created. Loading DualMind…" : "Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not sign in."); }
    finally { setBusy(false); }
  }

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#F5F6F8" }}>
    <form onSubmit={submit} style={{ width: "100%", maxWidth: 430, padding: 32, borderRadius: 18, background: "white", boxShadow: "0 12px 35px #10182814", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ color: "#4338CA", fontWeight: 700, fontSize: 18 }}>DualMind</div>
      <div><h1 style={{ fontSize: 28 }}>{mode === "sign-in" ? "Welcome back" : "Create your account"}</h1><p style={{ color: "#475467", lineHeight: 1.55 }}>{mode === "sign-in" ? "Sign in to access your private workspace." : "Your tasks and focus data will be kept in your account."}</p></div>
      <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 600 }}>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} style={{ minHeight: 44, border: "1px solid #D0D5DD", borderRadius: 9, padding: "0 12px", font: "inherit" }} /></label>
      <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 600 }}>Password<input required type="password" minLength={8} autoComplete={mode === "sign-up" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} style={{ minHeight: 44, border: "1px solid #D0D5DD", borderRadius: 9, padding: "0 12px", font: "inherit" }} /><small style={{ color: "#667085", fontWeight: 400 }}>At least 8 characters.</small></label>
      {message && <div role="status" style={{ color: message.startsWith("Check") || message.startsWith("Account") ? "#027A48" : "#B42318", fontSize: 14 }}>{message}</div>}
      <button disabled={busy} type="submit" style={{ minHeight: 46, border: 0, borderRadius: 9, color: "white", background: "#4338CA", fontWeight: 600, cursor: "pointer" }}>{busy ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}</button>
      <button type="button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(""); }} style={{ border: 0, background: "transparent", color: "#4338CA", cursor: "pointer" }}>{mode === "sign-in" ? "New here? Create an account" : "Already have an account? Sign in"}</button>
    </form>
  </main>;
}

export default function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => { if (alive) { setSession(data.session); setLoading(false); } });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => { setSession(nextSession); setLoading(false); });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  if (!authConfigured && import.meta.env.PROD) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui" }}><div><h1>Deployment setup is incomplete</h1><p>Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the hosting dashboard, then redeploy.</p></div></main>;
  if (!authConfigured) return <>{children}</>;
  if (loading) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui" }}>Loading your account…</main>;
  return session ? <>{children}</> : <AuthScreen />;
}
