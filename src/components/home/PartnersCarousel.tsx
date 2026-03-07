"use client";

import Image from "next/image";

/**
 * Mock partner data. Replace with DB or CMS fetch later.
 * Each partner needs: name, logoUrl, website.
 */
const PARTNERS = [
  { name: "Leap", logoUrl: "/images/partner/leap.jpg", website: "" },
  { name: "Garage Jiu Jitsu", logoUrl: "/images/partner/garage-bjj.jpg", website: "https://salomon.com" },
  { name: "Unovia", logoUrl: "/images/partner/unovia.jpg", website: "https://garagejiujitsu.com.au/" },
  { name: "Jingjie", logoUrl: "/images/partner/jingjie.PNG", website: "" },
 
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
          Partners
        </h2>
      </div>

      <div className="fade-mask-x mt-10">
        <div className="marquee-track flex w-max items-center gap-8 px-6">
          {doubled.map((partner, i) => (
            <Image
              key={`${partner.name}-${i}`}
              src={partner.logoUrl}
              alt={partner.name}
              width={180}
              height={72}
              className="h-18 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0 hover:brightness-110"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
