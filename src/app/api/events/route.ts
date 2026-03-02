import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getThisWeekRange, getNextWeekRange, getThisMonthRange } from "@/lib/dates";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const sport = params.get("sport");
  const range = params.get("range") || "this-week";
  const q = params.get("q");

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

  return NextResponse.json(events);
}
