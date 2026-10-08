import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import AuthForm from "@/components/hub/AuthForm";
import AccountDashboard from "@/components/hub/AccountDashboard";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Your AAYI Account", description: "View your AAYI profile and useful tools." };

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) return <HubPage eyebrow="YOUR AAYI ACCOUNT" title="Sign in to see your account." description="Your profile is stored with your account."><AuthForm initialMode="login" /></HubPage>;
  return <HubPage eyebrow="YOUR AAYI ACCOUNT" title={`Welcome back, ${user.full_name.split(/\s+/)[0]}.`} description="Pick up where you left off."><AccountDashboard user={user} /></HubPage>;
}
