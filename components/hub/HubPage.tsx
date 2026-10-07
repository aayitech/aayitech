import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import styles from "./hub.module.css";

export default function HubPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <main className={styles.page}>
      <div className={styles.pageTop}><Link href="/" className={styles.back}><ArrowLeft size={14} /> AAYI TECH hub</Link><span><Sparkles size={13} /> TOOLS THAT MAKE THINGS SIMPLER</span></div>
      <header className={styles.pageHeader}><div className={styles.eyebrow}>{eyebrow}</div><h1>{title}</h1><p>{description}</p></header>
      {children}
    </main>
  );
}
