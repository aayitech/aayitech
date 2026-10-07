import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import StockLookup from "@/components/hub/StockLookup";

export const metadata: Metadata = { title: "Stock Market, Simplified | AAYI TECH", description: "Look up stock quotes and see a simple explanation of what price movement means." };

export default function StocksPage() {
  return <HubPage eyebrow="FOLLOW THE MARKETS" title="Stocks, without the jargon." description="Look up a ticker and see its latest reported price and daily direction, plus a plain language guide to reading the numbers."><StockLookup /></HubPage>;
}
