'use client';

import Image from 'next/image';

type Sponsor = {
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string | null;
};

export default function PartnersCarousel({ sponsors }: { sponsors: Sponsor[] }) {
    const doubled = [...sponsors, ...sponsors];

    return (
        <section className='py-16 md:py-20 overflow-hidden'>
            <div className='mx-auto max-w-7xl px-6'>
                <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gold-500'>Our Partners</p>
                <h2 className='mt-2 text-2xl font-bold dark:text-brand-white text-brand-black md:text-3xl'>Partners</h2>
            </div>

            <div className='fade-mask-x mt-10'>
                <div className='marquee-track flex w-max items-center gap-8 px-6'>
                    {doubled.map((sponsor, i) => (
                        <Image
                            key={`${sponsor.id}-${i}`}
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            width={180}
                            height={72}
                            className='h-18 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0 hover:brightness-110'
                            unoptimized
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
