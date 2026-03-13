import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { SPORT_ICONS } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  // 0=Sun, adjust to Mon=0
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default async function CalendarPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const now = new Date();
  const year = sp.year ? parseInt(sp.year) : now.getFullYear();
  const month = sp.month ? parseInt(sp.month) : now.getMonth(); // 0-based

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);

  const events = await prisma.event.findMany({
    where: { startAt: { gte: start, lte: end } },
    orderBy: { startAt: "asc" },
    select: { id: true, title: true, slug: true, sportType: true, startAt: true },
  });

  // Group events by day
  const byDay: Record<number, typeof events> = {};
  for (const ev of events) {
    const d = new Date(ev.startAt).getDate();
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(ev);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);

  // prev / next month params
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const monthName = new Date(year, month, 1).toLocaleString("en-AU", { month: "long", year: "numeric" });
  const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-5xl px-6 pt-28 pb-24">
        {/* Title row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">Schedule</p>
            <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">Activity Calendar</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/calendar?year=${prevYear}&month=${prevMonth}`}
              className="rounded-full border border-neutral-700 p-2 text-neutral-400 hover:border-gold-500/50 hover:text-white transition-colors"
              aria-label="Previous month"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-sm font-semibold text-white min-w-[140px] text-center">{monthName}</span>
            <Link
              href={`/calendar?year=${nextYear}&month=${nextMonth}`}
              className="rounded-full border border-neutral-700 p-2 text-neutral-400 hover:border-gold-500/50 hover:text-white transition-colors"
              aria-label="Next month"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="rounded-2xl border border-neutral-800 overflow-hidden">
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 bg-neutral-900 border-b border-neutral-800">
            {DOW.map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="grid grid-cols-7 divide-x divide-neutral-800">
            {/* Leading empty cells */}
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] bg-neutral-950/50 border-b border-neutral-800" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = byDay[day] ?? [];
              const isToday = isCurrentMonth && today.getDate() === day;
              const colPos = (firstDow + i) % 7;
              const isWeekend = colPos === 5 || colPos === 6;

              return (
                <div
                  key={day}
                  className={`min-h-[100px] border-b border-neutral-800 p-2 ${
                    isWeekend ? "bg-neutral-900/30" : "bg-neutral-950"
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold mb-1 ${
                      isToday
                        ? "bg-gold-500 text-brand-black"
                        : "text-neutral-500"
                    }`}
                  >
                    {day}
                  </span>

                  <div className="space-y-1">
                    {dayEvents.map((ev) => (
                      <Link
                        key={ev.id}
                        href={`/events/${ev.slug}`}
                        className="block rounded px-1.5 py-1 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 transition-colors group"
                      >
                        <p className="text-xs text-gold-400 leading-snug truncate group-hover:text-gold-300">
                          {SPORT_ICONS[ev.sportType] ?? "🎯"} {ev.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Trailing empty cells to complete the grid */}
            {(() => {
              const total = firstDow + daysInMonth;
              const remainder = total % 7;
              if (remainder === 0) return null;
              return Array.from({ length: 7 - remainder }).map((_, i) => (
                <div key={`trail-${i}`} className="min-h-[100px] bg-neutral-950/50 border-b border-neutral-800" />
              ));
            })()}
          </div>
        </div>

        {/* Event count */}
        <p className="mt-4 text-center text-sm text-neutral-600">
          {events.length === 0
            ? "No events this month"
            : `${events.length} event${events.length !== 1 ? "s" : ""} in ${monthName}`}
        </p>
      </main>
      <Footer />
    </>
  );
}
