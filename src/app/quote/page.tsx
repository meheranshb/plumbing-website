import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";
import Particles from "@/components/Particles";
import { Phone, Clock, Shield, BadgeCheck } from "lucide-react";
import { COMPANY } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Request a Free Quote",
  description:
    "Get a free plumbing quote from 1st Class Plumbing of South Florida. Fast response, honest pricing, 24/7 emergency service.",
};

export default async function QuotePage({
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
            Free Estimate
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            Request Your <span className="text-gradient">Quote</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Fill out the form below and we&apos;ll get back to you quickly with
            honest pricing. For emergencies, call us now.
          </p>
          <a
            href={`tel:${COMPANY.phoneRaw}`}
            className="mt-4 inline-flex items-center gap-2 text-brand-300 hover:text-white"
          >
            <Phone className="h-4 w-4" />
            {COMPANY.phone} · Open 24 Hours
          </a>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <QuoteForm defaultService={defaultService} />
          </div>

          <aside className="space-y-4 lg:col-span-2">
            {[
              {
                icon: Clock,
                title: "Fast Response",
                text: "Most quote requests are reviewed within the hour. Emergencies jump the line.",
              },
              {
                icon: BadgeCheck,
                title: "Transparent Pricing",
                text: "Clear estimates before work begins. No hidden fees, no pressure tactics.",
              },
              {
                icon: Shield,
                title: "Licensed Pros",
                text: "Family-owned, insured technicians who treat your home like their own.",
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
              <h3 className="font-semibold text-red-300">Plumbing Emergency?</h3>
              <p className="mt-1 text-sm text-slate-400">
                Burst pipe, flooding, or sewage backup? Don&apos;t wait for a
                quote form — call now.
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
