"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import type { GalleryItem } from "@/db/schema";

export default function BeforeAfter({
  item,
  index = 0,
}: {
  item: GalleryItem;
  index?: number;
}) {
  const [pos, setPos] = useState(50);
  const [width, setWidth] = useState(0);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
    ro.observe(el);
    setWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPos((x / rect.width) * 100);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    updatePos(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePos(e.clientX);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  const beforeSrc =
    item.beforeImage ||
    "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
  const afterSrc =
    item.afterImage ||
    "https://images.pexels.com/photos/4194862/pexels-photo-4194862.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="overflow-hidden rounded-2xl glass"
    >
      <div
        ref={containerRef}
        className="ba-slider relative aspect-[16/10] cursor-ew-resize touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* After (full) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={`${item.title} after`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* Before (clipped) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeSrc}
            alt={`${item.title} before`}
            className="absolute inset-y-0 left-0 h-full max-w-none object-cover"
            style={{ width: width ? `${width}px` : "100%" }}
            draggable={false}
          />
        </div>

        {/* Divider */}
        <div
          className="absolute bottom-0 top-0 z-10 w-0.5 bg-white shadow-lg"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-brand-600 shadow-xl">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M8 6L4 12L8 18M16 6L20 12L16 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <span className="absolute left-3 top-3 z-20 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          Before
        </span>
        <span className="absolute right-3 top-3 z-20 rounded-md bg-brand-600/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          After
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white">{item.title}</h3>
        {item.description && (
          <p className="mt-1 text-sm text-slate-400">{item.description}</p>
        )}
        {item.category && (
          <span className="mt-2 inline-block rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-medium text-brand-300">
            {item.category}
          </span>
        )}
      </div>
    </motion.div>
  );
}
