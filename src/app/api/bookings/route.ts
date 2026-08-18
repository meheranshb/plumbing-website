import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { generateCode, SERVICE_OPTIONS, TIME_SLOTS } from "@/lib/utils";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";

const bookingSchema = z.object({
  fullName: z.string().min(2).max(150),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(30),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  zipCode: z.string().min(5).max(20),
  serviceType: z.string().min(2).max(100),
  preferredDate: z.string().min(8).max(50),
  timeSlot: z.string().min(2).max(50),
  propertyType: z.enum(["residential", "commercial", "multi_family"]).default("residential"),
  accessNotes: z.string().max(1000).optional(),
  description: z.string().min(10).max(2000),
  quoteCode: z.string().optional(),
});

const validSlots = TIME_SLOTS.map((t) => t.value);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code");
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const availability = searchParams.get("availability");

    // Availability check for a specific date
    if (availability === "1" && date) {
      const dayBookings = await db
        .select({
          timeSlot: bookings.timeSlot,
          status: bookings.status,
        })
        .from(bookings)
        .where(
          and(
            eq(bookings.preferredDate, date),
            ne(bookings.status, "cancelled")
          )
        );

      const counts: Record<string, number> = {};
      for (const b of dayBookings) {
        counts[b.timeSlot] = (counts[b.timeSlot] || 0) + 1;
      }

      // Max 3 bookings per slot (except emergency)
      const slots = TIME_SLOTS.map((slot) => ({
        ...slot,
        booked: counts[slot.value] || 0,
        available: slot.value === "emergency" ? true : (counts[slot.value] || 0) < 3,
      }));

      return NextResponse.json({ date, slots });
    }

    if (code) {
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.bookingCode, code.toUpperCase()))
        .limit(1);
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      return NextResponse.json({ booking });
    }

    let rows;
    if (status && status !== "all") {
      rows = await db
        .select()
        .from(bookings)
        .where(eq(bookings.status, status as typeof bookings.status.enumValues[number]))
        .orderBy(desc(bookings.preferredDate), desc(bookings.createdAt))
        .limit(100);
    } else {
      rows = await db
        .select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt))
        .limit(100);
    }

    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${bookings.status} = 'pending')::int`,
        confirmed: sql<number>`count(*) filter (where ${bookings.status} = 'confirmed')::int`,
        inProgress: sql<number>`count(*) filter (where ${bookings.status} = 'in_progress')::int`,
        completed: sql<number>`count(*) filter (where ${bookings.status} = 'completed')::int`,
        cancelled: sql<number>`count(*) filter (where ${bookings.status} = 'cancelled')::int`,
      })
      .from(bookings);

    return NextResponse.json({ bookings: rows, stats });
  } catch (error) {
    console.error("GET /api/bookings", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (!validSlots.includes(data.timeSlot as (typeof validSlots)[number])) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const preferred = new Date(data.preferredDate + "T12:00:00");
    if (isNaN(preferred.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    if (preferred < today && data.timeSlot !== "emergency") {
      return NextResponse.json(
        { error: "Please choose today or a future date" },
        { status: 400 }
      );
    }

    // Capacity check
    if (data.timeSlot !== "emergency") {
      const existing = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.preferredDate, data.preferredDate),
            eq(bookings.timeSlot, data.timeSlot),
            ne(bookings.status, "cancelled")
          )
        );
      if (existing.length >= 3) {
        return NextResponse.json(
          { error: "This time slot is fully booked. Please choose another." },
          { status: 409 }
        );
      }
    }

    const serviceName =
      SERVICE_OPTIONS.find((s) => s.value === data.serviceType)?.label ||
      data.serviceType;

    const bookingCode = generateCode("BK");
    const autoConfirm = data.timeSlot === "emergency" ? "confirmed" : "pending";

    const [booking] = await db
      .insert(bookings)
      .values({
        bookingCode,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        serviceType: data.serviceType,
        serviceName,
        preferredDate: data.preferredDate,
        timeSlot: data.timeSlot,
        propertyType: data.propertyType,
        accessNotes: data.accessNotes || null,
        description: data.description,
        status: autoConfirm,
      })
      .returning();

    return NextResponse.json({ booking, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingCode, status, adminNotes } = body as {
      bookingCode?: string;
      status?: string;
      adminNotes?: string;
    };

    if (!bookingCode) {
      return NextResponse.json({ error: "bookingCode is required" }, { status: 400 });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "no_show",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updates: Partial<typeof bookings.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (status) {
      updates.status = status as typeof bookings.status.enumValues[number];
    }
    if (adminNotes !== undefined) {
      updates.adminNotes = adminNotes;
    }

    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.bookingCode, bookingCode.toUpperCase()))
      .returning();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking, success: true });
  } catch (error) {
    console.error("PATCH /api/bookings", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
