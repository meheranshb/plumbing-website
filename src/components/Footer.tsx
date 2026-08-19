import Link from "next/link";
import {
  Droplets,
  Phone,
  Mail,
  Clock,
  MapPin,
  Star,
} from "lucide-react";
import { COMPANY } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="relative border-t border-brand-500/15 bg-navy-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white">1st Class Plumbing</div>
                <div className="text-xs text-brand-300">Of South Florida Inc</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Family-owned plumbers delivering honest pricing, expert craftsmanship,
              and true 24/7 emergency service across South Florida.
            </p>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 5 ? "star-filled fill-amber-400" : ""}`}
                />
              ))}
              <span className="ml-1 text-sm font-semibold text-white">
                {COMPANY.rating}
              </span>
              <span className="text-sm text-slate-400">
                ({COMPANY.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-300">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/services", label: "Our Services" },
                { href: "/book", label: "Book Appointment" },
                { href: "/quote", label: "Request a Quote" },
                { href: "/gallery", label: "Before & After" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 transition hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-300">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>24/7 Emergency Plumbing</li>
              <li>Leak Detection & Repair</li>
              <li>Drain Cleaning</li>
              <li>Water Heater Service</li>
              <li>Pipe Repair & Repiping</li>
              <li>Commercial Plumbing</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-300">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${COMPANY.phoneRaw}`}
                  className="flex items-center gap-2.5 text-slate-300 transition hover:text-white"
                >
                  <Phone className="h-4 w-4 text-brand-400" />
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-2.5 text-slate-300 transition hover:text-white"
                >
                  <Mail className="h-4 w-4 text-brand-400" />
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Clock className="h-4 w-4 text-brand-400" />
                {COMPANY.hours}
              </li>
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                {COMPANY.serviceArea}
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-slate-400">
                f
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-slate-400">
                ig
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-8 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p>Licensed & Insured · Family Owned · South Florida</p>
        </div>
      </div>
    </footer>
  );
}
