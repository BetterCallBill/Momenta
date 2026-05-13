import type { Event, Registration, GalleryImage, Inquiry, Sponsor, TeamMember, Admin } from "@prisma/client";

export type { Event, Registration, GalleryImage, Inquiry, Sponsor, TeamMember, Admin };

export type GalleryItemType = "image" | "video";

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

export const AGE_RANGE_OPTIONS = [
  "Under 18",
  "18–25",
  "26–35",
  "36–45",
  "46–55",
  "56+",
] as const;

export type AgeRange = (typeof AGE_RANGE_OPTIONS)[number];

export const SPORT_ICONS: Record<string, string> = {
  RUNNING: "🏃",
  HIKING: "🥾",
  GOLF: "⛳",
  BJJ: "🥋",
  YOGA: "🧘",
  OTHER: "🎯",
};

export const SPORT_DOT_COLORS: Record<string, string> = {
  RUNNING: "bg-sky-400",
  HIKING: "bg-emerald-400",
  GOLF: "bg-lime-400",
  BJJ: "bg-red-400",
  YOGA: "bg-violet-400",
  OTHER: "bg-gold-500",
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
