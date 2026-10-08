import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import LearningHub from "@/components/hub/LearningHub";

export const metadata: Metadata = { title: "Learning Community | AAYI TECH", description: "Ask study questions, learn from community replies, and find online teacher profiles by subject." };

export default function LearnPage() {
  return <HubPage eyebrow="LEARN TOGETHER" title="A place to ask, explain, and learn." description="Post a subject question, get replies from the community, or browse teachers who say they are available online. Sign in to participate."><LearningHub /></HubPage>;
}
