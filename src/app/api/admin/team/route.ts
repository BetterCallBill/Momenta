import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, role, bio, avatarUrl, sortOrder } = body;

  if (!name || !role) {
    return NextResponse.json({ error: "name and role are required" }, { status: 400 });
  }

  const member = await prisma.teamMember.create({
    data: {
      name,
      role,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      sortOrder: Number(sortOrder) || 0,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
