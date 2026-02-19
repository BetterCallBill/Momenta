import Link from "next/link";
import { SPORT_ICONS } from "@/lib/types";
import type { EventWithCount } from "@/lib/types";
import { formatTime, getThisWeekRange } from "@/lib/dates";

interface WeeklyCalendarProps {
  events: EventWithCount[];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyCalendar({ events }: WeeklyCalendarProps) {
  const { start } = getThisWeekRange();

  const days = DAY_LABELS.map((label, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return { label, date };
  });

  const eventsByDay = days.map(({ date }) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    return events.filter((e) => {
      const s = new Date(e.startAt);
      return s >= dayStart && s <= dayEnd;
    });
  });

  return (
    <section id="upcoming" className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          Schedule
        </p>
        <h2 className="mt-2 text-2xl font-bold dark:text-brand-white text-brand-black md:text-3xl">
          This Week
        </h2>
        <p className="mt-1 text-sm dark:text-brand-white/50 text-neutral-500">
          All times in AEST/AEDT (Sydney)
        </p>

        {/* Desktop grid */}
        <div className="mt-8 hidden gap-2 md:grid md:grid-cols-7">
          {days.map(({ label, date }, i) => {
            const dayNum = date.getDate();
            const isToday =
              new Date().toDateString() === date.toDateString();
            return (
              <div key={label} className="flex flex-col">
                <div
                  className={`mb-2 rounded-[8px] p-2 text-center transition-colors ${
                    isToday
                      ? "bg-gold-500 text-brand-black"
                      : "dark:bg-neutral-800 bg-neutral-100 dark:text-brand-white/70 text-neutral-600"
                  }`}
                >
                  <div className="text-xs font-medium uppercase">{label}</div>
                  <div className="text-lg font-bold">{dayNum}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {eventsByDay[i].map((event) => {
                    const spotsLeft =
                      event.capacity - event._count.registrations;
                    return (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}/register`}
                        className="group rounded-[8px] border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900/60 bg-white/60 backdrop-blur-sm p-3 transition-all duration-200 hover:border-gold-500/40 hover:shadow-[0_0_12px_rgba(212,160,23,0.06)]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs" aria-hidden="true">
                            {SPORT_ICONS[event.sportType]}
                          </span>
                          <span className="text-[10px] dark:text-brand-white/50 text-neutral-500">
                            {formatTime(new Date(event.startAt))}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-semibold leading-snug group-hover:text-gold-500 dark:text-brand-white text-brand-black">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-[10px] dark:text-brand-white/40 text-neutral-400">
                          {event.locationName}
                        </p>
                        <p
                          className={`mt-1 text-[10px] font-medium ${
                            spotsLeft > 0
                              ? "text-green-400/70"
                              : "text-red-400/70"
                          }`}
                        >
                          {spotsLeft > 0
                            ? `${spotsLeft} spots`
                            : "Full"}
                        </p>
                      </Link>
                    );
                  })}
                  {eventsByDay[i].length === 0 && (
                    <div className="rounded-[8px] border border-dashed dark:border-neutral-800 border-neutral-200 p-3 text-center text-xs dark:text-brand-white/20 text-neutral-300">
                      No events
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory">
          {days.map(({ label, date }, i) => {
            const dayNum = date.getDate();
            const isToday =
              new Date().toDateString() === date.toDateString();
            return (
              <div
                key={label}
                className="min-w-[260px] flex-shrink-0 snap-start"
              >
                <div
                  className={`mb-2 rounded-[8px] p-2 text-center ${
                    isToday
                      ? "bg-gold-500 text-brand-black"
                      : "dark:bg-neutral-800 bg-neutral-100 dark:text-brand-white/70 text-neutral-600"
                  }`}
                >
                  <span className="text-xs font-medium uppercase">
                    {label}
                  </span>{" "}
                  <span className="font-bold">{dayNum}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {eventsByDay[i].map((event) => {
                    const spotsLeft =
                      event.capacity - event._count.registrations;
                    return (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}/register`}
                        className="rounded-[8px] border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900/60 bg-white/60 backdrop-blur-sm p-3 transition-all duration-200 hover:border-gold-500/40"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs" aria-hidden="true">
                            {SPORT_ICONS[event.sportType]}
                          </span>
                          <span className="text-[10px] dark:text-brand-white/50 text-neutral-500">
                            {formatTime(new Date(event.startAt))}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold dark:text-brand-white text-brand-black">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-xs dark:text-brand-white/40 text-neutral-400">
                          {event.locationName}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={`text-xs ${
                              spotsLeft > 0
                                ? "text-green-400/70"
                                : "text-red-400/70"
                            }`}
                          >
                            {spotsLeft > 0
                              ? `${spotsLeft} spots left`
                              : "Full"}
                          </span>
                          <span className="btn-premium rounded-full px-3 py-1 text-[10px]">
                            Register
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  {eventsByDay[i].length === 0 && (
                    <div className="rounded-[8px] border border-dashed dark:border-neutral-800 border-neutral-200 p-4 text-center text-xs dark:text-brand-white/20 text-neutral-300">
                      No events
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
