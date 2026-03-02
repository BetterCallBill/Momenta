"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SPORT_LABELS } from "@/lib/types";

const DATE_OPTIONS = [
  { value: "this-week", label: "This Week" },
  { value: "next-week", label: "Next Week" },
  { value: "this-month", label: "This Month" },
];

export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const sp = new URLSearchParams(params.toString());
      if (value && value !== "ALL") {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
      router.push(`/events?${sp.toString()}`);
    },
    [params, router]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Sport type */}
      <select
        value={params.get("sport") || "ALL"}
        onChange={(e) => updateParam("sport", e.target.value)}
        className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-brand-white focus:border-gold-500 focus:outline-none"
        aria-label="Filter by sport"
      >
        <option value="ALL">All Sports</option>
        {Object.entries(SPORT_LABELS).map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>

      {/* Date range */}
      <select
        value={params.get("range") || "this-week"}
        onChange={(e) => updateParam("range", e.target.value)}
        className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-brand-white focus:border-gold-500 focus:outline-none"
        aria-label="Filter by date range"
      >
        {DATE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Search */}
      <input
        type="search"
        placeholder="Search events..."
        defaultValue={params.get("q") || ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateParam("q", (e.target as HTMLInputElement).value);
          }
        }}
        className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
        aria-label="Search events by keyword"
      />
    </div>
  );
}
