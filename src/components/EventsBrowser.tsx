"use client";

import Link from "next/link";
import { useState } from "react";
import { SPORT_ICONS, SPORT_DOT_COLORS, SPORT_LABELS } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/dates";
import type { EventWithCount } from "@/lib/types";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

// Returns "YYYY-MM-DD" in Sydney local time
function toSydneyDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

function toDayKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const DOW = ["M", "T", "W", "T", "F", "S", "S"];

interface Props {
  events: EventWithCount[];
}

export default function EventsBrowser({ events }: Props) {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Group all upcoming events by Sydney date key
  const byDay: Record<string, EventWithCount[]> = {};
  for (const ev of events) {
    const key = toSydneyDateKey(new Date(ev.startAt as unknown as string));
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(ev);
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDow = getFirstDayOfWeek(calYear, calMonth);

  const prevMonth = calMonth === 0 ? 11 : calMonth - 1;
  const prevYear = calMonth === 0 ? calYear - 1 : calYear;
  const nextMonth = calMonth === 11 ? 0 : calMonth + 1;
  const nextYear = calMonth === 11 ? calYear + 1 : calYear;

  const monthName = new Date(calYear, calMonth, 1).toLocaleString("en-AU", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth = now.getFullYear() === calYear && now.getMonth() === calMonth;
  const selectedEvents = selectedKey !== null ? (byDay[selectedKey] ?? []) : null;

  const selectedDateLabel =
    selectedKey !== null
      ? new Intl.DateTimeFormat("en-AU", {
          timeZone: "Australia/Sydney",
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(new Date(`${selectedKey}T12:00:00`))
      : null;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Events</h1>
        <p className="mt-2 text-neutral-400">Find your next adventure.</p>
      </div>

      {events.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-neutral-500">No upcoming events. Check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr] items-start">
          {/* ── LEFT: Calendar ── */}
          <div className="rounded-2xl border border-neutral-800 overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
              <button
                onClick={() => {
                  setCalYear(prevYear);
                  setCalMonth(prevMonth);
                  setSelectedKey(null);
                }}
                aria-label="Previous month"
                className="rounded-full p-1.5 text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-white">{monthName}</span>
              <button
                onClick={() => {
                  setCalYear(nextYear);
                  setCalMonth(nextMonth);
                  setSelectedKey(null);
                }}
                aria-label="Next month"
                className="rounded-full p-1.5 text-neutral-400 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-900/40">
              {DOW.map((d, i) => (
                <div
                  key={i}
                  className="py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-neutral-500"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 divide-x divide-neutral-800/50">
              {Array.from({ length: firstDow }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="h-10 border-b border-neutral-800/50 bg-neutral-950/50"
                />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const key = toDayKey(calYear, calMonth, day);
                const dayEvents = byDay[key] ?? [];
                const hasEvents = dayEvents.length > 0;
                const isToday = isCurrentMonth && now.getDate() === day;
                const isSelected = selectedKey === key;
                const colPos = (firstDow + i) % 7;
                const isWeekend = colPos === 5 || colPos === 6;

                return (
                  <button
                    key={day}
                    disabled={!hasEvents}
                    onClick={() => setSelectedKey(isSelected ? null : key)}
                    className={[
                      "h-10 border-b border-neutral-800/50 flex flex-col items-center justify-center gap-0.5 transition-colors",
                      isSelected
                        ? "bg-gold-500/10"
                        : isWeekend
                        ? "bg-neutral-900/30"
                        : "bg-neutral-950",
                      hasEvents ? "cursor-pointer hover:bg-neutral-800/60" : "cursor-default",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold leading-none",
                        isToday
                          ? "bg-gold-500 text-brand-black"
                          : isSelected
                          ? "text-gold-400"
                          : hasEvents
                          ? "text-white"
                          : "text-neutral-600",
                      ].join(" ")}
                    >
                      {day}
                    </span>
                    {hasEvents && (
                      <div className="flex gap-0.5">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <span
                            key={ev.id}
                            className={`h-1 w-1 rounded-full ${SPORT_DOT_COLORS[ev.sportType] ?? "bg-gold-500"}`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}

              {(() => {
                const total = firstDow + daysInMonth;
                const remainder = total % 7;
                if (remainder === 0) return null;
                return Array.from({ length: 7 - remainder }).map((_, i) => (
                  <div
                    key={`trail-${i}`}
                    className="h-10 border-b border-neutral-800/50 bg-neutral-950/50"
                  />
                ));
              })()}
            </div>
          </div>

          {/* ── RIGHT: Detail panel ── */}
          <div>
            {selectedKey !== null ? (
              <>
                <div className="mb-4 flex items-center gap-3">
                  <p className="flex-1 text-sm font-semibold text-white">{selectedDateLabel}</p>
                  <button
                    onClick={() => setSelectedKey(null)}
                    className="text-xs text-neutral-500 hover:text-white transition-colors"
                  >
                    ← All events
                  </button>
                </div>

                {selectedEvents && selectedEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedEvents.map((ev) => (
                      <EventDetailCard key={ev.id} event={ev} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-800">
                    <p className="text-sm text-neutral-500">No events on this day</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="mb-4 text-sm font-semibold text-white">Upcoming Events</p>
                <div className="space-y-4">
                  {events.map((ev) => (
                    <EventDetailCard key={ev.id} event={ev} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EventDetailCard({ event }: { event: EventWithCount }) {
  const spotsLeft = event.capacity - event._count.registrations;
  const isFull = spotsLeft <= 0;

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-neutral-700">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span aria-hidden="true">{SPORT_ICONS[event.sportType] ?? "🎯"}</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-500">
              {SPORT_LABELS[event.sportType] ?? event.sportType}
            </span>
            {event.isFeatured && (
              <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[10px] font-medium text-gold-400">
                Featured
              </span>
            )}
          </div>

          <h3 className="text-base font-bold leading-snug text-white">
            <Link
              href={`/events/${event.slug}`}
              className="hover:text-gold-400 transition-colors"
            >
              {event.title}
            </Link>
          </h3>

          <div className="mt-2 space-y-1 text-sm text-neutral-400">
            <p>
              {formatDate(new Date(event.startAt as unknown as string))} &middot;{" "}
              {formatTime(new Date(event.startAt as unknown as string))} –{" "}
              {formatTime(new Date(event.endAt as unknown as string))}
            </p>
            <p>{event.locationName}</p>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className={isFull ? "text-red-400" : "text-emerald-400"}>
              {isFull ? "Full" : `${spotsLeft} spots left`}
            </span>
            <span className="text-neutral-500">
              {event.priceCents === 0
                ? "Free"
                : `$${(event.priceCents / 100).toFixed(2)}`}
            </span>
          </div>
        </div>

        <Link
          href={isFull ? "#" : `/events/${event.slug}/register`}
          aria-disabled={isFull}
          className={[
            "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            isFull
              ? "cursor-not-allowed bg-neutral-700 text-neutral-400"
              : "bg-gold-500 text-brand-black hover:bg-gold-400",
          ].join(" ")}
        >
          {isFull ? "Full" : "Register"}
        </Link>
      </div>
    </article>
  );
}
