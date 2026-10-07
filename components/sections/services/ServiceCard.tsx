"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import ServiceIcon from "./ServiceIcon";
import { iconMap } from "@/lib/iconMap";

interface ServiceCardProps {
  slug: string;
  title: string;
  description: string;
  icon: keyof typeof iconMap;
  delay?: number;
}

export default function ServiceCard({
  slug,
  title,
  description,
  icon,
  delay = 0,
}: ServiceCardProps) {
  const Icon = iconMap[icon];

  return (
    <Link href={`/ambreen/services/${slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.6,
          delay,
          ease: "easeOut",
        }}
        whileHover={{ y: -8 }}
className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 backdrop-blur-xl transition-all duration-500 hover:border-accent/40 hover:bg-secondary cursor-pointer"      >
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/5 to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Icon */}
        <div className="relative z-10 mb-6">
          <ServiceIcon icon={Icon} />
        </div>

        {/* Title */}
        <h3 className="relative z-10 mb-3 text-2xl font-semibold text-foreground">
          {title}
        </h3>

        {/* Description */}
        <p className="relative z-10 leading-7 text-muted-foreground">
          {description}
        </p>

        {/* Learn More */}
        <div className="relative z-10 mt-8 flex items-center text-accent">
          <span className="text-sm font-medium">
            Learn More
          </span>

          <ArrowUpRight
            size={18}
            className="ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>

        {/* Border Glow */}
<div className="absolute inset-0 rounded-3xl border border-accent/0 transition-all duration-500 group-hover:border-accent/20" />      </motion.div>
    </Link>
  );
}
