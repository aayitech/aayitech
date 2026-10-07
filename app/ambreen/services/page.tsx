import type { Metadata } from "next";
import AmbreenNavbar from "@/components/sections/ambreen/AmbreenNavbar";
import Services from "@/components/sections/services/Services";

export const metadata: Metadata = { title: "Services | Ambreen Fatima", description: "CRM implementation, automation, integrations, and web development services by Ambreen Fatima." };

export default function AmbreenServicesPage() {
  return <div className="min-h-screen bg-background text-foreground"><AmbreenNavbar /><main className="bg-background pt-20 text-foreground"><Services /></main></div>;
}
