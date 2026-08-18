"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  RefreshCw,
  Loader2,
  Filter,
  CheckCircle2,
  XCircle,
  Play,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import {
  BOOKING_STATUSES,
  cn,
  formatDateDisplay,
  formatTimeSlot,
} from "@/lib/utils";
import type { Booking } from "@/db/schema";

type Stats = {
  total: number;
  pending: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
};

const statusStyles: Record<string, string> = {
  pending: "badge-pending",
  confirmed: "border border-sky-400/30 bg-sky-500/15 text-sky-300",
  in_progress: "border border-violet-400/30 bg-violet-500/15 text-violet-300",
  completed: "badge-completed",
  cancelled: "border border-slate-400/30 bg-slate-500/15 text-slate-300",
  no_show: "badge-emergency",
};

export default function BookingDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const q = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`/api/bookings${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setBookings(data.bookings || []);
      setStats(data.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(bookingCode: string, status: string, notes?: string) {
    setUpdating(bookingCode);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode,
          status,
          adminNotes: notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setBookings((prev) =>
        prev.map((b) => (b.bookingCode === bookingCode ? data.booking : b))
      );
      if (selected?.bookingCode === bookingCode) {
        setSelected(data.booking);
      }
      // refresh stats
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  function openDetail(b: Booking) {
    setSelected(b);
    setAdminNotes(b.adminNotes || "");
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total", value: stats.total, key: "all" },
            { label: "Pending", value: stats.pending, key: "pending" },
            { label: "Confirmed", value: stats.confirmed, key: "confirmed" },
            { label: "In Progress", value: stats.inProgress, key: "in_progress" },
            { label: "Completed", value: stats.completed, key: "completed" },
            { label: "Cancelled", value: stats.cancelled, key: "cancelled" },
          ].map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setFilter(s.key)}
              className={cn(
                "rounded-2xl border p-4 text-left transition",
                filter === s.key
                  ? "border-brand-400/40 bg-brand-500/20"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="mt-0.5 text-xs text-slate-400">{s.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="h-4 w-4" />
          <select
            className="input-field w-auto py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="btn-outline py-2 text-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* List */}
      {loading && bookings.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl glass p-12 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">No bookings yet</h3>
          <p className="mt-2 text-sm text-slate-400">
            New customer bookings will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="rounded-2xl glass p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold tracking-wider text-brand-300">
                      {b.bookingCode}
                    </span>
                    <span className={cn("badge", statusStyles[b.status] || "badge-pending")}>
                      {b.status.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="mt-1.5 truncate text-lg font-semibold text-white">
                    {b.fullName}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-300">
                    {b.serviceName || b.serviceType}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateDisplay(b.preferredDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimeSlot(b.timeSlot)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {b.city}, {b.zipCode}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {b.phone}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {b.status === "pending" && (
                    <button
                      type="button"
                      disabled={updating === b.bookingCode}
                      onClick={() => updateStatus(b.bookingCode, "confirmed")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/30"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Confirm
                    </button>
                  )}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <button
                      type="button"
                      disabled={updating === b.bookingCode}
                      onClick={() => updateStatus(b.bookingCode, "in_progress")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/30"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Start Job
                    </button>
                  )}
                  {b.status === "in_progress" && (
                    <button
                      type="button"
                      disabled={updating === b.bookingCode}
                      onClick={() => updateStatus(b.bookingCode, "completed")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Complete
                    </button>
                  )}
                  {!["cancelled", "completed", "no_show"].includes(b.status) && (
                    <button
                      type="button"
                      disabled={updating === b.bookingCode}
                      onClick={() => updateStatus(b.bookingCode, "cancelled")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/20 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-500/30"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openDetail(b)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                  >
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl glass-strong p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-300">
                    {selected.bookingCode}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    {selected.fullName}
                  </h3>
                </div>
                <span
                  className={cn(
                    "badge",
                    statusStyles[selected.status] || "badge-pending"
                  )}
                >
                  {selected.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="h-4 w-4 text-brand-400" />
                  {selected.serviceName} · {selected.propertyType}
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="h-4 w-4 text-brand-400" />
                  {formatDateDisplay(selected.preferredDate)} ·{" "}
                  {formatTimeSlot(selected.timeSlot)}
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="h-4 w-4 text-brand-400" />
                  <a href={`tel:${selected.phone}`} className="hover:text-white">
                    {selected.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="h-4 w-4 text-brand-400" />
                  <a
                    href={`mailto:${selected.email}`}
                    className="break-all hover:text-white"
                  >
                    {selected.email}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                  <span>
                    {selected.address}, {selected.city}, {selected.zipCode}
                  </span>
                </div>
                {selected.accessNotes && (
                  <div className="flex items-start gap-2 text-slate-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>{selected.accessNotes}</span>
                  </div>
                )}
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-300">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Issue Description
                  </div>
                  {selected.description}
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Internal Notes
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Tech notes, parts needed, etc."
                />
                <button
                  type="button"
                  disabled={updating === selected.bookingCode}
                  onClick={() =>
                    updateStatus(selected.bookingCode, selected.status, adminNotes)
                  }
                  className="btn-outline mt-2 w-full py-2 text-sm"
                >
                  Save Notes
                </button>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BOOKING_STATUSES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      disabled={
                        updating === selected.bookingCode ||
                        selected.status === s.value
                      }
                      onClick={() =>
                        updateStatus(selected.bookingCode, s.value, adminNotes)
                      }
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                        selected.status === s.value
                          ? "border-brand-400/40 bg-brand-500/20 text-brand-200"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="btn-primary mt-6 w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
