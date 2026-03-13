import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, role, bio, avatarUrl, sortOrder } = body;

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      name,
      role,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json(member);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
