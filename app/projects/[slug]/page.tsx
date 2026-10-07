import { redirect } from "next/navigation";

export default async function ProjectRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/ambreen/projects/${encodeURIComponent(slug)}`);
}
