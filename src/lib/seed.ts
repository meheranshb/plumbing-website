import { db } from "@/db";
import { services, reviews, galleryItems } from "@/db/schema";

export async function seedDatabase() {
  const existing = await db.select().from(services).limit(1);
  if (existing.length > 0) return;

  await db.insert(services).values([
    {
      name: "24/7 Emergency Plumbing",
      slug: "emergency-plumbing",
      description:
        "Burst pipes, major leaks, no hot water, or sewage backups — we respond fast, day or night across South Florida.",
      category: "emergency",
      basePrice: "89.00",
      priceUnit: "service call from",
      icon: "siren",
      featured: true,
    },
    {
      name: "Leak Detection & Repair",
      slug: "leak-detection",
      description:
        "Advanced leak detection for hidden slab, wall, and pool leaks. We find it fast and fix it right the first time.",
      category: "leak_detection",
      basePrice: "149.00",
      priceUnit: "starting at",
      icon: "droplets",
      featured: true,
    },
    {
      name: "Drain Cleaning",
      slug: "drain-cleaning",
      description:
        "Clogged sinks, showers, tubs, and main lines. Professional snaking and hydro-jetting for lasting results.",
      category: "drain",
      basePrice: "129.00",
      priceUnit: "starting at",
      icon: "waves",
      featured: true,
    },
    {
      name: "Water Heater Service",
      slug: "water-heater",
      description:
        "Repair, flush, and full replacement of tank and tankless water heaters by licensed technicians.",
      category: "water_heater",
      basePrice: "179.00",
      priceUnit: "starting at",
      icon: "flame",
      featured: true,
    },
    {
      name: "Residential Plumbing",
      slug: "residential-plumbing",
      description:
        "Toilets, faucets, disposals, showers, and full home plumbing repairs handled with care and honesty.",
      category: "residential",
      basePrice: "99.00",
      priceUnit: "starting at",
      icon: "home",
      featured: true,
    },
    {
      name: "Commercial Plumbing",
      slug: "commercial-plumbing",
      description:
        "Reliable plumbing for restaurants, offices, retail, and multi-unit properties with minimal downtime.",
      category: "commercial",
      basePrice: "199.00",
      priceUnit: "starting at",
      icon: "building",
      featured: false,
    },
    {
      name: "Pipe Repair & Repiping",
      slug: "pipe-repair",
      description:
        "Copper, PEX, and PVC repairs plus whole-home repiping for aging or corroded systems.",
      category: "residential",
      basePrice: "249.00",
      priceUnit: "starting at",
      icon: "pipe",
      featured: false,
    },
    {
      name: "Bathroom Remodel Plumbing",
      slug: "bathroom-remodel",
      description:
        "Rough-in and finish plumbing for bathroom renovations — showers, tubs, vanities, and more.",
      category: "remodel",
      basePrice: "499.00",
      priceUnit: "starting at",
      icon: "bath",
      featured: false,
    },
    {
      name: "Plumbing Inspection",
      slug: "plumbing-inspection",
      description:
        "Thorough home and pre-purchase plumbing inspections with clear reports and fair recommendations.",
      category: "inspection",
      basePrice: "159.00",
      priceUnit: "flat rate",
      icon: "clipboard",
      featured: false,
    },
  ]);

  await db.insert(reviews).values([
    {
      authorName: "A1A Pool Leak Detection And Repair",
      rating: 5,
      content:
        "1st Class Plumbing is everything the name says! From start to finish this small family owned business couldn't be anymore accommodating. Eddie and his staff are great and friendly. The price is fair for the hard work and care they have for their craft.",
      serviceType: "General Plumbing",
      featured: true,
    },
    {
      authorName: "Crystal De La Ossa",
      rating: 5,
      content:
        "Seriously the best experience from start to finish. Eddie, the plumber, was highly professional, educative, thorough AND fast (which is difficult to have at once), and get this—honest. Yes, upon flushing our toilet multiple times and failing, he found a simple fix instead of upselling us.",
      serviceType: "Toilet Repair",
      featured: true,
    },
    {
      authorName: "Marcus Rivera",
      rating: 5,
      content:
        "Called at 11pm for a burst pipe under the kitchen sink. They arrived within the hour, stopped the flooding, and had everything repaired cleanly by morning. True 24/7 service.",
      serviceType: "Emergency",
      featured: true,
    },
    {
      authorName: "Sandra Lopez",
      rating: 5,
      content:
        "Had a stubborn shower valve leak no one else could find. 1st Class diagnosed it quickly, explained every option, and the before/after work looks factory-new. Highly recommend Eddie's team.",
      serviceType: "Leak Detection",
      featured: true,
    },
    {
      authorName: "James Whitfield",
      rating: 5,
      content:
        "Professional, on time, and transparent pricing. They replaced our water heater and cleaned up better than when they arrived. Will use again for any plumbing need.",
      serviceType: "Water Heater",
      featured: true,
    },
    {
      authorName: "Ana Morales",
      rating: 5,
      content:
        "Family-owned and it shows. They treated our home with respect, walked us through the drain issue, and didn't push unnecessary work. Fair price, excellent craftsmanship.",
      serviceType: "Drain Cleaning",
      featured: true,
    },
  ]);

  await db.insert(galleryItems).values([
    {
      title: "Under-Sink Drain Rebuild",
      description:
        "Replaced corroded trap assembly and re-routed disposal lines for a clean, code-compliant install.",
      beforeImage:
        "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      afterImage:
        "https://images.pexels.com/photos/4194862/pexels-photo-4194862.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      category: "Drain",
      featured: true,
    },
    {
      title: "Shower Valve Replacement",
      description:
        "Removed failed mixed valve, installed new pressure-balanced valve with fresh copper stub-outs.",
      beforeImage:
        "https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      afterImage:
        "https://images.pexels.com/photos/6933771/pexels-photo-6933771.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      category: "Bathroom",
      featured: true,
    },
    {
      title: "Corroded Copper Line Repair",
      description:
        "Cut out heavily corroded sections and sweated in new copper with proper supports and clean finish.",
      beforeImage:
        "https://images.pexels.com/photos/34938442/pexels-photo-34938442.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      afterImage:
        "https://images.pexels.com/photos/34938441/pexels-photo-34938441.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      category: "Pipe Repair",
      featured: true,
    },
  ]);
}
