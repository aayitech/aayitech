"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CloudSun, LogOut, TrendingUp, Bitcoin, Newspaper } from "lucide-react";
import styles from "./hub.module.css";

type AccountUser = { full_name: string; email: string; created_at: string };

const shortcuts = [
  { href: "/weather", label: "Weather & headlines", icon: CloudSun },
  { href: "/news", label: "News topics", icon: Newspaper },
  { href: "/markets/stocks", label: "Stock market", icon: TrendingUp },
  { href: "/markets/crypto", label: "Crypto pulse", icon: Bitcoin },
];

export default function AccountDashboard({ user }: { user: AccountUser }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return <section className={styles.accountDashboard}>
    <div className={styles.accountWelcome}><div><div className={styles.panelKicker}>YOUR AAYI ACCOUNT</div><h2>Welcome, {user.full_name}.</h2><p>{user.email}</p></div><button type="button" className={styles.logoutButton} onClick={logout}><LogOut size={14} /> Sign out</button></div>
    <div className={styles.savedHeader}><div><h3>Your AAYI profile</h3><p>Member since {new Date(user.created_at).toLocaleDateString()}.</p></div><span className={styles.smallLink}>Account active</span></div>
    <div className={styles.accountShortcuts}>{shortcuts.map(({ href, label, icon: Icon }) => <Link key={href} href={href}><span><Icon size={17} />{label}</span><ArrowRight size={14} /></Link>)}</div>
  </section>;
}
