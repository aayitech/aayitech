"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import styles from "./hub.module.css";

type ReportRow = { id: string; topic: string; report: { primaryKeyword?: string; summary?: string }; created_at: string };
type AccountUser = { full_name: string; email: string; created_at: string };

export default function AccountDashboard({ user }: { user: AccountUser }) {
  const router = useRouter();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/account/reports").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setReports(data.reports);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Saved research could not be loaded."));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  }

  return <section className={styles.accountDashboard}>
    <div className={styles.accountWelcome}><div><div className={styles.panelKicker}>YOUR AAYI ACCOUNT</div><h2>Welcome, {user.full_name}.</h2><p>{user.email}</p></div><button type="button" className={styles.logoutButton} onClick={logout}><LogOut size={14} /> Sign out</button></div>
    <div className={styles.savedHeader}><div><h3>Saved keyword research</h3><p>Your latest SEO plans, ready when you are.</p></div><Link href="/seo" className={styles.smallLink}>New research <ArrowRight size={14} /></Link></div>
    {error ? <p role="alert" className={styles.error}>{error}</p> : reports.length ? <div className={styles.savedReports}>{reports.map((report) => <article key={report.id}><div><span>{new Date(report.created_at).toLocaleDateString()}</span><h4>{report.report?.primaryKeyword || report.topic}</h4><p>{report.report?.summary || `Keyword research for ${report.topic}`}</p></div><span className={styles.savedTopic}>{report.topic}</span></article>)}</div> : <div className={styles.noReports}><b>No saved research yet.</b><p>Generate your first SEO keyword map and it will appear here.</p><Link href="/seo" className={styles.smallLink}>Open the SEO lab <ArrowRight size={14} /></Link></div>}
  </section>;
}
