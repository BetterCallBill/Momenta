import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const image = await prisma.galleryImage.update({
    where: { id },
    data: {
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.alt !== undefined && { alt: body.alt }),
    },
  });

  return NextResponse.json(image);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
