import Image from "next/image";
import Link from "next/link";
import { SPORT_LABELS, SPORT_ICONS } from "@/lib/types";
import type { EventWithCount } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/dates";

interface EventCardProps {
  event: EventWithCount;
}

export default function EventCard({ event }: EventCardProps) {
  const spotsLeft = event.capacity - event._count.registrations;

  return (
    <article className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-colors hover:border-gold-500/30">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 rounded-full bg-brand-black/70 px-3 py-1 text-xs font-semibold text-gold-400 backdrop-blur-sm">
          {SPORT_ICONS[event.sportType]} {SPORT_LABELS[event.sportType]}
        </div>
        {event.isFeatured && (
          <div className="absolute top-3 right-3 rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-bold text-brand-black">
            FEATURED
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold leading-snug group-hover:text-gold-400 transition-colors">
          {event.title}
        </h3>
        <div className="mt-2 space-y-1 text-sm text-brand-white/50">
          <p>{formatDate(new Date(event.startAt))} · {formatTime(new Date(event.startAt))} – {formatTime(new Date(event.endAt))}</p>
          <p>{event.locationName}</p>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-brand-white/60">
          {event.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-brand-white/40">
              {event.priceCents === 0
                ? "Free"
                : `$${(event.priceCents / 100).toFixed(2)}`}
            </span>
            <span
              className={`text-xs font-medium ${
                spotsLeft > 0 ? "text-green-400/70" : "text-red-400/70"
              }`}
            >
              {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}/register`}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              spotsLeft > 0
                ? "bg-gold-500 text-brand-black hover:bg-gold-400"
                : "cursor-not-allowed bg-neutral-700 text-brand-white/40"
            }`}
            aria-disabled={spotsLeft <= 0}
          >
            {spotsLeft > 0 ? "Register" : "Full"}
          </Link>
        </div>
      </div>
    </article>
  );
}
