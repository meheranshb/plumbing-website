"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Droplets,
  FileText,
  Wrench,
  Images,
  Info,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { COMPANY, cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", icon: Droplets },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/book", label: "Book Now", icon: Calendar },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/quote", label: "Get Quote", icon: FileText },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: MessageSquare },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-navy-950/90 backdrop-blur-xl border-b border-brand-500/20 shadow-lg shadow-brand-900/20"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
              <Droplets className="h-6 w-6 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-ping rounded-full bg-sky-300" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-white sm:text-base">
                1st Class Plumbing
              </div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-brand-300 sm:text-xs">
                South Florida · 24/7
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-brand-500/20 border border-brand-400/30"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:scale-105 sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{COMPANY.phone}</span>
              <span className="xl:hidden">Call Now</span>
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[68px] z-40 border-b border-brand-500/20 bg-navy-950/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {links.map((link, i) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition",
                        active
                          ? "bg-brand-500/20 text-white border border-brand-400/30"
                          : "text-slate-300 hover:bg-white/5"
                      )}
                    >
                      <Icon className="h-5 w-5 text-brand-400" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-3.5 text-base font-semibold text-white"
              >
                <Phone className="h-5 w-5" />
                {COMPANY.phone}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
