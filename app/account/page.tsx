import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import AuthForm from "@/components/hub/AuthForm";
import AccountDashboard from "@/components/hub/AccountDashboard";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Your AAYI Account", description: "View your saved keyword research and account details." };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) return <HubPage eyebrow="YOUR AAYI ACCOUNT" title="Sign in to see your saved work." description="Your keyword research is stored with your account."><AuthForm initialMode="login" /></HubPage>;
  return <HubPage eyebrow="YOUR AAYI ACCOUNT" title="Your ideas, all together." description="Pick up where your research left off."><AccountDashboard user={user} /></HubPage>;
}
