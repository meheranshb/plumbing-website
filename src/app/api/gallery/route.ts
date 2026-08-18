import { NextResponse } from "next/server";
import { db } from "@/db";
import { galleryItems } from "@/db/schema";
import { seedDatabase } from "@/lib/seed";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await seedDatabase();
    const all = await db
      .select()
      .from(galleryItems)
      .orderBy(desc(galleryItems.createdAt));
    return NextResponse.json({ items: all });
  } catch (error) {
    console.error("GET /api/gallery", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}
