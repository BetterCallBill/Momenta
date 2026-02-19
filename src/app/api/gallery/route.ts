import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(images);
}
