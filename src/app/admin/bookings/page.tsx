import type { Metadata } from "next";
import BookingDashboard from "@/components/BookingDashboard";
import Particles from "@/components/Particles";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Manage Bookings",
  description:
    "Business dashboard to view and manage plumbing service bookings for 1st Class Plumbing.",
  robots: { index: false, follow: false },
};

export default function AdminBookingsPage() {
  return (
    <div className="relative overflow-hidden pt-28 pb-20">
      <Particles count={10} />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
              Business Portal
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Booking <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="mt-2 max-w-xl text-slate-400">
              View incoming appointments, confirm jobs, update status, and add
              tech notes — all in one place.
            </p>
          </div>
          <Link href="/book" className="btn-primary shrink-0">
            <CalendarPlus className="h-4 w-4" />
            New Booking
          </Link>
        </div>

        <div className="mt-10">
          <BookingDashboard />
        </div>
      </div>
    </div>
  );
}
