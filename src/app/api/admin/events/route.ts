import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    include: { _count: { select: { registrations: true } } },
    orderBy: { startAt: "asc" },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title, slug, sportType, description,
    startAt, endAt, locationName, address,
    capacity, priceCents, isFeatured, coverImageUrl,
  } = body;

  if (!title || !slug || !startAt || !endAt) {
    return NextResponse.json({ error: "title, slug, startAt, endAt are required" }, { status: 400 });
  }

  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      slug,
      sportType: sportType || "OTHER",
      description: description || "",
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      locationName: locationName || "",
      address: address || "",
      capacity: Number(capacity) || 20,
      priceCents: Number(priceCents) || 0,
      isFeatured: Boolean(isFeatured),
      coverImageUrl: coverImageUrl || "",
      galleryImages: "[]",
    },
  });

  return NextResponse.json(event, { status: 201 });
}
