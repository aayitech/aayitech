import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import WeatherNews from "@/components/hub/WeatherNews";

export const metadata: Metadata = { title: "News | AAYI TECH", description: "Browse recent world, business, technology, science, entertainment, and sports headlines from original publishers." };

export default function NewsPage() {
  return <HubPage eyebrow="AAYI DAILY BRIEF" title="News, by the topics you follow." description="Browse recent headlines by topic, then continue reading on the original publisher's website."><WeatherNews mode="news" /></HubPage>;
}
