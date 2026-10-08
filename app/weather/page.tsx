import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import WeatherNews from "@/components/hub/WeatherNews";

export const metadata: Metadata = {
  title: "Weather & News | AAYI TECH",
  description: "Check a local weather forecast and the coming hours near your location.",
};

export default function WeatherPage() {
  return <HubPage eyebrow="WEATHER NEAR YOU" title="A clearer look at your local forecast." description="Allow browser location access for a forecast near you, or choose a city yourself. Your precise location is rounded before the forecast request is sent."><WeatherNews mode="weather" /></HubPage>;
}
