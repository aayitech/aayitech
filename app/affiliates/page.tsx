import type { Metadata } from "next";
import { BadgeCheck, BookOpenCheck, CircleDollarSign, HeartHandshake } from "lucide-react";
import HubPage from "@/components/hub/HubPage";
import styles from "@/components/hub/hub.module.css";

export const metadata: Metadata = { title: "AAYI Picks | Honest Tool Recommendations", description: "A forthcoming directory of useful software and digital products, with transparent affiliate disclosures." };

const categories = [
  { title: "SEO & content", body: "Research and publishing tools that help small teams create better content.", icon: BookOpenCheck },
  { title: "Websites & hosting", body: "Practical services for launching a site and keeping it online.", icon: BadgeCheck },
  { title: "Work & automation", body: "Tools that reduce repetitive admin and help everyday work flow.", icon: HeartHandshake },
];

export default function AffiliatesPage() {
  return <HubPage eyebrow="AAYI PICKS" title="Good recommendations. No hidden agenda." description="A directory of digital products we find genuinely useful, selected for their practical value and explained in plain language.">
    <section className={styles.affiliatePage}>
      <div className={styles.disclosure}><CircleDollarSign size={18} /><p><b>Clear affiliate disclosure</b><br />Some future links may earn AAYI TECH a commission. If they do, we&apos;ll label them clearly. It won&apos;t change the price you pay or how honestly we review a product.</p></div>
      <div className={styles.affiliateCategoryGrid}>{categories.map(({ title, body, icon: Icon }) => <article key={title}><span><Icon size={18} /></span><h2>{title}</h2><p>{body}</p><small>Recommendations being curated</small></article>)}</div>
      <div className={styles.affiliateNote}><b>We&apos;re building this list carefully.</b><p>No paid placements or partner links are live yet. Each recommendation will include who it suits, what it does well, and where its limits are.</p></div>
    </section>
  </HubPage>;
}
