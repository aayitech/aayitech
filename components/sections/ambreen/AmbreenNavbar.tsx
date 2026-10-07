"use client";

import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Menu, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import AmbreenMobileMenu from "./AmbreenMobileMenu";

const navItems = [
  { name: "About", href: "/ambreen#about" },
  { name: "Expertise", href: "/ambreen#expertise" },
  { name: "Experience", href: "/ambreen#experience" },
  { name: "Projects", href: "/ambreen/projects" },
  { name: "Tech Stack", href: "/ambreen#tech-stack" },
  { name: "Education", href: "/ambreen#education" },
];

export default function AmbreenNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/ambreen"
          className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80"
        >
        <div className="h-10 w-10 rounded-md bg-[#0E1311] flex items-center justify-center">
            <Image
              src="/logo1.png"
              alt="AAYI TECH"
              width={42}
              height={42}
              className="h-10 w-10 object-contain"
              priority
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-wide text-foreground">
              AMBREEN
            </span>

            <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              HUBSPOT • GHL • NEXT.JS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent xl:flex"
          >
            <ArrowLeft className="h-4 w-4" />
            AAYI Tech
          </Link>

          {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              className="border border-border bg-secondary text-foreground transition-all duration-300 hover:bg-accent hover:text-background hover:shadow-lg"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

          {/* Let's Talk */}
          <Link
            href={pathname === "/ambreen" ? "#contact" : "/ambreen#contact"}
            className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-background hover:shadow-lg lg:flex"
          >
            Let&apos;s Talk
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-xl border border-border bg-secondary text-foreground backdrop-blur-md transition-all duration-300 hover:bg-accent hover:text-background hover:shadow-lg lg:hidden"
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AmbreenMobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
