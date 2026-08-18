"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Siren,
  Droplets,
  Waves,
  Flame,
  Home,
  Building2,
  Pipette,
  Bath,
  ClipboardCheck,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/db/schema";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  siren: Siren,
  droplets: Droplets,
  waves: Waves,
  flame: Flame,
  home: Home,
  building: Building2,
  pipe: Pipette,
  bath: Bath,
  clipboard: ClipboardCheck,
  wrench: Wrench,
};

export default function ServiceCard({
  service,
  index = 0,
}: {
  service: Service;
  index?: number;
}) {
  const Icon = iconMap[service.icon] || Wrench;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="perspective-1000"
    >
      <div className="card-3d group relative h-full overflow-hidden rounded-2xl glass p-6">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-500/10 blur-2xl transition group-hover:bg-brand-500/20" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/30 to-accent-500/20 border border-brand-400/20 shadow-inner">
            <Icon className="h-7 w-7 text-brand-300" />
          </div>

          <h3 className="text-lg font-bold text-white">{service.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
            {service.description}
          </p>

          <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/5 pt-4">
            <div>
              {service.basePrice && (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    {service.priceUnit}
                  </div>
                  <div className="text-lg font-bold text-gradient">
                    {formatCurrency(service.basePrice)}
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/book?service=${encodeURIComponent(service.slug)}`}
                className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-3 py-1.5 text-xs font-semibold text-brand-300 transition hover:bg-brand-500/25 hover:text-white"
              >
                Book
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/quote?service=${encodeURIComponent(service.slug)}`}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
