"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop",
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background images */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-black/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-7xl">
          Move Together.{" "}
          <span className="text-gold-500">Grow Together.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-brand-white/70 md:text-xl">
          Sydney&apos;s Chinese outdoor community — running, hiking, golf, BJJ,
          yoga and more. Every week, rain or shine.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="#upcoming"
            className="rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400"
          >
            View This Week&apos;s Events
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-gold-500 px-8 py-3.5 text-sm font-semibold text-gold-500 transition-colors hover:bg-gold-500 hover:text-brand-black"
          >
            Join Us
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-brand-white/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
