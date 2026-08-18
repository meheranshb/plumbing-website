export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: string | number) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
}

export function generateCode(prefix: string, length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export const COMPANY = {
  name: "1st Class Plumbing Of South Florida Inc",
  shortName: "1st Class Plumbing",
  phone: "+1 786-663-4270",
  phoneRaw: "17866634270",
  email: "info@1stclassplumbingsfl.com",
  rating: 4.8,
  reviewCount: 136,
  hours: "Open 24 Hours",
  tagline: "South Florida's Trusted Family-Owned Plumbers",
  address: "South Florida",
  serviceArea: "Miami-Dade, Broward & Palm Beach Counties",
};

export const SERVICE_OPTIONS = [
  { value: "emergency", label: "Emergency Plumbing" },
  { value: "leak_detection", label: "Leak Detection & Repair" },
  { value: "drain", label: "Drain Cleaning" },
  { value: "water_heater", label: "Water Heater Service" },
  { value: "toilet", label: "Toilet Repair / Install" },
  { value: "faucet", label: "Faucet & Fixture" },
  { value: "pipe", label: "Pipe Repair / Repiping" },
  { value: "sewer", label: "Sewer Line Service" },
  { value: "garbage_disposal", label: "Garbage Disposal" },
  { value: "remodel", label: "Bathroom Remodel Plumbing" },
  { value: "inspection", label: "Plumbing Inspection" },
  { value: "commercial", label: "Commercial Plumbing" },
  { value: "other", label: "Other" },
];

export const TIME_SLOTS = [
  { value: "08:00-10:00", label: "8:00 AM – 10:00 AM" },
  { value: "10:00-12:00", label: "10:00 AM – 12:00 PM" },
  { value: "12:00-14:00", label: "12:00 PM – 2:00 PM" },
  { value: "14:00-16:00", label: "2:00 PM – 4:00 PM" },
  { value: "16:00-18:00", label: "4:00 PM – 6:00 PM" },
  { value: "18:00-20:00", label: "6:00 PM – 8:00 PM" },
  { value: "emergency", label: "Emergency (ASAP)" },
] as const;

export const BOOKING_STATUSES = [
  { value: "pending", label: "Pending", color: "amber" },
  { value: "confirmed", label: "Confirmed", color: "sky" },
  { value: "in_progress", label: "In Progress", color: "violet" },
  { value: "completed", label: "Completed", color: "emerald" },
  { value: "cancelled", label: "Cancelled", color: "slate" },
  { value: "no_show", label: "No Show", color: "red" },
] as const;

export function formatDateDisplay(dateStr: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatTimeSlot(slot: string) {
  const found = TIME_SLOTS.find((t) => t.value === slot);
  return found?.label || slot;
}

export function getMinBookingDate() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function getMaxBookingDate() {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split("T")[0];
}
