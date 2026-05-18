"use client";

import { useState } from "react";
import type { GalleryImage } from "@/lib/types";
import { SPORT_LABELS, SPORT_ICONS } from "@/lib/types";
import { useLanguage } from "@/components/LanguageContext";
import GalleryGrid from "./GalleryGrid";

export type GalleryGroup = {
  sportType: string | null;
  images: GalleryImage[];
};

interface GalleryAccordionProps {
  groups: GalleryGroup[];
}

export default function GalleryAccordion({ groups }: GalleryAccordionProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<Record<number, boolean>>(
    Object.fromEntries(groups.map((_, i) => [i, true]))
  );

  function toggle(i: number) {
    setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div className="space-y-6">
      {groups.map((group, i) => {
        const isOpen = open[i] ?? true;
        const icon = group.sportType ? (SPORT_ICONS[group.sportType] ?? "") : "";
        const label = group.sportType
          ? (SPORT_LABELS[group.sportType] ?? group.sportType)
          : t.gallery.other_group;
        const count = group.images.length;

        return (
          <div key={i} className="border border-neutral-800 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-6 py-4 bg-neutral-900 hover:bg-neutral-800/80 transition-colors text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
                <h2 className="text-lg font-semibold text-brand-white">{label}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-medium">
                  {t.gallery.photo_count(count)}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="p-4 bg-neutral-950/40">
                <GalleryGrid images={group.images} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
