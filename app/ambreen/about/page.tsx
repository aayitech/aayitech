import type { Metadata } from "next";
import AmbreenNavbar from "@/components/sections/ambreen/AmbreenNavbar";
import About from "@/components/sections/about/About";

export const metadata: Metadata = { title: "About | Ambreen Fatima", description: "About Ambreen Fatima's technical systems, CRM automation, and web development work." };

export default function AmbreenAboutPage() {
  return <div className="min-h-screen bg-background text-foreground"><AmbreenNavbar /><main className="pt-20"><About /></main></div>;
}
