import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import WeatherNews from "@/components/hub/WeatherNews";

export const metadata: Metadata = {
  title: "Weather & News | AAYI TECH",
  description: "Check a local weather forecast and browse recent world, business, technology, and science headlines.",
};

export default function WeatherPage() {
  return <HubPage eyebrow="A QUICK DAILY BRIEF" title="Your forecast. The latest headlines." description="See conditions near you, then scan recent stories by topic. Allow location access for a local forecast or choose a city yourself."><WeatherNews /></HubPage>;
}
