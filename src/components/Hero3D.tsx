"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Phone,
  FileText,
  Star,
  Clock,
  Shield,
  Wrench,
  ArrowRight,
  Calendar,
} from "lucide-react";
import Particles from "./Particles";
import { COMPANY } from "@/lib/utils";

function PipeScene() {
  return (
    <div className="relative mx-auto h-[280px] w-full max-w-md sm:h-[340px] lg:h-[400px]">
      {/* Glow orb */}
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl sm:h-64 sm:w-64" />

      <div className="pipe-3d relative h-full w-full preserve-3d perspective-1000">
        {/* Central valve / wrench emblem */}
        <motion.div
          animate={{ rotateY: [0, 8, 0, -8, 0], rotateX: [0, 4, 0, -4, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-navy-900 shadow-2xl shadow-brand-500/40 sm:h-40 sm:w-40"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-1 rounded-[1.3rem] border border-white/20" />
          <Wrench className="h-14 w-14 text-white sm:h-16 sm:w-16" strokeWidth={1.5} />
          {/* Orbiting ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-18px] rounded-[2rem] border border-dashed border-brand-400/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-32px] rounded-[2.5rem] border border-brand-300/20"
          />
        </motion.div>

        {/* Floating service badges */}
        {[
          { label: "24/7", icon: Clock, x: "-8%", y: "12%", delay: 0 },
          { label: "Licensed", icon: Shield, x: "78%", y: "18%", delay: 0.4 },
          { label: "4.8★", icon: Star, x: "72%", y: "68%", delay: 0.8 },
          { label: "Fast", icon: Phone, x: "-4%", y: "62%", delay: 1.2 },
        ].map((badge) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: badge.delay, duration: 0.5 },
                scale: { delay: badge.delay, duration: 0.5 },
                y: {
                  delay: badge.delay + 0.5,
                  duration: 4 + badge.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute z-30 flex items-center gap-2 rounded-2xl glass-strong px-3 py-2 shadow-xl"
              style={{ left: badge.x, top: badge.y }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20">
                <Icon className="h-4 w-4 text-brand-300" />
              </div>
              <span className="text-sm font-semibold text-white">{badge.label}</span>
            </motion.div>
          );
        })}

        {/* Decorative pipes */}
        <div className="absolute left-[10%] top-[40%] h-2 w-24 rounded-full bg-gradient-to-r from-transparent via-brand-400/50 to-brand-500/80 blur-[1px]" />
        <div className="absolute right-[8%] top-[45%] h-2 w-28 rounded-full bg-gradient-to-l from-transparent via-sky-400/40 to-brand-400/70 blur-[1px]" />
        <div className="absolute bottom-[22%] left-1/2 h-20 w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-400/60 to-transparent blur-[1px]" />

        {/* Water drops */}
        {[15, 40, 65, 85].map((left, i) => (
          <span
            key={i}
            className="water-drop"
            style={{
              left: `${left}%`,
              top: "8%",
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero3D() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden mesh-bg noise pt-24 pb-16">
      <Particles count={28} />

      {/* Grid floor effect */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(51,153,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(51,153,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {COMPANY.hours} · {COMPANY.serviceArea}
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Plumbing Done{" "}
              <span className="text-gradient">1st Class</span>
              <br />
              Every Time
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Family-owned South Florida plumbers trusted by{" "}
              <strong className="text-white">{COMPANY.reviewCount}+ homeowners</strong>.
              Honest pricing, expert workmanship, and real emergency response —
              not an answering service.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400 drop-shadow"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">
                {COMPANY.rating} stars
              </span>
              <span className="text-sm text-slate-400">
                from {COMPANY.reviewCount} Google reviews
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/book" className="btn-primary text-base">
                <Calendar className="h-5 w-5" />
                Book Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/quote" className="btn-outline text-base">
                <FileText className="h-5 w-5 text-brand-400" />
                Free Quote
              </Link>
              <a href={`tel:${COMPANY.phoneRaw}`} className="btn-outline text-base">
                <Phone className="h-5 w-5 text-brand-400" />
                {COMPANY.phone}
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { value: "24/7", label: "Emergency" },
                { value: "4.8★", label: "Rating" },
                { value: "136+", label: "Reviews" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl glass px-3 py-4 text-center sm:px-4"
                >
                  <div className="text-xl font-bold text-gradient sm:text-2xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400 sm:text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="order-1 lg:order-2"
        >
          <PipeScene />
        </motion.div>
      </div>
    </section>
  );
}
