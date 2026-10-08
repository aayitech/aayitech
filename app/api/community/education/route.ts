import { getSessionUser } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await ensureSchema();
    const subject = new URL(request.url).searchParams.get("subject")?.trim().slice(0, 60) || "";
    const pool = getPool();
    const [questions, teachers] = await Promise.all([
      pool.query(`
        SELECT q.id, q.subject, q.title, q.body, q.created_at, u.full_name AS author,
          COALESCE((SELECT json_agg(json_build_object('id', r.id, 'body', r.body, 'created_at', r.created_at, 'author', ru.full_name) ORDER BY r.created_at ASC)
            FROM aayi_question_replies r JOIN aayi_users ru ON ru.id = r.user_id WHERE r.question_id = q.id), '[]'::json) AS replies
        FROM aayi_student_questions q JOIN aayi_users u ON u.id = q.user_id
        ORDER BY q.created_at DESC LIMIT 40`),
      pool.query(`
        SELECT p.user_id, u.full_name, p.subjects, p.bio, p.available_online,
          COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) AS average_rating, COUNT(r.id)::int AS review_count,
          COALESCE((SELECT json_agg(json_build_object('rating', rv.rating, 'body', rv.body, 'created_at', rv.created_at, 'author', ru.full_name) ORDER BY rv.created_at DESC)
            FROM aayi_teacher_reviews rv JOIN aayi_users ru ON ru.id = rv.author_user_id WHERE rv.teacher_user_id = p.user_id), '[]'::json) AS reviews
        FROM aayi_teacher_profiles p JOIN aayi_users u ON u.id = p.user_id
        LEFT JOIN aayi_teacher_reviews r ON r.teacher_user_id = p.user_id
          WHERE ($1 = '' OR EXISTS (SELECT 1 FROM unnest(p.subjects) AS subj(value) WHERE lower(subj.value) = lower($1)))
        GROUP BY p.user_id, u.full_name, p.subjects, p.bio, p.available_online
        ORDER BY p.available_online DESC, average_rating DESC, review_count DESC, u.full_name ASC LIMIT 30`, [subject]),
    ]);
    return Response.json({ questions: questions.rows, teachers: teachers.rows }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("[education] community read failed", { name: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ message: "The learning community is temporarily unavailable." }, { status: 503 });
  }
}

async function requireWriter() {
  const user = await getSessionUser();
  if (!user) return null;
  const recent = await getPool().query(`
    SELECT COUNT(*)::int AS count FROM (
      SELECT user_id, created_at FROM aayi_student_questions
      UNION ALL SELECT user_id, created_at FROM aayi_question_replies
      UNION ALL SELECT author_user_id AS user_id, created_at FROM aayi_teacher_reviews
    ) activity WHERE user_id = $1 AND created_at > NOW() - INTERVAL '10 minutes'`, [user.id]);
  if (recent.rows[0].count >= 5) return { limited: true as const };
  return { user, limited: false as const };
}

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const body = await request.json();
    const writer = await requireWriter();
    if (!writer) return Response.json({ message: "Sign in to participate in the learning community." }, { status: 401 });
    if (writer.limited) return Response.json({ message: "You have posted several times recently. Please wait a few minutes." }, { status: 429 });
    const pool = getPool();

    if (body.action === "question") {
      const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 60) : "";
      const title = typeof body.title === "string" ? body.title.trim().slice(0, 140) : "";
      const details = typeof body.body === "string" ? body.body.trim().slice(0, 4000) : "";
      if (subject.length < 2 || title.length < 8 || details.length < 15) return Response.json({ message: "Add a subject, a clear title, and at least 15 characters of detail." }, { status: 400 });
      const result = await pool.query("INSERT INTO aayi_student_questions (user_id, subject, title, body) VALUES ($1, $2, $3, $4) RETURNING id", [writer.user.id, subject, title, details]);
      return Response.json({ id: result.rows[0].id }, { status: 201 });
    }

    if (body.action === "reply") {
      const questionId = typeof body.questionId === "string" ? body.questionId : "";
      const text = typeof body.body === "string" ? body.body.trim().slice(0, 1500) : "";
      if (!/^[0-9a-f-]{36}$/i.test(questionId) || text.length < 3) return Response.json({ message: "Choose a question and write a reply." }, { status: 400 });
      await pool.query("INSERT INTO aayi_question_replies (question_id, user_id, body) VALUES ($1, $2, $3)", [questionId, writer.user.id, text]);
      return Response.json({ ok: true }, { status: 201 });
    }

    if (body.action === "teacher-profile") {
      const subjects = Array.isArray(body.subjects) ? [...new Set(body.subjects.filter((item: unknown): item is string => typeof item === "string").map((item: string) => item.trim().slice(0, 60).toLowerCase()).filter(Boolean))].slice(0, 8) : [];
      const bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 1000) : "";
      const available = body.available === true;
      if (!subjects.length || bio.length < 10) return Response.json({ message: "Choose at least one subject and add a short introduction." }, { status: 400 });
      await pool.query(`INSERT INTO aayi_teacher_profiles (user_id, subjects, bio, available_online, updated_at)
        VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (user_id) DO UPDATE SET subjects = EXCLUDED.subjects, bio = EXCLUDED.bio, available_online = EXCLUDED.available_online, updated_at = NOW()`, [writer.user.id, subjects, bio, available]);
      return Response.json({ ok: true }, { status: 201 });
    }

    if (body.action === "review") {
      const teacherId = typeof body.teacherId === "string" ? body.teacherId : "";
      const rating = Number(body.rating);
      const text = typeof body.body === "string" ? body.body.trim().slice(0, 1000) : "";
      if (!/^[0-9a-f-]{36}$/i.test(teacherId) || teacherId === writer.user.id || !Number.isInteger(rating) || rating < 1 || rating > 5 || text.length < 5) return Response.json({ message: "Add a rating from 1 to 5 and a short review." }, { status: 400 });
      await pool.query(`INSERT INTO aayi_teacher_reviews (teacher_user_id, author_user_id, rating, body) VALUES ($1, $2, $3, $4)
        ON CONFLICT (teacher_user_id, author_user_id) DO UPDATE SET rating = EXCLUDED.rating, body = EXCLUDED.body, created_at = NOW()`, [teacherId, writer.user.id, rating, text]);
      return Response.json({ ok: true }, { status: 201 });
    }

    return Response.json({ message: "Choose a supported community action." }, { status: 400 });
  } catch (error) {
    console.error("[education] community write failed", { name: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ message: "Your post could not be saved. Please try again." }, { status: 500 });
  }
}
