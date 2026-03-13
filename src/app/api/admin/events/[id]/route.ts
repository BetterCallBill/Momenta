import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const {
    title, slug, sportType, description,
    startAt, endAt, locationName, address,
    capacity, priceCents, isFeatured, coverImageUrl,
  } = body;

  // If slug changed, check uniqueness
  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      title,
      slug,
      sportType,
      description,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      locationName,
      address,
      capacity: Number(capacity),
      priceCents: Number(priceCents),
      isFeatured: Boolean(isFeatured),
      coverImageUrl,
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.registration.deleteMany({ where: { eventId: id } });
  await prisma.event.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
