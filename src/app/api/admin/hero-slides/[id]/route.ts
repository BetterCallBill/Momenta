import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { src, headline, accent, subtitle, sortOrder, isActive } = await req.json();

  const slide = await prisma.heroSlide.update({
    where: { id },
    data: { src, headline, accent, subtitle, sortOrder, isActive },
  });

  return NextResponse.json(slide);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.heroSlide.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
