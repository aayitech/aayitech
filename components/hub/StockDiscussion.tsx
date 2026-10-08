"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";
import styles from "./hub.module.css";

type Comment = { id: string; body: string; author: string; created_at: string };

export default function StockDiscussion({ symbol }: { symbol: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch(`/api/community/stocks?symbol=${encodeURIComponent(symbol)}`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Discussion could not be loaded.");
    setComments(Array.isArray(result.comments) ? result.comments : []);
  }, [symbol]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      refresh().catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Discussion could not be loaded."); });
    }, 0);
    fetch("/api/auth/me").then((response) => response.json()).then((result) => { if (active) setSignedIn(Boolean(result.user)); }).catch(() => {});
    return () => { active = false; window.clearTimeout(timer); };
  }, [refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch(`/api/community/stocks?symbol=${encodeURIComponent(symbol)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: message }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Your comment could not be saved.");
      setMessage(""); await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Your comment could not be saved."); }
    finally { setLoading(false); }
  }

  return <section className={styles.discussionPanel}>
    <div className={styles.discussionHeader}><div><div className={styles.panelKicker}>COMMUNITY VIEW · {symbol}</div><h2>What do you think?</h2><p>Share your perspective respectfully. This is discussion, not financial advice.</p></div><MessageCircle size={19} /></div>
    {signedIn ? <form className={styles.discussionForm} onSubmit={submit}><label className={styles.srOnly} htmlFor="stock-comment">Your market view</label><textarea id="stock-comment" value={message} onChange={(event) => setMessage(event.target.value)} minLength={5} maxLength={1500} required placeholder={`Share your view on ${symbol}…`} /><button type="submit" disabled={loading}>{loading ? "Posting…" : "Post view"}<Send size={13} /></button></form> : <p className={styles.signInPrompt}>Sign in to join the discussion. <Link href="/signup">Create an account</Link></p>}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <div className={styles.commentList}>{comments.length ? comments.map((comment) => <article key={comment.id}><div><b>{comment.author}</b><time>{new Date(comment.created_at).toLocaleString()}</time></div><p>{comment.body}</p></article>) : <p className={styles.communityEmpty}>No views shared yet. Be the first to start a thoughtful discussion.</p>}</div>
  </section>;
}
