import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const { src, headline, accent, subtitle, sortOrder, isActive } = await req.json();

  if (!src || !headline || !accent || !subtitle) {
    return NextResponse.json({ error: "src, headline, accent and subtitle are required" }, { status: 400 });
  }

  const slide = await prisma.heroSlide.create({
    data: {
      src,
      headline,
      accent,
      subtitle,
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(slide, { status: 201 });
}
