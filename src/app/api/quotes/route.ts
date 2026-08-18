import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quotes } from "@/db/schema";
import { generateCode } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const quoteSchema = z.object({
  fullName: z.string().min(2).max(150),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(30),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  zipCode: z.string().min(5).max(20),
  serviceType: z.string().min(2).max(100),
  urgency: z.enum(["normal", "soon", "emergency"]).default("normal"),
  preferredDate: z.string().optional(),
  description: z.string().min(10).max(2000),
});

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    if (code) {
      const [quote] = await db
        .select()
        .from(quotes)
        .where(eq(quotes.referenceCode, code.toUpperCase()))
        .limit(1);
      if (!quote) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404 });
      }
      return NextResponse.json({ quote });
    }

    const all = await db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt))
      .limit(50);
    return NextResponse.json({ quotes: all });
  } catch (error) {
    console.error("GET /api/quotes", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid quote data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const referenceCode = generateCode("QT");

    const [quote] = await db
      .insert(quotes)
      .values({
        referenceCode,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        serviceType: data.serviceType,
        urgency: data.urgency,
        preferredDate: data.preferredDate || null,
        description: data.description,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ quote, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/quotes", error);
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}
