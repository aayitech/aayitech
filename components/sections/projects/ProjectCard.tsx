"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  GitBranch,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Project } from "./types";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card backdrop-blur-xl"
    >
      {/* Image */}
      <Link href={`/ambreen/projects/${project.slug}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

          <div className="absolute left-5 top-5">
            <Badge className="border border-border bg-secondary text-accent backdrop-blur">
              {project.category}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-5 p-6">
        <div>
          {/* Clickable Title */}
          <Link href={`/ambreen/projects/${project.slug}`}>
            <h3 className="mb-2 text-2xl font-bold text-foreground transition-colors duration-300 hover:text-accent">
              {project.title}
            </h3>
          </Link>

          <p className="text-sm leading-7 text-muted-foreground">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/ambreen/projects/${project.slug}`}
            className="
              group
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-border
              bg-card
              px-5
              py-3
              font-medium
              text-foreground
              transition-all
              duration-300
              hover:border-accent
              hover:bg-secondary
            "
          >
            View Case Study

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary
                px-5
                py-3
                font-medium
                text-primary-foreground
                transition-all
                duration-300
                hover:bg-accent
                hover:text-background
              "
            >
              Live Demo

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}

          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-border
                bg-card
                px-5
                py-3
                font-medium
                text-foreground
                transition-all
                duration-300
                hover:border-accent
                hover:bg-secondary
              "
            >
              <GitBranch className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />

              Code
            </Link>
          )}
        </div>
      </div>

      {/* Hover Border */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-accent/0 transition-all duration-500 group-hover:border-accent/30" />

      {/* Glow */}
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-accent/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
    </motion.article>
  );
}
