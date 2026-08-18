import type { Metadata } from "next";
import BookingLookup from "@/components/BookingLookup";
import Particles from "@/components/Particles";
import Link from "next/link";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Look Up Booking",
  description:
    "Check the status of your plumbing appointment with 1st Class Plumbing using your booking code.",
};

export default async function BookingLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative overflow-hidden pt-28 pb-20">
      <Particles count={12} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
            Appointment Status
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            Look Up Your <span className="text-gradient">Booking</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Enter the booking code from your confirmation to view appointment
            details and status.
          </p>
        </div>

        <div className="mt-10">
          <BookingLookup initialCode={params.code} />
        </div>

        <div className="mt-10 text-center">
          <Link href="/book" className="btn-outline">
            <Calendar className="h-4 w-4" />
            Book a New Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
