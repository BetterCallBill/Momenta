import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, name, email, phone, notes } = body;

    if (!eventId || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: eventId, name, email, phone" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const spotsLeft = event.capacity - event._count.registrations;
    if (spotsLeft <= 0) {
      return NextResponse.json(
        { error: "This event is full" },
        { status: 409 }
      );
    }

    const registration = await prisma.registration.create({
      data: { eventId, name, email, phone, notes: notes || null },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
