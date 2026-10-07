import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AmbreenNavbar from "@/components/sections/ambreen/AmbreenNavbar";
import { projects } from "@/components/sections/projects/projects.data";
import ProjectHero from "@/components/sections/projects/ProjectHero";
import ProjectOverview from "@/components/sections/projects/ProjectOverview";
import ProjectFeatures from "@/components/sections/projects/ProjectFeatures";
import ProjectTech from "@/components/sections/projects/ProjectTech";
import ProjectOutcome from "@/components/sections/projects/ProjectOutcome";
import RelatedProjects from "@/components/sections/projects/RelatedProjects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: `${project.title} | Ambreen Fatima`, description: project.description } : { title: "Project not found | Ambreen Fatima" };
}

export default async function AmbreenProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <div className="min-h-screen bg-background text-foreground"><AmbreenNavbar /><main className="pt-20"><ProjectHero project={project} /><ProjectOverview project={project} /><ProjectFeatures project={project} /><ProjectTech project={project} /><ProjectOutcome project={project} /><RelatedProjects project={project} /></main><footer className="border-t border-border py-7 text-center text-sm text-muted-foreground"><a href="/ambreen/projects" className="hover:text-accent">All projects</a></footer></div>;
}
