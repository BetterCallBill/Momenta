"use client";

import Image from "next/image";

/**
 * Mock partner data. Replace with DB or CMS fetch later.
 * Each partner needs: name, logoUrl, website.
 */
const PARTNERS = [
  { name: "Nike Running", logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=100&fit=crop", website: "https://nike.com" },
  { name: "Salomon", logoUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=100&fit=crop", website: "https://salomon.com" },
  { name: "Lululemon", logoUrl: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=200&h=100&fit=crop", website: "https://lululemon.com" },
  { name: "The North Face", logoUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=100&fit=crop", website: "https://thenorthface.com" },
  { name: "Patagonia", logoUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=100&fit=crop", website: "https://patagonia.com" },
  { name: "ASICS", logoUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=200&h=100&fit=crop", website: "https://asics.com" },
  { name: "Under Armour", logoUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=100&fit=crop", website: "https://underarmour.com" },
  { name: "New Balance", logoUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200&h=100&fit=crop", website: "https://newbalance.com" },
];

export default function PartnersCarousel() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
          Our Partners
        </p>
        <h2 className="mt-2 text-2xl font-bold dark:text-brand-white text-brand-black md:text-3xl">
          Trusted By Leading Brands
        </h2>
      </div>

      <div className="fade-mask-x mt-10">
        <div className="marquee-track flex w-max items-center gap-12 px-6">
          {doubled.map((partner, i) => (
            <a
              key={`${partner.name}-${i}`}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-[12px] border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900/50 bg-white/50 p-4 transition-all duration-300 hover:border-gold-500/30 hover:shadow-[0_0_20px_rgba(212,160,23,0.08)]"
              aria-label={partner.name}
            >
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                width={120}
                height={48}
                className="h-10 w-auto object-contain grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:brightness-110"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
