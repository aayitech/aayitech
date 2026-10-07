"use client";

import { FormEvent, useState } from "react";
import { ArrowDownRight, ArrowUpRight, LoaderCircle, Search } from "lucide-react";
import styles from "./hub.module.css";

type Quote = { symbol: string; price: number; change: number; changePercent: string; latestTradingDay: string; source: string; delayed: boolean };

export default function StockLookup() {
  const [symbol, setSymbol] = useState("AAPL");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup(event?: FormEvent<HTMLFormElement>, requestedSymbol = symbol) {
    event?.preventDefault(); setSymbol(requestedSymbol.toUpperCase()); setError(""); setQuote(null); setLoading(true);
    try {
      const response = await fetch(`/api/markets/stocks?symbol=${encodeURIComponent(requestedSymbol)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Quote could not be loaded.");
      setQuote(result);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Quote could not be loaded."); }
    finally { setLoading(false); }
  }

  const up = (quote?.change ?? 0) >= 0;
  return <div className={styles.stockLayout}>
    <section className={styles.panel}>
      <div className={styles.panelKicker}>LOOK UP A STOCK</div>
      <form className={styles.stockSearch} onSubmit={lookup}><label className={styles.srOnly} htmlFor="stock-symbol">Stock ticker</label><span><Search size={16} /><input id="stock-symbol" value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase())} maxLength={10} placeholder="AAPL" /></span><button type="submit" disabled={loading}>{loading ? <LoaderCircle size={15} className={styles.spinner} /> : "Look up"}</button></form>
      <div className={styles.quickTickers}><span>QUICK LOOKUP</span>{[{ symbol: "SPY", label: "S&P 500" }, { symbol: "QQQ", label: "Nasdaq 100" }, { symbol: "DIA", label: "Dow Jones" }, { symbol: "AAPL", label: "Apple" }, { symbol: "NVDA", label: "NVIDIA" }].map((item) => <button key={item.symbol} type="button" onClick={() => void lookup(undefined, item.symbol)} disabled={loading}>{item.label}</button>)}</div>
      <p className={styles.formNote}>Try AAPL, MSFT, NVDA, SPY, or another supported ticker.</p>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {quote && <div className={styles.quoteCard}><div className={styles.quoteTitle}><span>{quote.symbol}</span><small>{quote.latestTradingDay ? `Latest trading day · ${quote.latestTradingDay}` : "Latest quote"}</small></div><b className={styles.quotePrice}>${quote.price.toFixed(2)}</b><div className={up ? styles.positive : styles.negative}>{up ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}{up ? "+" : ""}${Math.abs(quote.change).toFixed(2)} ({up ? "+" : ""}{quote.changePercent}%)</div><p className={styles.quoteNote}>A snapshot from {quote.source}. Data may be delayed based on provider plan.</p></div>}
    </section>
    <aside className={styles.stockAside}><div className={styles.panelKicker}>A SIMPLE WAY TO READ IT</div><h2>What am I looking at?</h2><div className={styles.reading}><span className={styles.readDot} /><p><b>Price</b><br />The latest reported share price in US dollars.</p></div><div className={styles.reading}><span className={styles.readDot} /><p><b>Daily change</b><br />How much the price changed versus its previous close.</p></div><div className={styles.reading}><span className={styles.readDot} /><p><b>Up or down?</b><br />Green means higher; red means lower for the period shown.</p></div><div className={styles.stockSetup}>Live quotes need an Alpha Vantage key in the server settings. The page never invents missing prices.</div></aside>
  </div>;
}
