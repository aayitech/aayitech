"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import styles from "./hub.module.css";

type Asset = { symbol: string; price: number; change24h: number; high24h: number; low24h: number; quoteVolume: number };
const names: Record<string, string> = { BTC: "Bitcoin", ETH: "Ethereum", BNB: "BNB", SOL: "Solana", XRP: "XRP", ADA: "Cardano", DOGE: "Dogecoin" };
const formatPrice = (price: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: price < 1 ? 5 : 2 }).format(price);

export default function CryptoDashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/markets/crypto", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Crypto market data is unavailable.");
      setAssets(result.assets); setUpdatedAt(result.updatedAt);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Crypto market data is unavailable."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  const ordered = [...assets].sort((a, b) => b.change24h - a.change24h);
  const strongest = ordered[0];
  const weakest = ordered[ordered.length - 1];

  return <div className={styles.marketStack}>
    <div className={styles.marketSummary}><div><span>MARKET VIEW</span><b>Major USDT pairs</b><small>24 hour change · sorted by strongest movement</small></div><div className={styles.marketRefresh}><button type="button" onClick={load} disabled={loading} aria-label="Refresh crypto market data"><RefreshCw size={15} className={loading ? styles.spinner : ""} /></button><small>{updatedAt ? `Updated ${new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Live data"}</small></div></div>
    {error && <div role="alert" className={styles.error}>{error}</div>}
    {!error && loading && assets.length === 0 && <div className={styles.marketLoading}>Loading current market data…</div>}
    {!error && ordered.length > 0 && <>
      <div className={styles.movers}><div><span>TOP MOVER</span><b>{strongest?.symbol} <em className={strongest && strongest.change24h >= 0 ? styles.positive : styles.negative}>{strongest && strongest.change24h >= 0 ? "+" : ""}{strongest?.change24h.toFixed(2)}%</em></b><small>{names[strongest?.symbol ?? ""] ?? strongest?.symbol} · 24 hours</small></div><div><span>MOVING DOWN</span><b>{weakest?.symbol} <em className={styles.negative}>{weakest?.change24h.toFixed(2)}%</em></b><small>{names[weakest?.symbol ?? ""] ?? weakest?.symbol} · 24 hours</small></div></div>
      <div className={styles.marketTableWrap}><table className={styles.marketTable}><thead><tr><th>ASSET</th><th>PRICE</th><th>24H CHANGE</th><th>24H RANGE</th></tr></thead><tbody>{ordered.map((asset) => { const up = asset.change24h >= 0; const relative = Math.min(100, Math.max(10, Math.abs(asset.change24h) * 9)); return <tr key={asset.symbol}><td><b className={styles.coinBadge}>{asset.symbol.slice(0, 1)}</b><span className={styles.coinName}><b>{names[asset.symbol] ?? asset.symbol}</b><small>{asset.symbol}/USDT</small></span></td><td>{formatPrice(asset.price)}</td><td><span className={up ? styles.positive : styles.negative}>{up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{up ? "+" : ""}{asset.change24h.toFixed(2)}%</span><div className={styles.changeTrack}><i className={up ? styles.changeUp : styles.changeDown} style={{ width: `${relative}%` }} /></div></td><td><small>{formatPrice(asset.low24h)} – {formatPrice(asset.high24h)}</small></td></tr>; })}</tbody></table></div>
    </>}
    <p className={styles.disclaimer}>Market data comes from Binance public USDT pairs. Crypto prices move quickly; this simplified view is for information and learning, not investment advice.</p>
  </div>;
}
