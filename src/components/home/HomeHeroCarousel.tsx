"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&h=1080&fit=crop",
    headline: "Move Together.",
    accent: "Grow Together.",
    subtitle:
      "Sydney's Chinese outdoor community — running, hiking, golf, BJJ, yoga and more.",
  },
  {
    src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop",
    headline: "Every Week,",
    accent: "Rain or Shine.",
    subtitle:
      "Discover curated outdoor events that challenge, inspire, and connect.",
  },
  {
    src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop",
    headline: "Find Your",
    accent: "Momentum.",
    subtitle:
      "From beginners to seasoned athletes — there's a place for everyone.",
  },
];

export default function HomeHeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrent(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % SLIDES.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero carousel"
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== current}
        >
          <Image
            src={s.src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/60 to-brand-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h1
          key={current}
          className="animate-fade-in-up text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-7xl"
        >
          {slide.headline}
          <br />
          <span className="text-gold-500">{slide.accent}</span>
        </h1>
        <p
          key={`sub-${current}`}
          className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-white/70 md:text-xl"
          style={{ animationDelay: "0.1s" }}
        >
          {slide.subtitle}
        </p>
        <div
          className="animate-fade-in-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          style={{ animationDelay: "0.2s" }}
        >
          <Link
            href="#upcoming"
            className="btn-premium rounded-full px-8 py-3.5 text-sm"
          >
            View This Week&apos;s Events
          </Link>
          <Link
            href="#contact"
            className="rounded-full border border-gold-500/60 px-8 py-3.5 text-sm font-semibold text-gold-400 transition-all duration-200 hover:bg-gold-500 hover:text-brand-black"
          >
            Join Us
          </Link>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-gold-500"
                : "w-4 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-brand-black/30 p-2.5 text-white/60 backdrop-blur-sm transition-colors hover:border-gold-500/30 hover:text-white md:left-8"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-brand-black/30 p-2.5 text-white/60 backdrop-blur-sm transition-colors hover:border-gold-500/30 hover:text-white md:right-8"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
