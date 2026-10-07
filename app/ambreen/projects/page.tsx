import type { Metadata } from "next";
import Link from "next/link";
import AmbreenNavbar from "@/components/sections/ambreen/AmbreenNavbar";
import Projects from "@/components/sections/projects/Projects";

export const metadata: Metadata = {
  title: "Projects | Ambreen Fatima",
  description: "Selected technical, CRM, automation, and web projects by Ambreen Fatima.",
};

export default function AmbreenProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AmbreenNavbar />
      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
          <Link href="/ambreen" className="text-sm font-medium text-muted-foreground transition hover:text-accent">← Back to Ambreen&apos;s portfolio</Link>
        </div>
        <Projects />
      </main>
      <footer className="border-t border-border px-6 py-7 text-center text-sm text-muted-foreground"><Link href="/ambreen" className="hover:text-accent">Ambreen Fatima</Link><span className="mx-3">·</span><Link href="/" className="hover:text-accent">AAYI TECH tools</Link></footer>
    </div>
  );
}
