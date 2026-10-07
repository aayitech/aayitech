import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import KeywordResearch from "@/components/hub/KeywordResearch";

export const metadata: Metadata = { title: "SEO Keyword Lab | AAYI TECH", description: "Build practical keyword clusters, search intent maps, metadata, and content briefs for your business." };

export default function SeoPage() {
  return <HubPage eyebrow="GROW YOUR WEBSITE" title="Find your next SEO opportunity." description="Turn a business topic into a structured keyword plan, content angles, and on-page metadata for the audience you want to reach."><KeywordResearch /></HubPage>;
}
