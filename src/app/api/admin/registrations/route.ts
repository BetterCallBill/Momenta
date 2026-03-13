import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");

  const where = eventId ? { eventId } : {};

  const registrations = await prisma.registration.findMany({
    where,
    include: { event: { select: { title: true, startAt: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(registrations);
}
