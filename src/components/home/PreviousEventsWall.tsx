"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Mock previous event images. Replace with DB (GalleryImage) or CMS later.
 * Each item: { src, title }
 */
const EVENTS = [
  { src: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop", title: "Blue Mountains Trail Run" },
  { src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", title: "Coastal Hike Series" },
  { src: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=400&fit=crop", title: "Golf Championship" },
  { src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop", title: "Sunrise Yoga" },
  { src: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=600&h=400&fit=crop", title: "BJJ Fundamentals" },
  { src: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop", title: "Community Social" },
  { src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop", title: "Marathon Prep" },
  { src: "https://images.unsplash.com/photo-1504025468847-0e438279542c?w=600&h=400&fit=crop", title: "Harbour Bridge Run" },
  { src: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&h=400&fit=crop", title: "Bushwalk & Brunch" },
  { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop", title: "HIIT Outdoors" },
  { src: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&h=400&fit=crop", title: "Golf Scramble" },
  { src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop", title: "Twilight Yoga" },
];

export default function PreviousEventsWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const navigate = useCallback(
    (dir: 1 | -1) =>
      setLightbox((prev) =>
        prev !== null
          ? ((prev + dir + EVENTS.length) % EVENTS.length)
          : null
      ),
    []
  );

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, closeLightbox, navigate]);

  return (
    <>
      <section ref={sectionRef} className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
            Our Story
          </p>
          <h2 className="mt-2 text-2xl font-bold dark:text-brand-white text-brand-black md:text-3xl">
            Previous Events
          </h2>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-[12px]">
            {EVENTS.map((event, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className={`group relative aspect-[3/2] overflow-hidden transition-opacity duration-500 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
                aria-label={`View ${event.title}`}
              >
                <Image
                  src={event.src}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-brand-black/0 transition-colors duration-300 group-hover:bg-brand-black/60">
                  <span className="text-sm font-semibold text-gold-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 px-3 text-center">
                    {event.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 rounded-full border border-white/10 bg-neutral-900 p-2.5 text-white/70 transition-colors hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-neutral-900 p-3 text-white/70 transition-colors hover:text-white"
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            className="relative mx-16 max-h-[85vh] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={EVENTS[lightbox].src.replace("600", "1200").replace("400", "800")}
              alt={EVENTS[lightbox].title}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
              sizes="85vw"
            />
            <p className="mt-3 text-center text-sm font-medium text-gold-400">
              {EVENTS[lightbox].title}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-neutral-900 p-3 text-white/70 transition-colors hover:text-white"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/40">
            {lightbox + 1} / {EVENTS.length}
          </div>
        </div>
      )}
    </>
  );
}
