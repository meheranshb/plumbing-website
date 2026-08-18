import type { Metadata } from "next";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { seedDatabase } from "@/lib/seed";
import { desc } from "drizzle-orm";
import BeforeAfter from "@/components/BeforeAfter";
import Particles from "@/components/Particles";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Before & After Gallery",
  description:
    "See real plumbing transformations by 1st Class Plumbing of South Florida — drains, valves, copper lines, and more.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await seedDatabase();
  const items = await db
    .select()
    .from(galleryItems)
    .orderBy(desc(galleryItems.createdAt));

  return (
    <div className="relative overflow-hidden pt-28 pb-20">
      <Particles count={12} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
            Our Work
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            Before &amp; <span className="text-gradient">After</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Drag each slider to compare. Clean craftsmanship is our standard —
            not the exception.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {items.map((item, i) => (
            <BeforeAfter key={item.id} item={item} index={i} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/quote" className="btn-primary">
            <FileText className="h-4 w-4" />
            Get Your Project Quoted
          </Link>
        </div>
      </div>
    </div>
  );
}
