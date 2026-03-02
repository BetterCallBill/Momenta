import type { Event, Registration, GalleryImage, Inquiry } from "@prisma/client";

export type { Event, Registration, GalleryImage, Inquiry };

export type EventWithCount = Event & {
  _count: { registrations: number };
};

export type SportTypeValue =
  | "RUNNING"
  | "HIKING"
  | "GOLF"
  | "BJJ"
  | "YOGA"
  | "OTHER";

export type SportTypeFilter = "ALL" | SportTypeValue;

export type DateRangeFilter = "this-week" | "next-week" | "this-month";

export const SPORT_LABELS: Record<string, string> = {
  RUNNING: "Running",
  HIKING: "Hiking",
  GOLF: "Golf",
  BJJ: "BJJ",
  YOGA: "Yoga",
  OTHER: "Other",
};

export const SPORT_ICONS: Record<string, string> = {
  RUNNING: "🏃",
  HIKING: "🥾",
  GOLF: "⛳",
  BJJ: "🥋",
  YOGA: "🧘",
  OTHER: "🎯",
};

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  permalink: string;
  timestamp: string;
}

/** Parse a JSON string array field (SQLite stores arrays as JSON strings) */
export function parseJsonArray(value: string): string[] {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
