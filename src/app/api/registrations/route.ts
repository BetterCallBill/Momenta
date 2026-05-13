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
    age,
    gender,
    wechatName,
    wechatOpenId,
    notes,
  } = body as Record<string, string>;

  // ── 2. Validate required fields ───────────────────────────────────────────
  if (!eventId || !name || !email || !phone || !gender) {
    return NextResponse.json(
      { error: "Missing required fields: eventId, name, email, phone, gender" },
      { status: 400 }
    );
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const parsedAge = age ? parseInt(String(age), 10) : undefined;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (parsedAge !== undefined && (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 120)) {
    return NextResponse.json({ error: "Age must be between 10 and 120" }, { status: 400 });
  }

  // ── 3. DB operations ──────────────────────────────────────────────────────
  try {
    // Fetch event + count in one query
    const event = await prisma.event.findUnique({
      where: { id: eventId },
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
      where: { email_eventId: { email: trimmedEmail, eventId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 409 }
      );
    }

    // Upsert user — match by wechatOpenId first, then email
    const user = await prisma.user.upsert({
      where: wechatOpenId
        ? { wechatOpenId }
        : { email: trimmedEmail },
      update: {
        name: trimmedName,
        phone: trimmedPhone,
        ...(wechatName ? { wechatName } : {}),
        ...(wechatOpenId ? { wechatOpenId } : {}),
      },
      create: {
        email: trimmedEmail,
        name: trimmedName,
        phone: trimmedPhone,
        wechatName: wechatName || null,
        wechatOpenId: wechatOpenId || null,
      },
    });

    // Create the registration
    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId: user.id,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        age: parsedAge ?? null,
        gender: gender.trim(),
        wechatName: wechatName?.trim() || null,
        wechatOpenId: wechatOpenId?.trim() || null,
        notes: notes?.trim() || null,
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
      wechatName: wechatName || null,
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
