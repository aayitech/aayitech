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
  title: "AAYI TECH | HubSpot & GoHighLevel CRM Automation",
  description:
    "Explore AAYI TECH's CRM automation services, technologies, projects, delivery approach, and contact information.",
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
