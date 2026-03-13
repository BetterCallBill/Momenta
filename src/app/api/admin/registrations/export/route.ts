import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");

  const where = eventId ? { eventId } : {};

  const registrations = await prisma.registration.findMany({
    where,
    include: { event: { select: { title: true, startAt: true } } },
    orderBy: { createdAt: "asc" },
  });

  const rows = registrations.map((r, i) => ({
    "#": i + 1,
    Name: r.name,
    Email: r.email,
    Phone: r.phone,
    Notes: r.notes ?? "",
    Event: r.event.title,
    "Event Date": new Date(r.event.startAt).toLocaleDateString("en-AU"),
    "Registered At": new Date(r.createdAt).toLocaleString("en-AU"),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws["!cols"] = [
    { wch: 4 }, { wch: 20 }, { wch: 28 }, { wch: 16 },
    { wch: 24 }, { wch: 36 }, { wch: 14 }, { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Registrations");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const eventTitle = registrations[0]?.event.title ?? "all-events";
  const filename = `registrations-${eventTitle.toLowerCase().replace(/\s+/g, "-")}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
