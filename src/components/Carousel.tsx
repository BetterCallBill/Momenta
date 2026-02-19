"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SPORT_LABELS } from "@/lib/types";
import type { EventWithCount } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/dates";

interface CarouselProps {
  events: EventWithCount[];
}

export default function Carousel({ events }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  if (events.length === 0) return null;

  const event = events[current];

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-neutral-900"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured events"
      onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current); }}
      onMouseLeave={resetTimer}
    >
      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          className="object-cover transition-opacity duration-700"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <span className="inline-block rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-400">
          {SPORT_LABELS[event.sportType]}
        </span>
        <h3 className="mt-2 text-2xl font-bold md:text-3xl">{event.title}</h3>
        <p className="mt-1 text-sm text-brand-white/60">
          {formatDate(new Date(event.startAt))} &middot;{" "}
          {formatTime(new Date(event.startAt))} &middot; {event.locationName}
        </p>
        <Link
          href={`/events/${event.slug}/register`}
          className="mt-4 inline-block rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400"
        >
          Register
        </Link>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => { prev(); resetTimer(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-brand-black/50 p-2 text-brand-white/70 opacity-0 transition-opacity hover:bg-brand-black/80 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={() => { next(); resetTimer(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-brand-black/50 p-2 text-brand-white/70 opacity-0 transition-opacity hover:bg-brand-black/80 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); resetTimer(); }}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-gold-500" : "w-2 bg-brand-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
