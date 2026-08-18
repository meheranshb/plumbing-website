"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Wrench,
  Phone,
  CheckCircle2,
} from "lucide-react";
import {
  cn,
  formatDateDisplay,
  formatTimeSlot,
} from "@/lib/utils";
import type { Booking } from "@/db/schema";

const statusStyles: Record<string, string> = {
  pending: "badge-pending",
  confirmed: "border border-sky-400/30 bg-sky-500/15 text-sky-300",
  in_progress: "border border-violet-400/30 bg-violet-500/15 text-violet-300",
  completed: "badge-completed",
  cancelled: "border border-slate-400/30 bg-slate-500/15 text-slate-300",
  no_show: "badge-emergency",
};

export default function BookingLookup({
  initialCode,
}: {
  initialCode?: string;
}) {
  const [code, setCode] = useState(initialCode || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);

  async function lookup(lookupCode: string) {
    if (!lookupCode.trim()) return;
    setLoading(true);
    setError("");
    setBooking(null);
    try {
      const res = await fetch(
        `/api/bookings?code=${encodeURIComponent(lookupCode.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking not found");
      setBooking(data.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialCode) lookup(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    lookup(code);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <form onSubmit={onSubmit} className="rounded-3xl glass-strong p-6 sm:p-8">
        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Booking Code
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input-field font-mono uppercase tracking-wider"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="BKXXXXXXXX"
            required
          />
          <button type="submit" disabled={loading} className="btn-primary shrink-0">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Look Up
          </button>
        </div>
        {error && (
          <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </form>

      {booking && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass-strong p-6 sm:p-8"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">Booking Found</span>
              </div>
              <h2 className="mt-2 font-mono text-xl font-bold tracking-wider text-white">
                {booking.bookingCode}
              </h2>
            </div>
            <span
              className={cn(
                "badge",
                statusStyles[booking.status] || "badge-pending"
              )}
            >
              {booking.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-slate-300">
              <Wrench className="h-4 w-4 text-brand-400" />
              <span>{booking.serviceName || booking.serviceType}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="h-4 w-4 text-brand-400" />
              <span>{formatDateDisplay(booking.preferredDate)}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Clock className="h-4 w-4 text-brand-400" />
              <span>{formatTimeSlot(booking.timeSlot)}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="h-4 w-4 text-brand-400" />
              <span>
                {booking.address}, {booking.city}, {booking.zipCode}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="h-4 w-4 text-brand-400" />
              <span>{booking.phone}</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Issue
            </div>
            {booking.description}
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Need to change this appointment? Call us at{" "}
            <a href="tel:17866634270" className="text-brand-300 hover:text-white">
              +1 786-663-4270
            </a>{" "}
            with your booking code.
          </p>
        </motion.div>
      )}
    </div>
  );
}
