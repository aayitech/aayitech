"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Search } from "lucide-react";
import styles from "./hub.module.css";

type Keyword = { keyword: string; intent: string; cluster: string; priority: string; why: string };
type Report = { summary: string; primaryKeyword: string; keywords: Keyword[]; pageTitle: string; metaDescription: string; contentAngles: string[]; faqIdeas: string[] };

export default function KeywordResearch() {
  const [topic, setTopic] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [audience, setAudience] = useState("");
  const [business, setBusiness] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setReport(null); setSaved(false); setLoading(true);
    try {
      const response = await fetch("/api/tools/keywords", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, country, audience, business }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Keyword research could not be generated.");
      setReport(result.report as Report); setSaved(Boolean(result.saved));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className={styles.toolGrid}>
      <form className={styles.panel} onSubmit={generate}>
        <div className={styles.panelKicker}>START WITH YOUR BUSINESS</div>
        <label className={styles.field}>What do you offer or want to rank for?<input required minLength={3} maxLength={180} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. handmade leather bags" /></label>
        <div className={styles.twoFields}><label className={styles.field}>Target country<select value={country} onChange={(event) => setCountry(event.target.value)}><option>Pakistan</option><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Australia</option><option>India</option><option>Global / English</option></select></label><label className={styles.field}>Business type<input maxLength={160} value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="e.g. online store" /></label></div>
        <label className={styles.field}>Who is your ideal customer?<input maxLength={240} value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="e.g. gift shoppers looking for quality" /></label>
        <button className={styles.submitButton} type="submit" disabled={loading}>{loading ? <LoaderCircle className={styles.spinner} size={16} /> : <Search size={16} />}{loading ? "Building your keyword map…" : "Generate keyword research"}</button>
        <p className={styles.formNote}>Your research is saved to your account automatically when you&apos;re signed in.</p>
        {error && <p role="alert" className={styles.error}>{error}</p>}
      </form>
      {report ? <section className={styles.report} aria-live="polite">
        <div className={styles.reportHead}><div><div className={styles.panelKicker}>YOUR SEO OPPORTUNITY MAP</div><h2>{report.primaryKeyword}</h2></div><span className={styles.statusPill}>{saved ? "SAVED TO ACCOUNT" : "AI IDEAS"}</span></div>
        <p className={styles.reportSummary}>{report.summary}</p>
        <div className={styles.metricNote}>These are AI generated topic ideas and intent estimates. No live search volume or difficulty scores are shown.</div>
        <div className={styles.tableWrap}><table className={styles.keywordTable}><thead><tr><th>Keyword idea</th><th>Intent</th><th>Cluster</th><th>Priority</th></tr></thead><tbody>{report.keywords?.map((item, index) => { const priority = item.priority?.toLowerCase(); const priorityClass = priority === "high" ? styles.priority_high : priority === "medium" ? styles.priority_medium : styles.priority_low; return <tr key={`${item.keyword}-${index}`}><td><b>{item.keyword}</b><small>{item.why}</small></td><td>{item.intent}</td><td>{item.cluster}</td><td><span className={`${styles.priority} ${priorityClass}`}>{item.priority}</span></td></tr>; })}</tbody></table></div>
        <div className={styles.reportExtras}><div className={styles.extraCard}><h3>Suggested page title</h3><p>{report.pageTitle}</p><h3>Meta description</h3><p>{report.metaDescription}</p></div><div className={styles.extraCard}><h3>Content angles</h3><ul>{report.contentAngles?.map((idea) => <li key={idea}>{idea}</li>)}</ul></div><div className={styles.extraCard}><h3>People also ask</h3><ul>{report.faqIdeas?.map((idea) => <li key={idea}>{idea}</li>)}</ul></div></div>
      </section> : <section className={styles.emptyResearch}><span className={styles.emptyIcon}><Search size={22} /></span><div className={styles.panelKicker}>A USEFUL KEYWORD PLAN, NOT JUST A WORD LIST</div><h2>Find the right angle.</h2><p>Get search-intent groupings, high-priority topics, a page title, meta description, article ideas, and FAQ prompts tailored to your audience.</p><div className={styles.outputList}><span>01 <b>Keyword clusters</b></span><span>02 <b>Search intent</b></span><span>03 <b>Ready-to-use content brief</b></span></div></section>}
    </div>
  );
}
