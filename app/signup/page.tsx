import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import AuthForm from "@/components/hub/AuthForm";

export const metadata: Metadata = { title: "Create an AAYI Account", description: "Create an account to save your SEO keyword research and return to your work." };

export default function SignupPage() {
  return <HubPage eyebrow="YOUR WORK, SAVED" title="A free account for your growing ideas." description="Create an account to keep your SEO research available whenever you need it."><AuthForm /></HubPage>;
}
