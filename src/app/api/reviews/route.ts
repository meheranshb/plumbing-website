import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { seedDatabase } from "@/lib/seed";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await seedDatabase();
    const all = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    return NextResponse.json({ reviews: all });
  } catch (error) {
    console.error("GET /api/reviews", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
