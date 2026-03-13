import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, logoUrl, description, websiteUrl, sortOrder, isActive } = await req.json();

  const sponsor = await prisma.sponsor.update({
    where: { id },
    data: { name, logoUrl, description, websiteUrl, sortOrder, isActive },
  });

  return NextResponse.json(sponsor);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.sponsor.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
