import type { Metadata } from "next";
import AmbreenNavbar from "@/components/sections/ambreen/AmbreenNavbar";
import Approach from "@/components/sections/approach/Approach";

export const metadata: Metadata = { title: "Approach | Ambreen Fatima", description: "How Ambreen approaches CRM automation and technical delivery." };

export default function AmbreenApproachPage() {
  return <div className="min-h-screen bg-background text-foreground"><AmbreenNavbar /><main className="bg-background pt-20 text-foreground"><Approach /></main></div>;
}
