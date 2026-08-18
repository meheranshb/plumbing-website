import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { COMPANY } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.shortName} | South Florida 24/7 Plumbers`,
    template: `%s | ${COMPANY.shortName}`,
  },
  description:
    "Family-owned 24/7 plumbing in South Florida. Leak detection, drain cleaning, water heaters, emergency repairs. 4.8★ from 136+ reviews. Call +1 786-663-4270.",
  keywords: [
    "plumber South Florida",
    "emergency plumber Miami",
    "leak detection",
    "drain cleaning",
    "water heater repair",
    "1st Class Plumbing",
  ],
  openGraph: {
    title: `${COMPANY.name} — 24/7 Plumbing`,
    description: COMPANY.tagline,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="mesh-bg min-h-screen antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
