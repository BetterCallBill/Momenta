import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function dayAt(monday: Date, dayOffset: number, hour: number, minute = 0): Date {
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.inquiry.deleteMany();

  const mon = getMonday();

  const events = [
    {
      title: "Morning City Run",
      slug: "morning-city-run",
      sportType: "RUNNING",
      description: "5km run through Sydney CBD starting at Circular Quay. All paces welcome. We regroup every kilometre.",
      startAt: dayAt(mon, 0, 6, 30),
      endAt: dayAt(mon, 0, 7, 30),
      locationName: "Circular Quay",
      address: "Circular Quay, Sydney NSW 2000",
      capacity: 30,
      priceCents: 0,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Evening Yoga Flow",
      slug: "evening-yoga-flow",
      sportType: "YOGA",
      description: "Unwind after work with a 60-minute vinyasa flow in the park. Mats provided. Suitable for all levels.",
      startAt: dayAt(mon, 0, 18, 0),
      endAt: dayAt(mon, 0, 19, 0),
      locationName: "Hyde Park",
      address: "Hyde Park, Elizabeth St, Sydney NSW 2000",
      capacity: 20,
      priceCents: 1500,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "BJJ Fundamentals",
      slug: "bjj-fundamentals-tue",
      sportType: "BJJ",
      description: "Learn the basics of Brazilian Jiu-Jitsu. Gi provided for beginners. Focus on guard passes and sweeps this week.",
      startAt: dayAt(mon, 1, 19, 0),
      endAt: dayAt(mon, 1, 20, 30),
      locationName: "Gracie Sydney",
      address: "123 Pitt St, Sydney NSW 2000",
      capacity: 16,
      priceCents: 2500,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Sunrise Yoga",
      slug: "sunrise-yoga-wed",
      sportType: "YOGA",
      description: "Greet the day with a gentle hatha yoga session overlooking the harbour. Perfect for beginners.",
      startAt: dayAt(mon, 2, 6, 0),
      endAt: dayAt(mon, 2, 7, 0),
      locationName: "Mrs Macquaries Point",
      address: "Mrs Macquaries Rd, Sydney NSW 2000",
      capacity: 25,
      priceCents: 1000,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Interval Training Run",
      slug: "interval-run-wed",
      sportType: "RUNNING",
      description: "Speed work session: 8x400m intervals at Centennial Park track. Warm-up and cool-down included.",
      startAt: dayAt(mon, 2, 18, 30),
      endAt: dayAt(mon, 2, 19, 30),
      locationName: "Centennial Park",
      address: "Grand Dr, Centennial Park NSW 2021",
      capacity: 20,
      priceCents: 0,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Golf Social — 9 Holes",
      slug: "golf-social-thu",
      sportType: "GOLF",
      description: "Casual 9-hole round followed by lunch at the clubhouse. Mixed skill levels. Clubs available for rent.",
      startAt: dayAt(mon, 3, 13, 0),
      endAt: dayAt(mon, 3, 16, 0),
      locationName: "Moore Park Golf",
      address: "Cleveland St & Anzac Parade, Moore Park NSW 2021",
      capacity: 12,
      priceCents: 4500,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "BJJ Open Mat",
      slug: "bjj-open-mat-fri",
      sportType: "BJJ",
      description: "Free rolling session for all belt levels. 90 minutes of open sparring with coaching tips between rounds.",
      startAt: dayAt(mon, 4, 19, 0),
      endAt: dayAt(mon, 4, 20, 30),
      locationName: "Gracie Sydney",
      address: "123 Pitt St, Sydney NSW 2000",
      capacity: 20,
      priceCents: 2000,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Blue Mountains Day Hike",
      slug: "blue-mountains-hike-sat",
      sportType: "HIKING",
      description: "Full-day hike: Wentworth Falls to Leura via the National Pass. 10km, moderate difficulty. Bring lunch and 2L water.",
      startAt: dayAt(mon, 5, 7, 0),
      endAt: dayAt(mon, 5, 15, 0),
      locationName: "Wentworth Falls",
      address: "Wentworth Falls NSW 2782",
      capacity: 15,
      priceCents: 2000,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Coastal Walk — Bondi to Coogee",
      slug: "bondi-coogee-walk-sun",
      sportType: "HIKING",
      description: "Iconic 6km coastal walk with ocean views. Easy pace, great for socialising. Coffee stop at Bronte.",
      startAt: dayAt(mon, 6, 8, 0),
      endAt: dayAt(mon, 6, 11, 0),
      locationName: "Bondi Beach",
      address: "Bondi Beach, NSW 2026",
      capacity: 25,
      priceCents: 0,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Community BBQ & Games",
      slug: "community-bbq-sun",
      sportType: "OTHER",
      description: "End-of-week social: BBQ, frisbee, volleyball and good vibes at Centennial Park. Bring a dish to share!",
      startAt: dayAt(mon, 6, 12, 0),
      endAt: dayAt(mon, 6, 16, 0),
      locationName: "Centennial Park — Fearnley Grounds",
      address: "Centennial Park NSW 2021",
      capacity: 50,
      priceCents: 1000,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=800&fit=crop", alt: "Group running along the harbour", tags: '["running","featured"]' },
    { url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", alt: "Hiking through misty mountains", tags: '["hiking","featured"]' },
    { url: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&h=600&fit=crop", alt: "Golf swing on a sunny day", tags: '["golf"]' },
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop", alt: "Outdoor yoga at sunset", tags: '["yoga","featured"]' },
    { url: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=600&h=800&fit=crop", alt: "BJJ sparring session", tags: '["bjj"]' },
    { url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop", alt: "Meditation by the water", tags: '["yoga"]' },
    { url: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&h=400&fit=crop", alt: "Running track interval training", tags: '["running"]' },
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop", alt: "Coastal walk ocean views", tags: '["hiking"]' },
    { url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=800&fit=crop", alt: "Community social gathering", tags: '["community","featured"]' },
    { url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&h=400&fit=crop", alt: "BJJ gi training", tags: '["bjj"]' },
    { url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=600&fit=crop", alt: "Runners stretching before race", tags: '["running"]' },
    { url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=800&fit=crop", alt: "Mountain summit panorama", tags: '["hiking","featured"]' },
  ];

  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img });
  }

  console.log("Seed complete: 10 events, 12 gallery images");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
