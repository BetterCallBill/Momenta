import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const enquiries = await prisma.inquiry.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      inquiryType: true,
      message: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(enquiries);
}
