import type { Metadata } from "next";
import AmbreenNavbar from "@/components/sections/ambreen/AmbreenNavbar";
import TechStack from "@/components/sections/tech-stack/TechStack";

export const metadata: Metadata = { title: "Technologies | Ambreen Fatima", description: "Platforms and technologies used in Ambreen Fatima's technical work." };

export default function AmbreenTechnologiesPage() {
  return <div className="min-h-screen bg-background text-foreground"><AmbreenNavbar /><main className="bg-background pt-20 text-foreground"><TechStack /></main></div>;
}
