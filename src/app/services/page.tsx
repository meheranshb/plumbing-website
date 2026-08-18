import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { services } from "@/db/schema";
import { seedDatabase } from "@/lib/seed";
import { eq } from "drizzle-orm";
import ServiceCard from "@/components/ServiceCard";
import Particles from "@/components/Particles";
import { Phone, FileText } from "lucide-react";
import { COMPANY } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Plumbing Services",
  description:
    "Emergency plumbing, leak detection, drain cleaning, water heaters, repiping, and more across South Florida.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  await seedDatabase();
  const all = await db.select().from(services).where(eq(services.active, true));

  return (
    <div className="relative overflow-hidden pt-28 pb-20">
      <Particles count={12} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
            Our Expertise
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            Plumbing <span className="text-gradient">Services</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Residential and commercial plumbing across Miami-Dade, Broward, and
            Palm Beach. Transparent starting prices — final quotes after
            inspection.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-3xl glass p-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">
              Not sure which service you need?
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Describe the issue and we&apos;ll point you in the right direction.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/quote" className="btn-primary">
              <FileText className="h-4 w-4" />
              Get a Quote
            </Link>
            <a href={`tel:${COMPANY.phoneRaw}`} className="btn-outline">
              <Phone className="h-4 w-4" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
