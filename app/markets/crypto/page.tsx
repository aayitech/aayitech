import type { Metadata } from "next";
import HubPage from "@/components/hub/HubPage";
import CryptoDashboard from "@/components/hub/CryptoDashboard";

export const metadata: Metadata = { title: "Crypto Pulse | AAYI TECH", description: "See simple 24-hour movement for major crypto assets, with clear up and down market direction." };

export default function CryptoPage() {
  return <HubPage eyebrow="MAKE CRYPTO CLEARER" title="Crypto, in plain sight." description="A simple snapshot of major crypto pairs, their daily direction, and the biggest moves. Updated from live public market data."><CryptoDashboard /></HubPage>;
}
