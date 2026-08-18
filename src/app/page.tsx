import Link from "next/link";
import { db } from "@/db";
import { services, reviews, galleryItems } from "@/db/schema";
import { seedDatabase } from "@/lib/seed";
import { eq, desc } from "drizzle-orm";
import Hero3D from "@/components/Hero3D";
import ServiceCard from "@/components/ServiceCard";
import ReviewCard from "@/components/ReviewCard";
import BeforeAfter from "@/components/BeforeAfter";
import {
  Phone,
  FileText,
  Shield,
  Clock,
  BadgeCheck,
  HeartHandshake,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { COMPANY } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getHomeData() {
  await seedDatabase();
  const [svc, revs, gallery] = await Promise.all([
    db.select().from(services).where(eq(services.featured, true)).limit(6),
    db
      .select()
      .from(reviews)
      .where(eq(reviews.featured, true))
      .orderBy(desc(reviews.createdAt))
      .limit(6),
    db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.featured, true))
      .limit(3),
  ]);
  return { svc, revs, gallery };
}

export default async function HomePage() {
  const { svc, revs, gallery } = await getHomeData();

  return (
    <>
      <Hero3D />

      {/* Trust bar */}
      <section className="relative border-y border-brand-500/10 bg-navy-950/80">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { icon: Clock, title: "Open 24 Hours", sub: "True emergency response" },
            { icon: Shield, title: "Licensed & Insured", sub: "Peace of mind guaranteed" },
            { icon: BadgeCheck, title: "Honest Pricing", sub: "No upsells, no surprises" },
            { icon: HeartHandshake, title: "Family Owned", sub: "Eddie & team, since day one" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 border border-brand-400/20">
                <item.icon className="h-5 w-5 text-brand-300" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <div className="text-xs text-slate-500">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
              What We Do
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Full-Service Plumbing,{" "}
              <span className="text-gradient">Done Right</span>
            </h2>
            <p className="mt-3 text-slate-400">
              From midnight emergencies to planned upgrades — one trusted team
              for every pipe, drain, and fixture in your home or business.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {svc.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services" className="btn-outline">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-700/40 via-brand-600/20 to-accent-500/20" />
        <div className="absolute inset-0 animate-shimmer" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:text-left lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Need a plumber right now?
            </h2>
            <p className="mt-2 text-slate-300">
              We&apos;re standing by 24 hours a day across South Florida.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={`tel:${COMPANY.phoneRaw}`} className="btn-primary">
              <Phone className="h-5 w-5" />
              {COMPANY.phone}
            </a>
            <Link href="/quote" className="btn-outline">
              <FileText className="h-5 w-5" />
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
                Proof of Craft
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Before &amp; After
              </h2>
              <p className="mt-2 max-w-lg text-slate-400">
                Drag the slider to see the difference. Clean installs, code-ready
                work, zero mess left behind.
              </p>
            </div>
            <Link href="/gallery" className="btn-outline text-sm">
              Full Gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {gallery.map((item, i) => (
              <BeforeAfter key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-brand-500/10 bg-navy-950/50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
              Google Reviews
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              <span className="text-gradient-gold">{COMPANY.rating}★</span> from{" "}
              {COMPANY.reviewCount} Neighbors
            </h2>
            <p className="mt-3 text-slate-400">
              Real customers. Real results. Family-owned service that shows.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {revs.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Book + Quote CTAs */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="card-3d relative overflow-hidden rounded-3xl border border-brand-400/20 bg-gradient-to-br from-brand-600/30 to-navy-950 p-8 sm:p-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-400/20 blur-3xl" />
            <Calendar className="h-10 w-10 text-brand-300" />
            <h3 className="mt-4 text-2xl font-bold text-white">
              Book an Appointment
            </h3>
            <p className="mt-2 text-slate-300">
              Choose your service, pick a date and time window, and we&apos;ll
              confirm your visit.
            </p>
            <Link href="/book" className="btn-primary mt-6">
              Schedule Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="card-3d relative overflow-hidden rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-600/20 to-navy-950 p-8 sm:p-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />
            <FileText className="h-10 w-10 text-sky-300" />
            <h3 className="mt-4 text-2xl font-bold text-white">
              Free Online Quote
            </h3>
            <p className="mt-2 text-slate-300">
              Not ready to book? Tell us about the issue and get a transparent
              estimate first.
            </p>
            <Link href="/quote" className="btn-primary mt-6">
              Start Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
