import Link from "next/link";
import { SPORT_LABELS, SPORT_ICONS } from "@/lib/types";
import type { EventWithCount } from "@/lib/types";
import { formatTime } from "@/lib/dates";

interface UpcomingStripProps {
  events: EventWithCount[];
}

function DateBadge({ date }: { date: Date }) {
  const day = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    day: "numeric",
  }).format(date);
  const weekday = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    weekday: "short",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    month: "short",
  }).format(date);

  return (
    <div className="flex flex-col items-center rounded-lg bg-neutral-800 px-3 py-2 min-w-[56px]">
      <span className="text-[10px] font-medium uppercase text-brand-white/50">
        {weekday}
      </span>
      <span className="text-xl font-bold text-gold-500">{day}</span>
      <span className="text-[10px] font-medium uppercase text-brand-white/50">
        {month}
      </span>
    </div>
  );
}

export default function UpcomingStrip({ events }: UpcomingStripProps) {
  if (events.length === 0) return null;

  return (
    <section id="upcoming" className="bg-neutral-900 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Upcoming Events</h2>
          <Link
            href="/events"
            className="text-sm font-medium text-gold-500 transition-colors hover:text-gold-400"
          >
            View All Events →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 6).map((event) => {
            const spotsLeft = event.capacity - event._count.registrations;
            return (
              <div
                key={event.id}
                className="flex gap-4 rounded-xl border border-neutral-800 bg-brand-black p-4 transition-colors hover:border-gold-500/30"
              >
                <DateBadge date={new Date(event.startAt)} />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm" aria-hidden="true">
                      {SPORT_ICONS[event.sportType]}
                    </span>
                    <span className="text-xs font-medium text-gold-500/80">
                      {SPORT_LABELS[event.sportType]}
                    </span>
                  </div>
                  <h3 className="mt-1 font-semibold leading-snug">{event.title}</h3>
                  <p className="mt-0.5 text-xs text-brand-white/50">
                    {formatTime(new Date(event.startAt))} · {event.locationName}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-xs text-brand-white/40">
                      {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
                    </span>
                    <Link
                      href={`/events/${event.slug}/register`}
                      className="rounded-full bg-gold-500 px-4 py-1.5 text-xs font-semibold text-brand-black transition-colors hover:bg-gold-400"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
