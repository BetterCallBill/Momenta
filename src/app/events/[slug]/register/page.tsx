import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "./RegisterForm";
import { prisma } from "@/lib/prisma";
import { formatDateLong, formatTime } from "@/lib/dates";
import { SPORT_LABELS, SPORT_ICONS } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RegisterPage({ params }: PageProps) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: { _count: { select: { registrations: true } } },
  });

  if (!event) notFound();

  const spotsLeft = event.capacity - event._count.registrations;

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-3xl px-6 pt-28 pb-20">
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-gold-500 hover:text-gold-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              {SPORT_ICONS[event.sportType]}
            </span>
            <span className="text-sm font-medium text-gold-500">
              {SPORT_LABELS[event.sportType]}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold md:text-3xl">{event.title}</h1>

          <div className="mt-4 space-y-1 text-sm text-brand-white/60">
            <p>
              {formatDateLong(new Date(event.startAt))} &middot;{" "}
              {formatTime(new Date(event.startAt))} –{" "}
              {formatTime(new Date(event.endAt))}
            </p>
            <p>{event.locationName} — {event.address}</p>
            <p>
              {event.priceCents === 0
                ? "Free"
                : `$${(event.priceCents / 100).toFixed(2)}`}{" "}
              &middot;{" "}
              <span
                className={
                  spotsLeft > 0 ? "text-green-400/70" : "text-red-400/70"
                }
              >
                {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
              </span>
            </p>
          </div>

          <p className="mt-4 text-sm text-brand-white/70 leading-relaxed">
            {event.description}
          </p>

          {spotsLeft > 0 ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Register</h2>
              <RegisterForm eventId={event.id} />
            </div>
          ) : (
            <div className="mt-8 rounded-lg bg-red-500/10 p-4 text-center">
              <p className="font-medium text-red-400">
                This event is full. Check back later or browse other events.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
