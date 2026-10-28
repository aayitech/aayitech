import { notFound } from "next/navigation";
import { projects } from "@/components/sections/projects/projects.data";
import ProjectHero from "@/components/sections/projects/ProjectHero";
import ProjectOverview from "@/components/sections/projects/ProjectOverview";
import ProjectFeatures from "@/components/sections/projects/ProjectFeatures";
import ProjectTech from "@/components/sections/projects/ProjectTech";
import ProjectOutcome from "@/components/sections/projects/ProjectOutcome";
import RelatedProjects from "@/components/sections/projects/RelatedProjects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  return project
    ? { title: `${project.title} | AAYI TECH`, description: project.description }
    : { title: "Project Not Found | AAYI TECH" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <main className="bg-background pt-20 text-foreground">
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <ProjectFeatures project={project} />
      <ProjectTech project={project} />
      <ProjectOutcome project={project} />
      <RelatedProjects project={project} basePath="/projects" />
    </main>
  );
}
