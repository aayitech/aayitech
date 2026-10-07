"use client";

import { FormEvent, useState } from "react";
import { Bot, LoaderCircle, Send, UserRound } from "lucide-react";
import styles from "./hub.module.css";

type Message = { role: "user" | "assistant"; content: string };
const starter: Message = { role: "assistant", content: "Hi, I’m the AAYI site assistant. Ask me where to find something, how a tool works, or what this hub can help with." };

export default function SiteAssistant() {
  const [messages, setMessages] = useState<Message[]>([starter]);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = question.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next); setQuestion(""); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-8) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "The assistant could not respond.");
      setMessages([...next, { role: "assistant", content: result.answer }]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); }
    finally { setBusy(false); }
  }

  return <section className={styles.chatPanel}>
    <div className={styles.chatTop}><span className={styles.chatAvatar}><Bot size={18} /></span><div><b>AAYI assistant</b><small>Here to help you find your way</small></div><span className={styles.online}><i /> READY</span></div>
    <div className={styles.chatMessages} aria-live="polite">{messages.map((message, index) => <div className={`${styles.chatMessage} ${message.role === "user" ? styles.userMessage : ""}`} key={`${index}-${message.role}`}><span className={styles.messageAvatar}>{message.role === "user" ? <UserRound size={14} /> : <Bot size={14} />}</span><p>{message.content}</p></div>)}{busy && <div className={styles.chatMessage}><span className={styles.messageAvatar}><Bot size={14} /></span><p className={styles.thinking}><i /><i /><i /></p></div>}</div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <form className={styles.chatForm} onSubmit={send}><label htmlFor="assistant-question" className={styles.srOnly}>Ask AAYI</label><input id="assistant-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} placeholder="Ask a question about AAYI…" /><button type="submit" disabled={busy || !question.trim()} aria-label="Send message">{busy ? <LoaderCircle className={styles.spinner} size={16} /> : <Send size={16} />}</button></form>
    <p className={styles.chatPrivacy}>Questions are sent to the configured AI provider to generate a reply. Don&apos;t include sensitive information.</p>
  </section>;
}
