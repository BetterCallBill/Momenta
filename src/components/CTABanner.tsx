import Link from "next/link";

interface CTABannerProps {
  heading: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function CTABanner({
  heading,
  subtitle,
  ctaLabel,
  ctaHref,
}: CTABannerProps) {
  return (
    <section className="bg-neutral-900 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg text-brand-white/60">{subtitle}</p>
        )}
        <Link
          href={ctaHref}
          className="mt-8 inline-block rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-gold-400"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
