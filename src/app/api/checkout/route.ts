import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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

    if (event.priceCents === 0) {
      return NextResponse.json(
        { error: "This event is free — use /api/registrations instead" },
        { status: 400 }
      );
    }

    const spotsLeft = event.capacity - event._count.registrations;
    if (spotsLeft <= 0) {
      return NextResponse.json({ error: "This event is full" }, { status: 409 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const successUrl = `${siteUrl}/events/${event.slug}/register/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/events/${event.slug}/register/cancel`;

    // Create Stripe Checkout session first to get the session ID
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: event.title,
              description: `${event.locationName} — ${new Date(event.startAt).toLocaleDateString("en-AU", { dateStyle: "long" })}`,
            },
            unit_amount: event.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata: { eventId, name, email, phone, notes: notes || "" },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Create a pending registration tied to this session
    await prisma.registration.create({
      data: {
        eventId,
        name,
        email,
        phone,
        notes: notes || null,
        status: "pending_payment",
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
