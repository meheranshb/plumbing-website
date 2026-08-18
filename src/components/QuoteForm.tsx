"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Copy,
  ArrowRight,
} from "lucide-react";
import { SERVICE_OPTIONS, cn } from "@/lib/utils";
import Link from "next/link";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  serviceType: string;
  urgency: "normal" | "soon" | "emergency";
  preferredDate: string;
  description: string;
};

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zipCode: "",
  serviceType: "emergency",
  urgency: "normal",
  preferredDate: "",
  description: "",
};

export default function QuoteForm({
  defaultService,
}: {
  defaultService?: string;
}) {
  const [form, setForm] = useState<FormState>({
    ...initial,
    serviceType: defaultService || "emergency",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    referenceCode: string;
    id: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

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
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote");
      }
      setSuccess({
        referenceCode: data.quote.referenceCode,
        id: data.quote.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyCode() {
    if (!success) return;
    navigator.clipboard.writeText(success.referenceCode);
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
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Quote Request Received!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Thanks {form.fullName.split(" ")[0]}! Our team will review your
          request and get back to you shortly — often within the hour during
          business periods.
        </p>

        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-brand-400/30 bg-brand-500/10 p-5">
          <div className="text-xs uppercase tracking-wider text-brand-300">
            Your Reference Code
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="font-mono text-2xl font-bold tracking-widest text-white">
              {success.referenceCode}
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white"
              aria-label="Copy code"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          {copied && (
            <p className="mt-2 text-xs text-emerald-400">Copied!</p>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Save this code for your records. We&apos;ll be in touch soon.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/book" className="btn-primary">
            Book Appointment
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
      {/* Steps */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition",
              step === s
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                : step > s
                  ? "bg-brand-500/30 text-brand-200"
                  : "bg-white/5 text-slate-500"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="mb-2 flex items-center gap-2 text-brand-300">
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
                placeholder="Eddie Rivera"
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
            <button
              type="button"
              onClick={() => {
                if (!form.fullName || !form.email || !form.phone) {
                  setError("Please fill in your contact details");
                  return;
                }
                setError("");
                setStep(2);
              }}
              className="btn-primary mt-4 w-full"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="mb-2 flex items-center gap-2 text-brand-300">
              <MapPin className="h-5 w-5" />
              <h3 className="font-semibold">Service Location</h3>
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
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline flex-1"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!form.address || !form.city || !form.zipCode) {
                    setError("Please complete the address");
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="mb-2 flex items-center gap-2 text-brand-300">
              <Wrench className="h-5 w-5" />
              <h3 className="font-semibold">Job Details</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">
                  Service Type *
                </label>
                <select
                  className="input-field"
                  value={form.serviceType}
                  onChange={set("serviceType")}
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
                  Urgency *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { v: "normal", l: "Normal" },
                      { v: "soon", l: "Soon" },
                      { v: "emergency", l: "Emergency" },
                    ] as const
                  ).map((u) => (
                    <button
                      key={u.v}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, urgency: u.v }))}
                      className={cn(
                        "rounded-xl border px-2 py-2.5 text-xs font-semibold transition",
                        form.urgency === u.v
                          ? u.v === "emergency"
                            ? "border-red-400/50 bg-red-500/20 text-red-300"
                            : "border-brand-400/50 bg-brand-500/20 text-brand-200"
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                      )}
                    >
                      {u.v === "emergency" && (
                        <AlertTriangle className="mx-auto mb-0.5 h-3.5 w-3.5" />
                      )}
                      {u.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  className="input-field pl-10"
                  value={form.preferredDate}
                  onChange={set("preferredDate")}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">
                Describe the Issue *
              </label>
              <textarea
                required
                rows={4}
                className="input-field resize-none"
                value={form.description}
                onChange={set("description")}
                placeholder="Tell us what's going on — leak location, when it started, any noises, etc."
                minLength={10}
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Submit Quote Request
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && step < 3 && (
        <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
    </form>
  );
}
