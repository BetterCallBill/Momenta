'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SPORT_ICONS, SPORT_LABELS } from '@/lib/types';
import { formatDateLong, formatTime } from '@/lib/dates';

interface Props {
    coverImageUrl: string | null;
    title: string;
    sportType: string;
    isFeatured: boolean;
    startAt: string;
    endAt: string;
    locationName: string;
}

const BackLink = () => (
    <Link
        href='/events'
        className='inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors'>
        <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
        Back to Events
    </Link>
);

function SportBadge({ sportType, isFeatured }: { sportType: string; isFeatured: boolean }) {
    return (
        <div className='flex items-center gap-2'>
            <span className='text-lg leading-none' aria-hidden='true'>
                {SPORT_ICONS[sportType] ?? '🎯'}
            </span>
            <span className='text-xs font-semibold text-gold-400 uppercase tracking-widest'>
                {SPORT_LABELS[sportType] ?? sportType}
            </span>
            {isFeatured && (
                <span className='text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-medium border border-gold-500/30'>
                    Featured
                </span>
            )}
        </div>
    );
}

export default function EventPosterBanner({
    coverImageUrl,
    title,
    sportType,
    isFeatured,
    startAt,
    endAt,
    locationName,
}: Props) {
    const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

    function handleDetect(e: React.SyntheticEvent<HTMLImageElement>) {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setIsPortrait(naturalHeight > naturalWidth);
    }

    // ── Portrait layout — full height, aspect ratio preserved ────────────────
    if (isPortrait === true) {
        return (
            <div className='relative w-full h-dvh bg-brand-black flex justify-center overflow-hidden'>
                {/* Poster at full viewport height; width scales naturally */}
                <img
                    src={coverImageUrl!}
                    alt={title}
                    className='h-full w-auto'
                />

                {/* Gradient: transparent top → deep black bottom */}
                <div className='absolute inset-0' />
                {/* Subtle top vignette for header legibility */}
                <div className='absolute inset-0 bg-linear-to-b from-brand-black/40 to-transparent' />

                {/* Back link — top left */}
                <div className='absolute top-24 left-6 z-10 md:left-10'>
                    <BackLink />
                </div>

                {/* Overlaid event identity — bottom of banner */}
                <div className='absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 md:px-10 md:pb-10'>
                    <div className='mx-auto max-w-3xl'>
                        <div className='mb-3'>
                            <SportBadge sportType={sportType} isFeatured={isFeatured} />
                        </div>
                        <h1 className='text-3xl font-extrabold text-white leading-tight md:text-5xl'>{title}</h1>
                    </div>
                </div>
            </div>
        );
    }

    // ── Landscape layout (existing behaviour) + hidden orientation probe ───────
    return (
        <div className='relative w-full h-dvh'>
            {coverImageUrl ? (
                <>
                    {/* Invisible probe image — fires onLoad to detect orientation */}
                    {isPortrait === null && (
                        <img
                            src={coverImageUrl}
                            onLoad={handleDetect}
                            alt=''
                            aria-hidden='true'
                            className='pointer-events-none absolute h-px w-px opacity-0'
                        />
                    )}

                    <Image
                        src={coverImageUrl}
                        alt={title}
                        fill
                        className='object-cover object-center'
                        priority
                        sizes='100vw'
                    />
                </>
            ) : (
                <div className='absolute inset-0 bg-neutral-900' />
            )}

            {/* Gradient: transparent top → deep black bottom */}
            <div className='absolute inset-0 bg-linear-to-t from-brand-black via-brand-black/55 to-transparent' />
            {/* Subtle top vignette for header legibility */}
            <div className='absolute inset-0 bg-linear-to-b from-brand-black/40 to-transparent' />

            {/* Back link — top left */}
            <div className='absolute top-24 left-6 z-10 md:left-10'>
                <BackLink />
            </div>

            {/* Overlaid event identity — bottom of banner */}
            <div className='absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 md:px-10 md:pb-10'>
                <div className='mx-auto max-w-3xl'>
                    <div className='mb-3'>
                        <SportBadge sportType={sportType} isFeatured={isFeatured} />
                    </div>

                    <h1 className='text-3xl font-extrabold text-white leading-tight md:text-5xl'>{title}</h1>
                </div>
            </div>
        </div>
    );
}
