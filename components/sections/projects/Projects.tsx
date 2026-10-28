"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import FeaturedProject from "./FeaturedProject";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";

import { projects, projectCategories } from "./projects.data";

export default function Projects({ basePath = "/ambreen/projects" }: { basePath?: string }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const featuredProject = projects.find((project) => project.featured);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (project.featured) return false;

      if (activeFilter === "All") return true;

      return project.category === activeFilter;
    });
  }, [activeFilter]);

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-background py-20"
    >
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/12 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-[160px]" />

      <div className="container relative mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          <span className="mb-4 inline-flex rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-accent">
            Client Success Stories
          </span>

          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            CRM Systems That
            <span className="text-accent"> Keep Work Moving</span>
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
            Real work across HubSpot, GoHighLevel, workflow automation,
            integrations, reporting, technical infrastructure, and connected
            web experiences for healthcare, procurement, logistics, and
            professional services.
          </p>
        </motion.div>

        {/* Featured */}
        {featuredProject && (
          <div className="mb-20">
            <FeaturedProject project={featuredProject} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-12">
          <ProjectFilters
            categories={projectCategories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.35,
              }}
            >
              <ProjectCard project={project} basePath={basePath} />
            </motion.div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <h3 className="text-2xl font-semibold text-foreground">
              No projects found
            </h3>

            <p className="mt-3 text-muted-foreground">
              Try selecting another category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
