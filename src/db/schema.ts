import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  numeric,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const quoteStatusEnum = pgEnum("quote_status", [
  "pending",
  "reviewed",
  "quoted",
  "accepted",
  "declined",
  "completed",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);

export const serviceCategoryEnum = pgEnum("service_category", [
  "emergency",
  "residential",
  "commercial",
  "water_heater",
  "drain",
  "leak_detection",
  "remodel",
  "inspection",
]);

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description").notNull(),
  category: serviceCategoryEnum("category").notNull(),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }),
  priceUnit: varchar("price_unit", { length: 50 }).default("starting at"),
  icon: varchar("icon", { length: 50 }).notNull().default("wrench"),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  referenceCode: varchar("reference_code", { length: 20 }).notNull().unique(),
  fullName: varchar("full_name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  urgency: varchar("urgency", { length: 50 }).notNull().default("normal"),
  preferredDate: varchar("preferred_date", { length: 50 }),
  description: text("description").notNull(),
  status: quoteStatusEnum("status").notNull().default("pending"),
  estimatedAmount: numeric("estimated_amount", { precision: 10, scale: 2 }),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingCode: varchar("booking_code", { length: 20 }).notNull().unique(),
  fullName: varchar("full_name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  serviceName: varchar("service_name", { length: 200 }),
  preferredDate: varchar("preferred_date", { length: 50 }).notNull(),
  timeSlot: varchar("time_slot", { length: 50 }).notNull(),
  propertyType: varchar("property_type", { length: 50 }).default("residential"),
  accessNotes: text("access_notes"),
  description: text("description").notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  quoteId: integer("quote_id").references(() => quotes.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorName: varchar("author_name", { length: 150 }).notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  serviceType: varchar("service_type", { length: 100 }),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  beforeImage: text("before_image"),
  afterImage: text("after_image"),
  category: varchar("category", { length: 100 }),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type NewBooking = typeof bookings.$inferInsert;
