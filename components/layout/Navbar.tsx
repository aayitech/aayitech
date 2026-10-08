"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";

const navItems = [
  { name: "Weather & News", href: "/weather" },
  { name: "Markets", href: "/markets/crypto" },
  { name: "AI Assistant", href: "/assistant" },
  { name: "Affiliates", href: "/affiliates" },
  { name: "Ambreen", href: "/ambreen", featured: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signedInName, setSignedInName] = useState("");
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.json()).then((result) => setSignedInName(typeof result.user?.full_name === "string" ? result.user.full_name.trim().split(/\s+/)[0] : "")).catch(() => setSignedInName(""));
  }, [pathname]);

  if (pathname === "/jamil" || pathname.startsWith("/ambreen") || pathname.startsWith("/mustansar") || pathname.startsWith("/adil")) return null;

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
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

  {/* Brand Text */}
  <div>
    <p className="text-lg font-bold tracking-tight text-foreground">
      AAYI<span className="text-accent">TECH</span>
    </p>

    <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
      TOOLS • INSIGHTS • IDEAS
    </p>
  </div>
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={
                  item.featured
                    ? "rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-sm font-semibold text-foreground transition-all duration-300 hover:border-accent hover:bg-accent hover:text-background"
                    : `text-sm font-medium transition-colors duration-300 hover:text-accent ${
                        pathname === item.href ? "text-accent" : "text-muted-foreground"
                      }`
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

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

            {/* Get Started */}
            <Link
              href={signedInName ? "/account" : "/signup"}
              className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-background hover:shadow-lg lg:flex"
            >
              {signedInName ? `Welcome, ${signedInName}` : "Join AAYI"}
            </Link>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="border border-border bg-secondary text-foreground transition-all duration-300 hover:bg-accent hover:text-background hover:shadow-lg lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        signedInName={signedInName}
      />
    </>
  );
}
