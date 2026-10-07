"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  FolderOpen,
  Sparkles,
} from "lucide-react";

export default function ApproachCTA() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[180px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(23,53,46,0.06),transparent_70%)]" />
      </div>

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl rounded-[36px] border border-border bg-card p-12 text-center shadow-xl shadow-primary/5 backdrop-blur-xl transition-all duration-300 hover:border-accent/40"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2 text-sm font-medium text-accent">
            <Sparkles className="h-4 w-4" />
            Ready To Build?
          </div>

          {/* Heading */}
          <h2 className="text-5xl font-bold text-foreground">
            Let's Turn Your Idea Into
            <span className="text-accent">
              {" "}
              A Real Product
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">
            Whether you're planning a modern web application,
            CRM implementation,
            AI-powered automation,
            or a complete business platform,
            I'll guide the project from discovery to deployment
            using a structured and transparent development process.
          </p>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-accent/40 hover:bg-secondary">
              <h3 className="text-3xl font-bold text-accent">
                6
              </h3>

              <p className="mt-2 text-muted-foreground">
                Structured Development Phases
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-accent/40 hover:bg-secondary">
              <h3 className="text-3xl font-bold text-accent">
                100%
              </h3>

              <p className="mt-2 text-muted-foreground">
                Transparent Communication
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-accent/40 hover:bg-secondary">
              <h3 className="text-3xl font-bold text-accent">
                End-to-End
              </h3>

              <p className="mt-2 text-muted-foreground">
                Technical Delivery
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-background"
            >
              <MessageCircle className="h-5 w-5" />

              Start Your Project

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/ambreen/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 font-semibold text-foreground transition-all duration-300 hover:border-accent hover:bg-secondary hover:text-accent"
            >
              <FolderOpen className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />

              View Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
