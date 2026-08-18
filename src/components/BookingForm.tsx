"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Wrench,
  Home,
  CheckCircle2,
  Loader2,
  Copy,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Building2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  SERVICE_OPTIONS,
  TIME_SLOTS,
  cn,
  getMinBookingDate,
  getMaxBookingDate,
  formatDateDisplay,
  formatTimeSlot,
} from "@/lib/utils";

type SlotInfo = {
  value: string;
  label: string;
  booked: number;
  available: boolean;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  serviceType: string;
  preferredDate: string;
  timeSlot: string;
  propertyType: "residential" | "commercial" | "multi_family";
  accessNotes: string;
  description: string;
};

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zipCode: "",
  serviceType: "drain",
  preferredDate: "",
  timeSlot: "",
  propertyType: "residential",
  accessNotes: "",
  description: "",
};

export default function BookingForm({
  defaultService,
}: {
  defaultService?: string;
}) {
  const [form, setForm] = useState<FormState>({
    ...initial,
    serviceType: defaultService || "drain",
    preferredDate: getMinBookingDate(),
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState<{
    bookingCode: string;
    preferredDate: string;
    timeSlot: string;
    serviceName: string | null;
    status: string;
  } | null>(null);

  useEffect(() => {
    if (!form.preferredDate) return;
    let cancelled = false;
    setSlotsLoading(true);
    fetch(
      `/api/bookings?availability=1&date=${encodeURIComponent(form.preferredDate)}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots || []);
        // Clear selected slot if no longer available
        if (
          form.timeSlot &&
          data.slots &&
          !data.slots.find(
            (s: SlotInfo) => s.value === form.timeSlot && s.available
          )
        ) {
          setForm((f) => ({ ...f, timeSlot: "" }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlots(
            TIME_SLOTS.map((t) => ({
              ...t,
              booked: 0,
              available: true,
            }))
          );
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.preferredDate]);

  const set =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.timeSlot) {
      setError("Please select a time slot");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to book");
      setSuccess({
        bookingCode: data.booking.bookingCode,
        preferredDate: data.booking.preferredDate,
        timeSlot: data.booking.timeSlot,
        serviceName: data.booking.serviceName,
        status: data.booking.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyCode() {
    if (!success) return;
    navigator.clipboard.writeText(success.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl glass-strong p-8 text-center sm:p-10"
      >
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Booking{" "}
          {success.status === "confirmed" ? "Confirmed!" : "Received!"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Thanks {form.fullName.split(" ")[0]}! Your plumbing appointment is
          scheduled. Our team will reach out to confirm details.
        </p>

        <div className="mx-auto mt-8 max-w-md space-y-3 rounded-2xl border border-brand-400/30 bg-brand-500/10 p-5 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-wider text-brand-300">
              Booking Code
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-wider text-white">
                {success.bookingCode}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:text-white"
                aria-label="Copy code"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {copied && (
            <p className="text-right text-xs text-emerald-400">Copied!</p>
          )}
          <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-400">Service</span>
              <span className="text-right font-medium text-white">
                {success.serviceName}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-400">Date</span>
              <span className="font-medium text-white">
                {formatDateDisplay(success.preferredDate)}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-400">Time</span>
              <span className="font-medium text-white">
                {formatTimeSlot(success.timeSlot)}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-400">Status</span>
              <span
                className={cn(
                  "badge",
                  success.status === "confirmed"
                    ? "badge-completed"
                    : "badge-pending"
                )}
              >
                {success.status}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/book/lookup?code=${success.bookingCode}`}
            className="btn-primary"
          >
            View Booking
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl glass-strong p-6 sm:p-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-400">
          <span className={step >= 1 ? "text-brand-300" : ""}>Service & Time</span>
          <span className={step >= 2 ? "text-brand-300" : ""}>Your Info</span>
          <span className={step >= 3 ? "text-brand-300" : ""}>Location & Details</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                step >= s ? "bg-brand-500" : "bg-white/10"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 text-brand-300">
              <Wrench className="h-5 w-5" />
              <h3 className="font-semibold">Choose Service & Schedule</h3>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Service Needed *
              </label>
              <select
                className="input-field"
                value={form.serviceType}
                onChange={set("serviceType")}
                required
              >
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Property Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { v: "residential", l: "Home", icon: Home },
                    { v: "commercial", l: "Business", icon: Building2 },
                    { v: "multi_family", l: "Multi-Unit", icon: Building2 },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.v}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, propertyType: p.v }))
                    }
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition",
                      form.propertyType === p.v
                        ? "border-brand-400/50 bg-brand-500/20 text-brand-200"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                    )}
                  >
                    <p.icon className="h-4 w-4" />
                    {p.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Preferred Date *
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  required
                  className="input-field pl-10"
                  value={form.preferredDate}
                  min={getMinBookingDate()}
                  max={getMaxBookingDate()}
                  onChange={set("preferredDate")}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                Time Window *
                {slotsLoading && (
                  <Loader2 className="h-3 w-3 animate-spin text-brand-400" />
                )}
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(slots.length
                  ? slots
                  : TIME_SLOTS.map((t) => ({
                      ...t,
                      booked: 0,
                      available: true,
                    }))
                ).map((slot) => {
                  const isEmergency = slot.value === "emergency";
                  const selected = form.timeSlot === slot.value;
                  const disabled = !slot.available;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        setForm((f) => ({ ...f, timeSlot: slot.value }))
                      }
                      className={cn(
                        "rounded-xl border px-3 py-3 text-left text-sm transition",
                        disabled && "cursor-not-allowed opacity-40",
                        selected && isEmergency
                          ? "border-red-400/50 bg-red-500/20 text-red-200"
                          : selected
                            ? "border-brand-400/50 bg-brand-500/20 text-brand-100"
                            : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{slot.label}</span>
                        {isEmergency && (
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        {disabled
                          ? "Fully booked"
                          : slot.booked > 0
                            ? `${slot.booked} booked · spots open`
                            : "Available"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (!form.serviceType || !form.preferredDate || !form.timeSlot) {
                  setError("Please select a service, date, and time slot");
                  return;
                }
                setError("");
                setStep(2);
              }}
              className="btn-primary w-full"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-brand-300">
              <User className="h-5 w-5" />
              <h3 className="font-semibold">Contact Information</h3>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Full Name *
              </label>
              <input
                required
                className="input-field"
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Your full name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    required
                    type="email"
                    className="input-field pl-10"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    required
                    type="tel"
                    className="input-field pl-10"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="(786) 555-0100"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline flex-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!form.fullName || !form.email || !form.phone) {
                    setError("Please complete your contact details");
                    return;
                  }
                  setError("");
                  setStep(3);
                }}
                className="btn-primary flex-1"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-brand-300">
              <MapPin className="h-5 w-5" />
              <h3 className="font-semibold">Service Location & Details</h3>
            </div>

            {/* Summary chip */}
            <div className="rounded-xl border border-brand-400/20 bg-brand-500/10 px-4 py-3 text-sm text-slate-300">
              <span className="font-semibold text-white">
                {SERVICE_OPTIONS.find((s) => s.value === form.serviceType)?.label}
              </span>
              {" · "}
              {formatDateDisplay(form.preferredDate)}
              {" · "}
              {formatTimeSlot(form.timeSlot)}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Street Address *
              </label>
              <input
                required
                className="input-field"
                value={form.address}
                onChange={set("address")}
                placeholder="123 Ocean Drive"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  City *
                </label>
                <input
                  required
                  className="input-field"
                  value={form.city}
                  onChange={set("city")}
                  placeholder="Miami"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  ZIP Code *
                </label>
                <input
                  required
                  className="input-field"
                  value={form.zipCode}
                  onChange={set("zipCode")}
                  placeholder="33139"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Access Notes
              </label>
              <input
                className="input-field"
                value={form.accessNotes}
                onChange={set("accessNotes")}
                placeholder="Gate code, parking, pet info, etc."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Describe the Issue *
              </label>
              <textarea
                required
                rows={4}
                minLength={10}
                className="input-field resize-none"
                value={form.description}
                onChange={set("description")}
                placeholder="What's going on? When did it start? Any previous repairs?"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-outline flex-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-xs text-slate-500">
        Prefer a free estimate first?{" "}
        <Link href="/quote" className="text-brand-300 hover:text-white">
          Request a quote
        </Link>
        {" · "}
        <Link href="/book/lookup" className="text-brand-300 hover:text-white">
          Look up booking
        </Link>
      </p>
    </form>
  );
}
