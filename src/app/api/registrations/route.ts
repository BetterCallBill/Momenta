import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/email";
import { formatDateLong, formatTime } from "@/lib/dates";

export async function POST(request: NextRequest) {
  // ── 1. Parse body ─────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    eventId,
    name,
    email,
    phone,
    ageRange,
    gender,
    interestedEventTypes,
    wechatName,
    wechatOpenId,
    notes,
  } = body as Record<string, unknown>;

  // ── 2. Validate required fields ───────────────────────────────────────────
  if (!eventId || !name || !email || !phone || !gender || !ageRange) {
    return NextResponse.json(
      { error: "Missing required fields: eventId, name, email, phone, gender, ageRange" },
      { status: 400 }
    );
  }

  const trimmedEmail = (email as string).trim().toLowerCase();
  const trimmedName = (name as string).trim();
  const trimmedPhone = (phone as string).trim();
  const trimmedAgeRange = (ageRange as string).trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const eventTypesArray = Array.isArray(interestedEventTypes) ? interestedEventTypes as string[] : [];

  // ── 3. DB operations ──────────────────────────────────────────────────────
  try {
    const trimmedEventId = eventId as string;

    // Fetch event + count in one query
    const event = await prisma.event.findUnique({
      where: { id: trimmedEventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Free registrations only — paid events go through /api/checkout
    if (event.priceCents > 0) {
      return NextResponse.json(
        { error: "This event requires payment. Use the /api/checkout flow." },
        { status: 400 }
      );
    }

    // Capacity check
    const spotsLeft = event.capacity - event._count.registrations;
    if (spotsLeft <= 0) {
      return NextResponse.json({ error: "This event is full" }, { status: 409 });
    }

    // Duplicate registration guard (DB-level unique constraint: email + eventId)
    const existing = await prisma.registration.findUnique({
      where: { email_eventId: { email: trimmedEmail, eventId: trimmedEventId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 409 }
      );
    }

    const trimmedWechatOpenId = (wechatOpenId as string | undefined)?.trim() || null;
    const trimmedWechatName = (wechatName as string | undefined)?.trim() || null;

    // Upsert user — match by wechatOpenId first, then email
    const user = await prisma.user.upsert({
      where: trimmedWechatOpenId
        ? { wechatOpenId: trimmedWechatOpenId }
        : { email: trimmedEmail },
      update: {
        name: trimmedName,
        phone: trimmedPhone,
        ...(trimmedWechatName ? { wechatName: trimmedWechatName } : {}),
        ...(trimmedWechatOpenId ? { wechatOpenId: trimmedWechatOpenId } : {}),
      },
      create: {
        email: trimmedEmail,
        name: trimmedName,
        phone: trimmedPhone,
        wechatName: trimmedWechatName,
        wechatOpenId: trimmedWechatOpenId,
      },
    });

    // Create the registration
    const registration = await prisma.registration.create({
      data: {
        eventId: trimmedEventId,
        userId: user.id,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        ageRange: trimmedAgeRange,
        gender: (gender as string).trim(),
        interestedEventTypes: JSON.stringify(eventTypesArray),
        wechatName: (wechatName as string | undefined)?.trim() || null,
        wechatOpenId: (wechatOpenId as string | undefined)?.trim() || null,
        notes: (notes as string | undefined)?.trim() || null,
        status: "confirmed",
      },
      include: {
        event: { select: { title: true, startAt: true, locationName: true, address: true, priceCents: true } },
        user: { select: { id: true, email: true } },
      },
    });

    // ── 4. Send confirmation email (non-blocking — don't fail the request) ──
    const eventDate = `${formatDateLong(new Date(event.startAt))} · ${formatTime(new Date(event.startAt))} – ${formatTime(new Date(event.endAt))}`;
    const eventLocation = `${event.locationName} — ${event.address}`;

    sendConfirmationEmail({
      to: trimmedEmail,
      name: trimmedName,
      wechatName: trimmedWechatName,
      eventTitle: event.title,
      eventDate,
      eventLocation,
      priceCents: event.priceCents,
    }).catch((err) => console.error("[email] confirmation failed:", err));

    return NextResponse.json(registration, { status: 201 });
  } catch (err) {
    console.error("[POST /api/registrations]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
