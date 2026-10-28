"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import Timeline from "./Timeline";

export default function Approach({ contactHref = "/ambreen/contact" }: { contactHref?: string }) {
  return (
    <section
      id="approach"
      className="relative overflow-hidden bg-background py-24"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-10rem] top-0 h-[32rem] w-[32rem] rounded-full bg-primary/12 blur-[180px]" />

        <div className="absolute bottom-[-10rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[180px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(23,53,46,0.06),transparent_70%)]" />
      </div>

      <div className="container relative mx-auto px-6">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="mb-6 inline-flex rounded-full border border-border bg-secondary px-5 py-2 text-sm font-medium text-accent">
            My Development Process
          </span>

          <h1 className="text-5xl font-bold leading-tight text-foreground md:text-6xl">
            From
            <span className="text-accent"> Idea </span>
            to
            <span className="text-accent"> Scalable Solution</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">
            Every successful project follows a structured process.
            My approach focuses on understanding your business,
            planning the right architecture,
            building reliable systems,
            integrating automation,
            and continuously improving after launch.
          </p>
        </motion.div>

        {/* Why Process Matters */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-20 max-w-6xl rounded-3xl border border-border bg-card p-10 backdrop-blur-xl transition-all duration-300 hover:border-accent/40 hover:bg-secondary"
        >
          <div className="grid gap-10 lg:grid-cols-2">

            <div>
              <h2 className="mb-5 text-3xl font-bold text-foreground">
                Why Every Project Follows a Process
              </h2>

              <p className="leading-8 text-muted-foreground">
                Great software isn't created by chance.
                A structured workflow reduces risks,
                improves communication,
                keeps development organized,
                and ensures that every decision supports your business objectives.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "Clear project planning",
                "Transparent communication",
                "Scalable architecture",
                "Quality assurance",
                "Business-focused solutions",
                "Long-term maintainability",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-accent" />

                  <span className="text-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="mt-24">
          <Timeline />
        </div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-24 max-w-5xl rounded-3xl border border-border bg-gradient-to-r from-card via-background to-secondary p-12 text-center backdrop-blur-xl transition-all duration-300 hover:border-accent/40"
        >
          <h2 className="text-4xl font-bold text-foreground">
            A Process Built Around Your Success
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-muted-foreground">
            Whether you're building a modern website,
            implementing a CRM,
            automating business workflows,
            or integrating AI into your operations,
            every project follows a proven methodology designed
            to deliver reliable and measurable results.
          </p>

          <Link
            href={contactHref}
            className="
              group
              mt-10
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-primary
              px-8
              py-4
              font-medium
              text-primary-foreground
              transition-all
              duration-300
              hover:bg-accent
              hover:text-background
            "
          >
            Let's Build Your Next Project

            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
