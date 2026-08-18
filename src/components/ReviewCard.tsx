"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { Review } from "@/db/schema";

export default function ReviewCard({
  review,
  index = 0,
}: {
  review: Review;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card-3d relative h-full rounded-2xl glass p-6"
    >
      <Quote className="absolute right-4 top-4 h-8 w-8 text-brand-500/20" />
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-600"
            }`}
          />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-slate-300 line-clamp-5">
        &ldquo;{review.content}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
          {review.authorName.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{review.authorName}</div>
          {review.serviceType && (
            <div className="text-xs text-slate-500">{review.serviceType}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
