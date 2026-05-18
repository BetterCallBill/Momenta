import type { Event, Registration, GalleryImage, Inquiry, Sponsor, TeamMember, Admin } from "@prisma/client";

export type { Event, Registration, GalleryImage, Inquiry, Sponsor, TeamMember, Admin };

export type GalleryItemType = "image" | "video";

export type EventWithCount = Event & {
  _count: { registrations: number };
};

export type SportTypeValue =
  | "RUNNING"
  | "HIKING"
  | "DANCE"
  | "BJJ"
  | "SANDA"
  | "INDOOR_CYCLING"
  | "KAYAK"
  | "BADMINTON"
  | "TENNIS";

export type SportTypeFilter = "ALL" | SportTypeValue;

export type DateRangeFilter = "this-week" | "next-week" | "this-month";

export const SPORT_TYPES: SportTypeValue[] = [
  "RUNNING",
  "HIKING",
  "DANCE",
  "BJJ",
  "SANDA",
  "INDOOR_CYCLING",
  "KAYAK",
  "BADMINTON",
  "TENNIS",
];

export const SPORT_LABELS: Record<string, string> = {
  RUNNING: "Running",
  HIKING: "Hiking",
  DANCE: "Dance",
  BJJ: "BJJ",
  SANDA: "Sanda",
  INDOOR_CYCLING: "Indoor Cycling",
  KAYAK: "Kayak",
  BADMINTON: "Badminton",
  TENNIS: "Tennis",
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
  DANCE: "💃",
  BJJ: "🥋",
  SANDA: "🥊",
  INDOOR_CYCLING: "🚴",
  KAYAK: "🛶",
  BADMINTON: "🏸",
  TENNIS: "🎾",
};

export const SPORT_DOT_COLORS: Record<string, string> = {
  RUNNING: "bg-sky-400",
  HIKING: "bg-emerald-400",
  DANCE: "bg-pink-400",
  BJJ: "bg-red-400",
  SANDA: "bg-orange-400",
  INDOOR_CYCLING: "bg-cyan-400",
  KAYAK: "bg-blue-400",
  BADMINTON: "bg-yellow-400",
  TENNIS: "bg-green-400",
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
