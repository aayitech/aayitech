"use client";

import { motion } from "framer-motion";

import ProjectCard from "./ProjectCard";
import { Project } from "./types";
import { projects } from "./projects.data";

interface RelatedProjectsProps {
  project: Project;
  basePath?: string;
}

export default function RelatedProjects({
  project,
  basePath = "/ambreen/projects",
}: RelatedProjectsProps) {
  const relatedProjects = projects
    .filter(
      (item) =>
        item.slug !== project.slug &&
        item.category === project.category
    )
    .slice(0, 3);

  if (relatedProjects.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="mb-4 inline-flex rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-accent">
            More Projects
          </span>

          <h2 className="mb-5 text-4xl font-bold text-foreground">
            Related Projects
          </h2>

          <p className="text-lg leading-8 text-muted-foreground">
            Explore more projects from the same category and discover additional
            solutions, automations, and technical implementations.
          </p>
        </motion.div>

        {/* Projects */}
        <motion.div
          layout
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {relatedProjects.map((relatedProject) => (
            <motion.div
              key={relatedProject.slug}
              layout
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <ProjectCard project={relatedProject} basePath={basePath} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
