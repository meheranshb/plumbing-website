import type { Metadata } from "next";
import Link from "next/link";
import Particles from "@/components/Particles";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  FileText,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { COMPANY } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact 1st Class Plumbing of South Florida — open 24 hours. Call +1 786-663-4270 or request a quote online.",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden pt-28 pb-20">
      <Particles count={12} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
            Get In Touch
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            Contact <span className="text-gradient">1st Class</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Open 24 hours for emergencies and service requests across South
            Florida.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <a
            href={`tel:${COMPANY.phoneRaw}`}
            className="card-3d group rounded-3xl glass-strong p-8 transition hover:border-brand-400/40"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 transition group-hover:scale-110">
              <Phone className="h-7 w-7 text-brand-300" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-white">Call Us</h2>
            <p className="mt-2 text-2xl font-bold text-gradient">
              {COMPANY.phone}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Best for emergencies and same-day service
            </p>
          </a>

          <a
            href={`mailto:${COMPANY.email}`}
            className="card-3d group rounded-3xl glass-strong p-8 transition hover:border-brand-400/40"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 transition group-hover:scale-110">
              <Mail className="h-7 w-7 text-brand-300" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-white">Email</h2>
            <p className="mt-2 break-all text-lg font-semibold text-brand-300">
              {COMPANY.email}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              For general questions and non-urgent requests
            </p>
          </a>

          <div className="card-3d rounded-3xl glass-strong p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20">
              <Clock className="h-7 w-7 text-brand-300" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-white">Hours</h2>
            <p className="mt-2 text-2xl font-bold text-gradient">
              {COMPANY.hours}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Including nights, weekends & holidays
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl glass p-8">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-brand-400" />
              <h2 className="text-xl font-bold text-white">Service Area</h2>
            </div>
            <p className="mt-3 text-slate-300">{COMPANY.serviceArea}</p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-400">
              {[
                "Miami",
                "Miami Beach",
                "Coral Gables",
                "Hialeah",
                "Fort Lauderdale",
                "Hollywood",
                "Pembroke Pines",
                "Boca Raton",
                "Aventura",
                "Homestead",
                "Doral",
                "Weston",
              ].map((city) => (
                <li key={city} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                  {city}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              And surrounding South Florida communities
            </p>
          </div>

          <div className="rounded-3xl glass p-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-brand-400" />
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="mt-6 space-y-3">
              <Link
                href="/book"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-400/40 hover:bg-brand-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20">
                  <Calendar className="h-5 w-5 text-brand-300" />
                </div>
                <div>
                  <div className="font-semibold text-white">Book Appointment</div>
                  <div className="text-sm text-slate-400">
                    Schedule a service visit online
                  </div>
                </div>
              </Link>
              <Link
                href="/quote"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-400/40 hover:bg-brand-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20">
                  <FileText className="h-5 w-5 text-brand-300" />
                </div>
                <div>
                  <div className="font-semibold text-white">Request a Quote</div>
                  <div className="text-sm text-slate-400">
                    Free estimate for any plumbing job
                  </div>
                </div>
              </Link>
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                className="flex items-center gap-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 transition hover:border-red-400/40"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                  <Phone className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <div className="font-semibold text-white">Emergency Line</div>
                  <div className="text-sm text-slate-400">
                    {COMPANY.phone} — 24/7
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
