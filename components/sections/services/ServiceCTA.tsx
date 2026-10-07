"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceCTAProps {
  title: string;
  description: string;
}

export default function ServiceCTA({
  title,
  description,
}: ServiceCTAProps) {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: .6,
          }}
className="mx-auto max-w-5xl rounded-[40px] border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-14 text-center backdrop-blur-xl"        >
          <h2 className="text-4xl font-bold text-foreground md:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {description}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">

            <Link
              href="/ambreen/contact"
className="groupinline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition hover:bg-accent hover:text-background"            >
              Book a Consultation
            </Link>

            <Link
              href="/ambreen/projects"
className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-8 py-4 font-semibold text-foreground transition hover:border-accent hover:bg-secondary"            >
              View Projects

              <ArrowRight
  size={18}
  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
/>
            </Link>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
