"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import styles from "./hub.module.css";

export default function AuthForm({ initialMode = "signup" }: { initialMode?: "signup" | "login" }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, email, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not complete your request.");
      router.push("/account"); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); }
    finally { setLoading(false); }
  }

  return <section className={styles.authWrap}>
    <div className={styles.authIntro}><div className={styles.authIcon}><LockKeyhole size={20} /></div><div className={styles.panelKicker}>YOUR AAYI ACCOUNT</div><h2>{mode === "signup" ? "Make a little room to grow." : "Good to have you back."}</h2><p>{mode === "signup" ? "Create your profile and keep useful AAYI tools close. Account storage activates when the Railway database is connected." : "Sign in to return to your AAYI account."}</p><div className={styles.accountBenefits}><span>✓ Your profile in one place</span><span>✓ Return to useful tools</span><span>✓ Free to create an account</span></div></div>
    <form className={styles.authForm} onSubmit={submit}>
      <div className={styles.authTabs}><button type="button" className={mode === "signup" ? styles.authTabActive : ""} onClick={() => { setMode("signup"); setError(""); }}>Create account</button><button type="button" className={mode === "login" ? styles.authTabActive : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button></div>
      {mode === "signup" && <label className={styles.field}>Your name<span className={styles.authInput}><UserRound size={15} /><input required minLength={2} maxLength={100} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Ambreen Fatima" autoComplete="name" /></span></label>}
      <label className={styles.field}>Email address<span className={styles.authInput}><Mail size={15} /><input required type="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></span></label>
      <label className={styles.field}>Password<span className={styles.authInput}><LockKeyhole size={15} /><input required type="password" minLength={mode === "signup" ? 8 : undefined} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === "signup" ? "At least 8 characters" : "Your password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} /></span></label>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button className={styles.submitButton} type="submit" disabled={loading}>{loading && <LoaderCircle className={styles.spinner} size={15} />}{loading ? "Please wait…" : mode === "signup" ? "Create free account" : "Sign in"}</button>
      <p className={styles.authFoot}>Account information is stored by AAYI TECH. Never reuse a password from another site.</p>
    </form>
  </section>;
}
