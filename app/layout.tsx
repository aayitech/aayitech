import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "AAYI TECH | Free Tools for Everyday Tasks",
  description:
    "Small, useful tools for everyday work. Clean up text, count words, calculate discounts, and split bills for free with AAYI TECH.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <Navbar />
          <div className="w-full">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
