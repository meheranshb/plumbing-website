import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { seedDatabase } from "@/lib/seed";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    await seedDatabase();
    const all = await db
      .select()
      .from(services)
      .where(eq(services.active, true));
    return NextResponse.json({ services: all });
  } catch (error) {
    console.error("GET /api/services", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
