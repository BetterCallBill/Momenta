import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import FilterBar from "@/components/FilterBar";
import { prisma } from "@/lib/prisma";
import { getThisWeekRange, getNextWeekRange, getThisMonthRange } from "@/lib/dates";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sport = params.sport;
  const range = params.range || "this-week";
  const q = params.q;

  let dateRange: { start: Date; end: Date };
  switch (range) {
    case "next-week":
      dateRange = getNextWeekRange();
      break;
    case "this-month":
      dateRange = getThisMonthRange();
      break;
    default:
      dateRange = getThisWeekRange();
  }

  const where: Record<string, unknown> = {
    startAt: { gte: dateRange.start, lte: dateRange.end },
  };

  if (sport && sport !== "ALL") {
    where.sportType = sport;
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { locationName: { contains: q } },
    ];
  }

  const events = await prisma.event.findMany({
    where,
    include: { _count: { select: { registrations: true } } },
    orderBy: { startAt: "asc" },
  });

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        <h1 className="text-3xl font-bold md:text-4xl">Events</h1>
        <p className="mt-2 text-brand-white/60">
          Find your next adventure. Filter by sport, date, or keyword.
        </p>

        <div className="mt-8">
          <Suspense>
            <FilterBar />
          </Suspense>
        </div>

        {events.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg text-brand-white/40">
              No events found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
