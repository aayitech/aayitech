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
  title: "AAYI TECH | CRM Automation Portfolio",
  description:
    "See AAYI TECH's HubSpot and GoHighLevel automation work, services, projects, technologies, and approach.",
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
