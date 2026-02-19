"use client";

import { useEffect, useRef } from "react";

export default function HomeAbout() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((child) =>
            child.classList.add("visible")
          );
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="about"
      className="py-20 md:py-28"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div>
          <div className="reveal">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              About Us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight dark:text-brand-white text-brand-black md:text-4xl">
              Where <span className="text-gold-500">Movement</span> Meets
              Community
            </h2>

            <div className="my-6 h-px w-16 bg-gradient-to-r from-gold-500 to-transparent" />

            <div className="space-y-4 text-base leading-relaxed dark:text-brand-white/70 text-neutral-600">
              <p>
                Momenta is Sydney&apos;s premier Chinese outdoor and wellness
                community. We bring together people who share a passion for
                movement — from trail running and hiking to golf, BJJ, yoga, and
                beyond.
              </p>
              <p>
                Every week we host curated events designed to challenge, inspire,
                and connect. Whether you&apos;re a first-timer or a seasoned
                athlete, you&apos;ll find your people here.
              </p>
              <p>
                Our mission is simple: build a healthier, more connected
                community — one event at a time.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-8">
              {[
                { num: "500+", label: "Members" },
                { num: "120+", label: "Events Hosted" },
                { num: "8", label: "Sports" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-gold-500">{stat.num}</p>
                  <p className="mt-0.5 text-xs dark:text-brand-white/50 text-neutral-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
