"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaUpwork,
} from "react-icons/fa6";

const navLinks = [
  { label: "Free tools", href: "/#tools" },
  { label: "Why AAYI", href: "/#why" },
  { label: "Ambreen", href: "/ambreen" },
];

const socials = [
  {
    icon: FaLinkedin,
    href: "https://linkedin.com/in/ambreen-f-50070a62",
  },
  {
    icon: FaGithub,
    href: "https://github.com/Ambreen110",
  },
  {
    icon: FaUpwork,
    href: "https://www.upwork.com/freelancers/ambreencrm",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/ambreenfatiima/",
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/jamil" || pathname === "/ambreen" || pathname.startsWith("/mustansar") || pathname.startsWith("/adil")) return null;

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/"
className="text-2xl font-bold text-foreground"            >
AAYI<span className="text-accent">/TECH</span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
              Small, free tools that make everyday tasks a little easier. Built with care by AAYI TECH.
            </p>
          </motion.div>

          {/* Center */}
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6"
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-accent transition"
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            {socials.map((social, index) => {
              const Icon = social.icon;

              return (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} AAYI TECH. All rights reserved.
          </p>

          <p>
            Built with{" "}
            <span className="text-accent">Next.js</span>,{" "}
            <span className="text-accent">TypeScript</span> &{" "}
            <span className="text-accent">Tailwind CSS</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
