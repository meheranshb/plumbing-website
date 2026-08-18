import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import Particles from "@/components/Particles";
import Link from "next/link";
import {
  Phone,
  Clock,
  Calendar,
  Shield,
  Search,
} from "lucide-react";
import { COMPANY } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book a Plumber",
  description:
    "Schedule a plumbing appointment online with 1st Class Plumbing of South Florida. Choose your service, date, and time — 24/7 emergency available.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const serviceMap: Record<string, string> = {
    "emergency-plumbing": "emergency",
    "leak-detection": "leak_detection",
    "drain-cleaning": "drain",
    "water-heater": "water_heater",
    "residential-plumbing": "faucet",
    "commercial-plumbing": "commercial",
    "pipe-repair": "pipe",
    "bathroom-remodel": "remodel",
    "plumbing-inspection": "inspection",
  };
  const defaultService = params.service
    ? serviceMap[params.service] || params.service
    : undefined;

  return (
    <div className="relative overflow-hidden pt-28 pb-20">
      <Particles count={16} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
            Online Scheduling
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            Book Your <span className="text-gradient">Appointment</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Pick a service, date, and time window. We&apos;ll confirm your
            booking and send a tech to your door.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              className="inline-flex items-center gap-2 text-brand-300 hover:text-white"
            >
              <Phone className="h-4 w-4" />
              {COMPANY.phone}
            </a>
            <Link
              href="/book/lookup"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <Search className="h-4 w-4" />
              Look up booking
            </Link>
          </div>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BookingForm defaultService={defaultService} />
          </div>

          <aside className="space-y-4 lg:col-span-2">
            {[
              {
                icon: Calendar,
                title: "Easy Online Booking",
                text: "Choose from available time windows up to 60 days out. Real-time slot availability.",
              },
              {
                icon: Clock,
                title: "Same-Day & Emergency",
                text: "Need help now? Select Emergency (ASAP) and we’ll prioritize your call — 24/7.",
              },
              {
                icon: Shield,
                title: "Licensed Pros",
                text: "Every booking is handled by our family-owned, insured team. Fair pricing, clean work.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl glass p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15">
                  <item.icon className="h-5 w-5 text-brand-300" />
                </div>
                <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.text}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
              <h3 className="font-semibold text-red-300">Flooding or Burst Pipe?</h3>
              <p className="mt-1 text-sm text-slate-400">
                Don&apos;t wait for the form — call our emergency line now.
              </p>
              <a
                href={`tel:${COMPANY.phoneRaw}`}
                className="btn-primary mt-4 w-full bg-gradient-to-r from-red-600 to-red-500 shadow-red-600/30"
              >
                <Phone className="h-4 w-4" />
                Call {COMPANY.phone}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
