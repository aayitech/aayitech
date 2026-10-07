import type { Metadata } from "next";
import AmbreenNavbar from "@/components/sections/ambreen/AmbreenNavbar";
import Contact from "@/components/sections/contact/Contact";

export const metadata: Metadata = { title: "Contact | Ambreen Fatima", description: "Contact Ambreen Fatima about CRM systems, automation, integrations, and technical work." };

export default function AmbreenContactPage() {
  return <div className="min-h-screen bg-background text-foreground"><AmbreenNavbar /><main className="bg-background pt-20 text-foreground"><Contact /></main></div>;
}
