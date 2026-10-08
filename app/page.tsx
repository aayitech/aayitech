import Link from "next/link";
import { ArrowRight, BarChart3, Bot, ChartNoAxesCombined, CircleDollarSign, CloudSun, Sparkles } from "lucide-react";
import styles from "./home.module.css";

const tools = [
  { href: "/weather", index: "01", label: "START WITH TODAY", title: "Weather & headlines", description: "Check your local forecast and browse a quick brief of recent world news.", icon: CloudSun, tag: "FREE PUBLIC DATA" },
  { href: "/markets/stocks", index: "02", label: "FOLLOW THE MARKETS", title: "Stock market", description: "A calmer view of the market with simple price and change summaries.", icon: BarChart3, tag: "MARKET SNAPSHOTS" },
  { href: "/markets/crypto", index: "03", label: "MAKE CRYPTO CLEARER", title: "Crypto pulse", description: "See which major coins are moving up or down over the last 24 hours.", icon: ChartNoAxesCombined, tag: "LIVE DATA" },
  { href: "/assistant", index: "04", label: "ASK AAYI", title: "AI site assistant", description: "Ask about AAYI tools, how they work, and where to find what you need.", icon: Bot, tag: "SITE HELPER" },
];

export default function Home() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}><span /> AAYI TECH · YOUR EVERYDAY DIGITAL TOOLKIT</div>
          <h1>Good tools make<br /><em>hard things simpler.</em></h1>
          <p>One helpful place to check local weather, understand the markets, and get a quick answer. Made for people who want useful tools without the noise.</p>
          <div className={styles.heroActions}><Link href="#toolbox" className={styles.primaryButton}>Explore the hub <ArrowRight size={16} /></Link><Link href="/signup" className={styles.secondaryButton}>Create a free account</Link></div>
          <div className={styles.heroNotes}><span><Sparkles size={14} /> Useful tools, all in one place</span><span>Free to get started</span></div>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.visualOrbit} /><div className={styles.visualCore}><span>A</span><i /></div>
          <div className={`${styles.floatCard} ${styles.weatherCard}`}><span className={styles.miniIcon}><CloudSun size={15} /></span><span><b>Weather & headlines</b><small>your local forecast, daily brief</small></span><span className={styles.miniArrow}>↗</span></div>
          <div className={`${styles.floatCard} ${styles.marketCard}`}><span className={styles.marketMark}>↗</span><span><b>Markets, simplified</b><small>up · down · what it means</small></span></div>
          <div className={`${styles.floatCard} ${styles.aiCard}`}><span className={styles.aiMark}><Bot size={15} /></span><span><b>AAYI assistant</b><small>Here when you need a hand</small></span></div>
          <div className={styles.visualCaption}>A practical hub, built to grow.</div>
        </div>
      </section>

      <section id="toolbox" className={styles.toolbox}>
        <div className={styles.sectionHead}><div><div className={styles.kicker}>THE AAYI TOOLBOX</div><h2>What can we help with?</h2></div><p>Pick a starting point. Each tool is designed to make a complicated job feel a little more manageable.</p></div>
        <div className={styles.toolGrid}>{tools.map((tool) => { const Icon = tool.icon; return <Link className={styles.toolCard} key={tool.href} href={tool.href}><div className={styles.toolCardTop}><span className={styles.toolIcon}><Icon size={19} /></span><span className={styles.toolIndex}>{tool.index}</span></div><div className={styles.toolLabel}>{tool.label}</div><h3>{tool.title}</h3><p>{tool.description}</p><div className={styles.toolCardBottom}><span>{tool.tag}</span><ArrowRight size={16} /></div></Link>; })}</div>
      </section>

      <section className={styles.lowerGrid}>
        <Link href="/affiliates" className={styles.affiliateCard}><div className={styles.kicker}>THE AAYI PICKS</div><div className={styles.affiliateIcon}><CircleDollarSign size={21} /></div><h2>Tools we’d recommend.<br /><em>And why.</em></h2><p>A transparent directory of useful products, with honest notes and clear affiliate disclosures.</p><span className={styles.inlineLink}>Browse our picks <ArrowRight size={15} /></span></Link>
        <div className={styles.accountCard}><div className={styles.kicker}>YOUR AAYI ACCOUNT</div><h2>Keep your work<br />in one place.</h2><p>Keep your profile and helpful tools close. Your account data is stored securely when the database is connected.</p><Link href="/signup" className={styles.accountLink}>Create a free account <ArrowRight size={15} /></Link><div className={styles.accountPattern}><span>01</span><span>02</span><span>03</span></div></div>
      </section>

      <section className={styles.aboutStrip}><div><span className={styles.kicker}>BUILT BY AAYI TECH</span><h2>Useful by design.<br /><em>Thoughtful at heart.</em></h2></div><p>AAYI is growing into a practical digital hub, one genuinely useful tool at a time. Explore Ambreen’s work and the story behind the systems we build.</p><Link href="/ambreen" className={styles.inlineLink}>Visit Ambreen’s portfolio <ArrowRight size={15} /></Link></section>
    </main>
  );
}
