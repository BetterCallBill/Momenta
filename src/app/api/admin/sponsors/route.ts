import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(sponsors);
}

export async function POST(req: NextRequest) {
  const { name, logoUrl, description, websiteUrl, sortOrder, isActive } = await req.json();

  if (!name || !logoUrl || !description) {
    return NextResponse.json({ error: "name, logoUrl and description are required" }, { status: 400 });
  }

  const sponsor = await prisma.sponsor.create({
    data: {
      name,
      logoUrl,
      description,
      websiteUrl: websiteUrl ?? null,
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(sponsor, { status: 201 });
}
