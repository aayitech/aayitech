"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";

import ServiceBackground from "./ServiceBackground";
import ServiceCard from "./ServiceCard";

export default function Services({ basePath = "/ambreen/services" }: { basePath?: string }) {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-background py-28"
    >
      <ServiceBackground />

      <div className="container relative z-10 mx-auto px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex justify-center"
        >
          <span className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-accent">
            Services
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            CRM Systems That Remove
            <span className="text-accent"> Manual Work</span>
          </h2>

          <p className="text-lg leading-8 text-muted-foreground">
            I specialize in HubSpot and GoHighLevel automation, then extend
            those systems with integrations, reporting, and Next.js experiences
            when an off-the-shelf workflow is not enough.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              basePath={basePath}
              title={service.shortTitle}
              description={service.description}
              icon={service.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
