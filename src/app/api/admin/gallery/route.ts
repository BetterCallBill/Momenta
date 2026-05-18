import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, eventName, sportType, type, videoUrl } = body;

  if (!url || !eventName) {
    return NextResponse.json({ error: "url and eventName are required" }, { status: 400 });
  }

  const image = await prisma.galleryImage.create({
    data: {
      url,
      alt: eventName,
      type: type ?? "image",
      videoUrl: videoUrl || null,
      tags: sportType ?? "",
      eventName: eventName,
    },
  });

  return NextResponse.json(image, { status: 201 });
}
