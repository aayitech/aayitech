import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import AuthForm from "@/components/hub/AuthForm";

export const metadata: Metadata = { title: "Create an AAYI Account", description: "Create a free account to save your profile and return to AAYI TECH tools." };

export default function SignupPage() {
  return <HubPage eyebrow="YOUR WORK, SAVED" title="A free account for your growing ideas." description="Create an account to keep your profile available whenever you need it."><AuthForm /></HubPage>;
}
