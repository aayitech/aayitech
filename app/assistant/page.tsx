import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import SiteAssistant from "@/components/hub/SiteAssistant";

export const metadata: Metadata = { title: "Ask AAYI | AAYI TECH", description: "Get a quick answer about AAYI TECH's tools, pages, and how to get started." };

export default function AssistantPage() {
  return <HubPage eyebrow="ASK AAYI" title="A helpful answer is a question away." description="Ask about our tools, how to use them, and where to find what you need across the AAYI TECH hub."><SiteAssistant /></HubPage>;
}
