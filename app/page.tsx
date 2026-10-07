"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, Copy, FileText, Hash, Scissors, Sparkles, Type, WandSparkles } from "lucide-react";
import styles from "./home.module.css";

type ToolId = "text" | "math";

const toolCards = [
  { id: "text" as const, number: "01", title: "Text cleaner", description: "Tidy messy copy, count words, and change case in seconds.", label: "WRITING", icon: Type },
  { id: "math" as const, number: "02", title: "Quick calculations", description: "Work out a discount, see what you save, or split a bill.", label: "EVERYDAY MATH", icon: Hash },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>("text");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [price, setPrice] = useState("100");
  const [rate, setRate] = useState("15");
  const [people, setPeople] = useState("2");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { words, characters: text.length, lines: text ? text.split(/\r\n|\r|\n/).length : 0 };
  }, [text]);

  const cleanedText = text.replace(/[\t ]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
  const numericPrice = Number(price) || 0;
  const numericRate = Number(rate) || 0;
  const discount = Math.max(0, Math.min(100, numericRate));
  const splitCount = Math.max(1, Number(people) || 1);

  function transformText(mode: "clean" | "upper" | "lower" | "title") {
    if (mode === "clean") setText(cleanedText);
    if (mode === "upper") setText(text.toUpperCase());
    if (mode === "lower") setText(text.toLowerCase());
    if (mode === "title") setText(text.toLowerCase().replace(/\b\p{L}/gu, (letter) => letter.toUpperCase()));
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(cleanedText || text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className={styles.site}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}><span className={styles.liveDot} /> A little help for your everyday</div>
            <h1>Small tools.<br /><span>Less busywork.</span></h1>
            <p className={styles.lede}>Handy, no-fuss tools for the things you do every day. Free to use, right in your browser, and made to give you a little time back.</p>
            <a className={styles.primaryButton} href="#tools">Find a tool <ArrowDown size={16} /></a>
            <div className={styles.trustRow}><span><Check size={14} /> Free to use</span><span><Check size={14} /> No account needed</span><span><Check size={14} /> Your text stays yours</span></div>
          </div>
          <div className={styles.heroArt} aria-label="A preview of simple tools that make everyday tasks easier">
            <div className={styles.artHalo} />
            <div className={styles.floatingNote}><span className={styles.noteIcon}><Sparkles size={15} /></span><span><b>Little things, sorted.</b><small>One less tab to open.</small></span><span className={styles.noteCheck}><Check size={14} /></span></div>
            <div className={styles.previewCard}>
              <div className={styles.previewTop}><span className={styles.previewIcon}><FileText size={16} /></span><span className={styles.previewTitle}>Text cleaner</span><span className={styles.previewDots}>•••</span></div>
              <div className={styles.previewText}>A cleaner draft<br /><span>in just a few clicks.</span></div>
              <div className={styles.previewRule} />
              <div className={styles.previewBottom}><span>WORDS <b>8</b></span><span>CHARS <b>41</b></span><span className={styles.cleanBadge}><Check size={11} /> Cleaned</span></div>
            </div>
            <div className={styles.orbitTag}><WandSparkles size={14} /> Useful, not complicated</div>
          </div>
        </div>
        <a href="#tools" className={styles.scrollHint}>SCROLL TO EXPLORE <ChevronDown size={14} /></a>
      </section>

      <section id="tools" className={styles.toolsSection}>
        <div className={styles.sectionIntro}>
          <div><div className={styles.sectionEyebrow}>THE TOOLBOX <span>—</span> 02 TOOLS, READY NOW</div><h2>What do you need<br />a hand with?</h2></div>
          <p>Pick a tool and get straight to it. No sign-up, no setup, no fuss.</p>
        </div>
        <div className={styles.toolLayout}>
          <div className={styles.toolList}>
            {toolCards.map(({ id, number, title, description, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setActiveTool(id)} className={`${styles.toolCard} ${activeTool === id ? styles.toolCardActive : ""}`} aria-pressed={activeTool === id}>
                <span className={styles.toolIcon}><Icon size={19} /></span>
                <span className={styles.toolCardCopy}><span className={styles.toolLabel}>{label} <span>· {number}</span></span><b>{title}</b><small>{description}</small></span>
                <ArrowRight size={17} className={styles.toolArrow} />
              </button>
            ))}
            <div className={styles.comingCard}><span className={styles.comingSpark}><Sparkles size={16} /></span><span><b>More little helpers are on the way</b><small>Built around real everyday tasks.</small></span></div>
          </div>

          <div className={styles.workspace}>
            {activeTool === "text" ? (
              <>
                <div className={styles.workspaceHeader}><div><div className={styles.workspaceKicker}><span className={styles.workspaceIcon}><Type size={15} /></span> WRITING TOOL</div><h3>Text cleaner</h3><p>Paste your text. Tidy it up. Copy when you&apos;re ready.</p></div><span className={styles.privateTag}><span /> PRIVATE BY DESIGN</span></div>
                <label className={styles.srOnly} htmlFor="text-input">Text to clean</label>
                <textarea id="text-input" className={styles.textArea} value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste or type your text here…" />
                <div className={styles.textStats}><span><b>{stats.words}</b> words</span><i /><span><b>{stats.characters}</b> characters</span><i /><span><b>{stats.lines}</b> lines</span><button type="button" onClick={() => setText("")} className={styles.clearButton} disabled={!text}>Clear</button></div>
                <div className={styles.actionsLabel}>MAKE IT YOURS</div>
                <div className={styles.actionRow}>
                  <button type="button" onClick={() => transformText("clean")} disabled={!text}><Scissors size={14} /> Clean spacing</button>
                  <button type="button" onClick={() => transformText("title")} disabled={!text}>Title case</button>
                  <button type="button" onClick={() => transformText("upper")} disabled={!text}>UPPERCASE</button>
                  <button type="button" onClick={() => transformText("lower")} disabled={!text}>lowercase</button>
                </div>
                <div className={styles.workspaceFooter}><span><span className={styles.privacyDot} /> Your text is processed in this browser</span><button type="button" className={styles.copyButton} onClick={copyText} disabled={!text}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy text"}</button></div>
              </>
            ) : (
              <>
                <div className={styles.workspaceHeader}><div><div className={styles.workspaceKicker}><span className={styles.workspaceIcon}><Hash size={15} /></span> EVERYDAY MATH</div><h3>Quick calculations</h3><p>Get the useful number without reaching for a spreadsheet.</p></div><span className={styles.privateTag}><span /> NO DATA SAVED</span></div>
                <div className={styles.calcFields}>
                  <label>Original amount <span className={styles.inputWrap}><span>$</span><input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} /></span></label>
                  <label>Discount <span className={styles.inputWrap}><input type="number" min="0" max="100" value={rate} onChange={(event) => setRate(event.target.value)} /><span>%</span></span></label>
                </div>
                <div className={styles.resultCards}><div className={styles.resultCard}><span>YOU SAVE</span><b>${(numericPrice * discount / 100).toFixed(2)}</b><small>{discount}% off</small></div><div className={`${styles.resultCard} ${styles.resultHighlight}`}><span>NEW TOTAL</span><b>${(numericPrice * (1 - discount / 100)).toFixed(2)}</b><small>after discount</small></div></div>
                <div className={styles.splitRow}><div><span className={styles.splitIcon}><Hash size={15} /></span><span><b>Split the bill</b><small>Divide the original amount evenly</small></span></div><label><span className={styles.srOnly}>Number of people</span><input type="number" min="1" value={people} onChange={(event) => setPeople(event.target.value)} /><span>people</span></label></div>
                <div className={styles.splitResult}><span>Each person pays</span><b>${(numericPrice / splitCount).toFixed(2)}</b></div>
                <div className={styles.workspaceFooter}><span><span className={styles.privacyDot} /> Calculated instantly on your device</span><span className={styles.calcNote}>Currency shown in USD</span></div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="why" className={styles.promiseSection}>
        <div className={styles.promiseIntro}><div className={styles.sectionEyebrow}>AAYI TECH, A LITTLE DIFFERENT</div><h2>Useful first.<br /><span>Always.</span></h2><p>AAYI TECH is becoming a home for small, genuinely useful web tools. The kind that save a few minutes, skip a signup, and get out of your way.</p><a href="/ambreen" className={styles.textLink}>Meet Ambreen, the builder <ArrowRight size={15} /></a></div>
        <div className={styles.promiseItems}><div><span>01</span><b>Made for real tasks</b><p>Simple answers to small jobs that come up in everyday life and work.</p></div><div><span>02</span><b>Free and easy to reach</b><p>Open the page and start. No account or installation to slow you down.</p></div><div><span>03</span><b>Thoughtful by default</b><p>Where possible, tools work locally so your information stays with you.</p></div></div>
      </section>

      <section className={styles.bottomCta}><div><span className={styles.sectionEyebrow}>YOUR NEXT LITTLE WIN</span><h2>Have a small task?<br /><span>There&apos;s a tool for that.</span></h2></div><a href="#tools" className={styles.primaryButton}>Explore the toolbox <ArrowRight size={16} /></a></section>
    </main>
  );
}
