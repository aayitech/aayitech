"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, MessageCircle, Send, Star } from "lucide-react";
import styles from "./hub.module.css";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Business", "Other"];
type Reply = { id: string; body: string; author: string; created_at: string };
type Question = { id: string; subject: string; title: string; body: string; author: string; created_at: string; replies: Reply[] };
type Review = { rating: number; body: string; author: string; created_at: string };
type Teacher = { user_id: string; full_name: string; subjects: string[]; bio: string; available_online: boolean; average_rating: string; review_count: number; reviews: Review[] };

export default function LearningHub() {
  const [subject, setSubject] = useState("Mathematics");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [teacherSubjects, setTeacherSubjects] = useState<string[]>(["Mathematics"]);
  const [teacherBio, setTeacherBio] = useState("");
  const [available, setAvailable] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { rating: string; body: string }>>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch(`/api/community/education?subject=${encodeURIComponent(subject)}`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "The learning board could not be loaded.");
    setQuestions(result.questions || []);
    setTeachers(result.teachers || []);
  }, [subject]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      load().catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "The learning board could not be loaded."); });
    }, 0);
    fetch("/api/auth/me").then((response) => response.json()).then((result) => { if (active) setSignedIn(Boolean(result.user)); }).catch(() => {});
    return () => { active = false; window.clearTimeout(timer); };
  }, [load]);

  async function send(payload: Record<string, unknown>) {
    const response = await fetch("/api/community/education", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Your update could not be saved.");
    await load();
  }

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setNotice("");
    try { await send({ action: "question", subject, title, body: details }); setTitle(""); setDetails(""); setNotice("Your question is now on the board."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Your question could not be saved."); }
    finally { setLoading(false); }
  }

  async function submitTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setNotice("");
    try { await send({ action: "teacher-profile", subjects: teacherSubjects, bio: teacherBio, available }); setNotice("Your teacher profile has been saved."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Your profile could not be saved."); }
    finally { setLoading(false); }
  }

  async function submitReply(event: FormEvent<HTMLFormElement>, questionId: string) {
    event.preventDefault(); setLoading(true); setError("");
    try { await send({ action: "reply", questionId, body: replyDrafts[questionId] || "" }); setReplyDrafts((current) => ({ ...current, [questionId]: "" })); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Your reply could not be saved."); }
    finally { setLoading(false); }
  }

  async function submitReview(event: FormEvent<HTMLFormElement>, teacherId: string) {
    event.preventDefault(); setLoading(true); setError(""); setNotice("");
    const draft = reviewDrafts[teacherId] || { rating: "5", body: "" };
    try { await send({ action: "review", teacherId, rating: Number(draft.rating), body: draft.body }); setReviewDrafts((current) => ({ ...current, [teacherId]: { rating: "5", body: "" } })); setNotice("Your teacher review has been saved."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Your review could not be saved."); }
    finally { setLoading(false); }
  }

  function toggleTeacherSubject(item: string) {
    setTeacherSubjects((current) => current.includes(item) ? current.filter((value) => value !== item) : current.length < 8 ? [...current, item] : current);
  }

  return <div className={styles.learningHub}>
    <section className={styles.learningTeachers}>
      <div className={styles.learningSectionHead}><div><div className={styles.panelKicker}>RECOMMENDED HELP</div><h2>Teachers for {subject}</h2><p>Online status and subjects are provided by each teacher profile.</p></div><label className={styles.subjectFilter}>Subject<select value={subject} onChange={(event) => setSubject(event.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label></div>
      {teachers.length ? <div className={styles.teacherGrid}>{teachers.map((teacher) => <article className={styles.teacherCard} key={teacher.user_id}><div className={styles.teacherCardTop}><div><h3>{teacher.full_name}</h3><span className={teacher.available_online ? styles.teacherAvailable : styles.teacherNotAvailable}><i />{teacher.available_online ? "Available online" : "Not available now"}</span></div><span className={styles.teacherRating}><Star size={13} />{teacher.review_count ? teacher.average_rating : "New"}<small>({teacher.review_count})</small></span></div><div className={styles.teacherTags}>{teacher.subjects.map((item) => <span key={item}>{item}</span>)}</div><p className={styles.teacherBio}>{teacher.bio}</p>{teacher.reviews?.slice(0, 2).map((review, index) => <blockquote className={styles.teacherReview} key={`${review.author}-${index}`}><b>{"★".repeat(review.rating)}<span> by {review.author}</span></b><p>{review.body}</p></blockquote>)}{signedIn && <details className={styles.reviewDetails}><summary>Share your teacher experience</summary><form onSubmit={(event) => void submitReview(event, teacher.user_id)}><select aria-label="Rating" value={(reviewDrafts[teacher.user_id] || { rating: "5" }).rating} onChange={(event) => setReviewDrafts((current) => ({ ...current, [teacher.user_id]: { ...(current[teacher.user_id] || { body: "" }), rating: event.target.value } }))}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select><textarea required minLength={5} maxLength={1000} value={(reviewDrafts[teacher.user_id] || { body: "" }).body} onChange={(event) => setReviewDrafts((current) => ({ ...current, [teacher.user_id]: { ...(current[teacher.user_id] || { rating: "5" }), body: event.target.value } }))} placeholder="What was helpful?" /><button disabled={loading}>Save review</button></form></details>}</article>)}</div> : <div className={styles.communityEmpty}>No teacher profiles match this subject yet. Try another subject, or invite a teacher to create a profile.</div>}
      {signedIn ? <details className={styles.teacherJoin}><summary>{"I’m a teacher — add or update my profile"}</summary><form onSubmit={(event) => void submitTeacher(event)}><div className={styles.subjectChecks}>{subjects.map((item) => <label key={item}><input type="checkbox" checked={teacherSubjects.includes(item)} onChange={() => toggleTeacherSubject(item)} />{item}</label>)}</div><label className={styles.communityField}>Short introduction<textarea required minLength={10} maxLength={1000} value={teacherBio} onChange={(event) => setTeacherBio(event.target.value)} placeholder="Your experience and how you help students" /></label><label className={styles.availabilityToggle}><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} /> My profile says I’m available online now</label><button disabled={loading}>Save teacher profile</button></form></details> : <p className={styles.signInPrompt}>Are you a teacher? <Link href="/signup">Create an account</Link> to add a profile and availability.</p>}
    </section>

    <section className={styles.learningQuestions}>
      <div className={styles.learningSectionHead}><div><div className={styles.panelKicker}>STUDENT QUESTION BOARD</div><h2>Ask about a subject.</h2><p>Students and teachers can reply to help work through the problem.</p></div><BookOpen size={20} /></div>
      {signedIn ? <form className={styles.questionForm} onSubmit={(event) => void submitQuestion(event)}><label>Question title<input required minLength={8} maxLength={140} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What part of the topic is confusing?" /></label><label>Explain the problem<textarea required minLength={15} maxLength={4000} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Include the question and what you have tried so far." /></label><button disabled={loading}>{loading ? "Posting…" : "Post question"}<Send size={13} /></button></form> : <p className={styles.signInPrompt}>Sign in to ask a question or reply. <Link href="/signup">Create an account</Link></p>}
      {error && <p role="alert" className={styles.error}>{error}</p>}{notice && <p role="status" className={styles.communityNotice}>{notice}</p>}
      <div className={styles.questionList}>{questions.length ? questions.map((question) => <article className={styles.questionCard} key={question.id}><div className={styles.questionMeta}><span>{question.subject}</span><span>{question.author} · {new Date(question.created_at).toLocaleDateString()}</span></div><h3>{question.title}</h3><p className={styles.questionBody}>{question.body}</p>{question.replies.map((reply) => <div className={styles.questionReply} key={reply.id}><MessageCircle size={13} /><div><b>{reply.author}</b><p>{reply.body}</p></div></div>)}{signedIn && <form className={styles.replyForm} onSubmit={(event) => void submitReply(event, question.id)}><label className={styles.srOnly} htmlFor={`reply-${question.id}`}>Reply to {question.title}</label><input id={`reply-${question.id}`} required minLength={3} maxLength={1500} value={replyDrafts[question.id] || ""} onChange={(event) => setReplyDrafts((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Share a helpful reply…" /><button disabled={loading} aria-label="Send reply"><Send size={14} /></button></form>}</article>) : <div className={styles.communityEmpty}>No questions yet. Start the first discussion for {subject}.</div>}</div>
      <p className={styles.memberNote}>Posts are associated with signed-in accounts. Account signup does not currently verify email ownership; report inappropriate content to the site owner.</p>
    </section>
  </div>;
}
