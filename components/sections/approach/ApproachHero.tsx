"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  FolderKanban,
  Sparkles,
} from "lucide-react";

export default function ApproachHero() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10rem] top-0 h-[34rem] w-[34rem] rounded-full bg-primary/12 blur-[180px]" />

        <div className="absolute bottom-0 right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[180px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(23,53,46,0.06),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl text-center"
        >
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            My Development Process
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold leading-tight text-foreground md:text-7xl">
            Every Great Product
            <br />

            Starts With a
            <span className="text-accent">
              {" "}
              Great Process
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">
            Successful software isn't just about writing code.
            It's about understanding your business,
            designing the right solution,
            building scalable systems,
            integrating automation,
            and continuously improving after launch.
          </p>

          {/* CTA */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-background"
            >
              Start Your Project

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/ambreen/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 font-semibold text-foreground transition-all duration-300 hover:border-accent hover:bg-secondary hover:text-accent"
            >
              View My Work

              <FolderKanban className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-7 backdrop-blur-xl transition-all duration-300 hover:border-accent/40 hover:bg-secondary">
              <Clock3 className="mx-auto mb-4 h-8 w-8 text-accent" />

              <h3 className="text-3xl font-bold text-foreground">
                6
              </h3>

              <p className="mt-2 text-muted-foreground">
                Structured Development Phases
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 backdrop-blur-xl transition-all duration-300 hover:border-accent/40 hover:bg-secondary">
              <FolderKanban className="mx-auto mb-4 h-8 w-8 text-accent" />

              <h3 className="text-3xl font-bold text-foreground">
                End-to-End
              </h3>

              <p className="mt-2 text-muted-foreground">
                Project Management
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 backdrop-blur-xl transition-all duration-300 hover:border-accent/40 hover:bg-secondary">
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-accent" />

              <h3 className="text-3xl font-bold text-foreground">
                Business
              </h3>

              <p className="mt-2 text-muted-foreground">
                Focused Solutions
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
