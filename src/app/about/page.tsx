import type { Metadata } from "next";
import Link from "next/link";
import Particles from "@/components/Particles";
import {
  Heart,
  Shield,
  Clock,
  Star,
  Users,
  Wrench,
  Phone,
  FileText,
} from "lucide-react";
import { COMPANY } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet 1st Class Plumbing of South Florida — a family-owned team led by Eddie, delivering honest 24/7 plumbing with 4.8★ service.",
};

const values = [
  {
    icon: Heart,
    title: "Family Owned",
    text: "A small team that shows up like neighbors — because we are. Eddie and staff treat every home with respect.",
  },
  {
    icon: Shield,
    title: "Honest Always",
    text: "We educate first, then repair. If a simple fix works, that's what we do. No unnecessary upsells.",
  },
  {
    icon: Clock,
    title: "Truly 24/7",
    text: "Emergencies don't wait for business hours. Neither do we. Real plumbers, real response, day or night.",
  },
  {
    icon: Star,
    title: "Craftsmanship",
    text: "Clean installs, code-compliant work, and job sites left better than we found them.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden pt-28 pb-20">
      <Particles count={14} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
            Our Story
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            Plumbing That Puts{" "}
            <span className="text-gradient">People First</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            {COMPANY.name} is a family-owned plumbing company serving South
            Florida with one simple standard: do the job right, charge fairly,
            and treat every customer like family.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl glass-strong p-8 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20">
              <Users className="h-7 w-7 text-brand-300" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">Meet the Team</h2>
            <p className="mt-3 leading-relaxed text-slate-400">
              Led by Eddie, our crew is known for being accommodating, friendly,
              thorough, and fast — a combination customers say is rare. Whether
              it&apos;s a stubborn toilet, a hidden shower valve leak, or a
              midnight burst pipe, we show up prepared and communicate clearly
              every step of the way.
            </p>
            <p className="mt-3 leading-relaxed text-slate-400">
              Homeowners across Miami-Dade, Broward, and Palm Beach trust us
              because we explain options, respect budgets, and stand behind our
              work.
            </p>
          </div>

          <div className="rounded-3xl glass-strong p-8 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20">
              <Wrench className="h-7 w-7 text-brand-300" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-white">
              Why &ldquo;1st Class&rdquo;?
            </h2>
            <p className="mt-3 leading-relaxed text-slate-400">
              The name isn&apos;t marketing fluff — it&apos;s the expectation we
              set for ourselves. From the first phone call to the final wipe-down,
              every detail matters: punctuality, cleanliness, fair pricing, and
              repairs that last.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-gradient">
                  {COMPANY.rating}★
                </div>
                <div className="text-xs text-slate-500">Google Rating</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-gradient">
                  {COMPANY.reviewCount}+
                </div>
                <div className="text-xs text-slate-500">Reviews</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-gradient">24/7</div>
                <div className="text-xs text-slate-500">Availability</div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-gradient">SFL</div>
                <div className="text-xs text-slate-500">Service Area</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card-3d rounded-2xl glass p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15">
                <v.icon className="h-5 w-5 text-brand-300" />
              </div>
              <h3 className="mt-4 font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {v.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-brand-400/20 bg-gradient-to-r from-brand-600/25 to-accent-500/10 p-8 sm:flex-row sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Ready to experience 1st Class service?
            </h2>
            <p className="mt-1 text-slate-300">
              Request a quote online or call anytime — we&apos;re here 24 hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/quote" className="btn-primary">
              <FileText className="h-4 w-4" />
              Free Quote
            </Link>
            <a href={`tel:${COMPANY.phoneRaw}`} className="btn-outline">
              <Phone className="h-4 w-4" />
              {COMPANY.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
