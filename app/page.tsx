import type { Metadata } from "next";
import Hero from "@/components/sections/hero/Hero";
import { CTA } from "@/components/sections/cta";
import Contact from "@/components/sections/contact/Contact";
import HomeProjects from "@/components/sections/home-projects/HomeProjects";
import HomeServices from "@/components/sections/HomeServices/HomeServices";
import HomeTechStack from "@/components/sections/HomeTechStack/HomeTechStack";
import HomeApproach from "@/components/sections/home-approach/HomeApproach";
import HomeAbout from "@/components/sections/home-about/HomeAbout";
import HomeProfile from "@/components/sections/home-profile/HomeProfile";

export const metadata: Metadata = {
  title: "Ambreen Fatima | HubSpot & GoHighLevel Automation Specialist",
  description:
    "HubSpot and GoHighLevel CRM automation, integrations, reporting, and connected Next.js development by Ambreen Fatima.",
};

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <HomeServices />
      <HomeProjects />
      <HomeProfile />
      <HomeTechStack />
      <HomeApproach />
      <HomeAbout />
      <CTA />
      <Contact />
    </main>
  );
}
