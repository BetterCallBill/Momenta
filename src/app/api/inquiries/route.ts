import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInquiryNotificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, inquiryType, message, honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        inquiryType: inquiryType || null,
        message,
      },
    });

    sendInquiryNotificationEmail({
      inquiryId: inquiry.id,
      to: "momenta0429@gmail.com",
      name,
      email,
      phone: phone || null,
      inquiryType: inquiryType || "General",
      message,
      submittedAt: inquiry.createdAt,
    }).catch((err) => console.error("[email] inquiry notification failed:", err));

    return NextResponse.json(inquiry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
