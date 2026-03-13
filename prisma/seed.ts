import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function dateAt(year: number, month: number, day: number, hour: number, minute = 0): Date {
  // month is 1-based
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

async function main() {
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.admin.deleteMany();

  const events = [
    {
      title: "瑜伽团建 · Yoga Team Building",
      slug: "yoga-team-building-0301",
      sportType: "YOGA",
      description: "Join us for a rejuvenating yoga team building session. All levels welcome — bring a mat or borrow one on site.",
      startAt: dateAt(2026, 3, 1, 9, 0),
      endAt: dateAt(2026, 3, 1, 10, 30),
      locationName: "Sydney CBD",
      address: "Sydney NSW 2000",
      capacity: 25,
      priceCents: 0,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Indoor Challenge Room",
      slug: "indoor-challenge-room-0305",
      sportType: "OTHER",
      description: "Test your limits with our exciting indoor challenge room — a series of physical and mental obstacles for your whole team.",
      startAt: dateAt(2026, 3, 5, 14, 0),
      endAt: dateAt(2026, 3, 5, 17, 0),
      locationName: "Indoor Arena Sydney",
      address: "Sydney NSW 2000",
      capacity: 30,
      priceCents: 0,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Rhodes Morning Run",
      slug: "rhodes-morning-run-0314",
      sportType: "RUNNING",
      description: "Scenic morning run around Rhodes Waterfront. Flat course with stunning harbour views — perfect for all pace groups.",
      startAt: dateAt(2026, 3, 14, 7, 0),
      endAt: dateAt(2026, 3, 14, 8, 30),
      locationName: "Rhodes Waterfront Park",
      address: "Rhodes NSW 2138",
      capacity: 40,
      priceCents: 0,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "BJJ Team Building Class",
      slug: "bjj-team-building-0315",
      sportType: "BJJ",
      description: "Brazilian Jiu-Jitsu team building session. Learn fundamentals, drill techniques, and finish with light rolling. No experience needed.",
      startAt: dateAt(2026, 3, 15, 10, 0),
      endAt: dateAt(2026, 3, 15, 11, 30),
      locationName: "Gracie Sydney",
      address: "Sydney NSW 2000",
      capacity: 20,
      priceCents: 0,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Blue Mountains Hiking Trip",
      slug: "blue-mountains-hiking-0321",
      sportType: "HIKING",
      description: "Full-day hike through the stunning Blue Mountains. Moderate difficulty — 10km trail with breathtaking views. Bring lunch and 2L water.",
      startAt: dateAt(2026, 3, 21, 7, 0),
      endAt: dateAt(2026, 3, 21, 16, 0),
      locationName: "Wentworth Falls",
      address: "Wentworth Falls NSW 2782",
      capacity: 20,
      priceCents: 0,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Bungee Jumping — Champion Group Prize",
      slug: "bungee-jumping-champion-0322",
      sportType: "OTHER",
      description: "Exclusive bungee jumping experience as a prize for our champion group. Feel the adrenaline rush with your teammates!",
      startAt: dateAt(2026, 3, 22, 10, 0),
      endAt: dateAt(2026, 3, 22, 13, 0),
      locationName: "Sydney Adventure Centre",
      address: "Sydney NSW 2000",
      capacity: 15,
      priceCents: 0,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "CrossFit Team Building Class",
      slug: "crossfit-team-building-0322",
      sportType: "CROSSFIT",
      description: "High-intensity CrossFit session designed for teams. Scaled options available for all fitness levels. Get ready to sweat together!",
      startAt: dateAt(2026, 3, 22, 14, 30),
      endAt: dateAt(2026, 3, 22, 16, 0),
      locationName: "CrossFit Sydney",
      address: "Sydney NSW 2000",
      capacity: 24,
      priceCents: 0,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Indoor Challenge Room & Bowling Activity",
      slug: "challenge-room-bowling-0328",
      sportType: "OTHER",
      description: "Double the fun — tackle the indoor challenge room then head to bowling for a social showdown. Great for all ages.",
      startAt: dateAt(2026, 3, 28, 14, 0),
      endAt: dateAt(2026, 3, 28, 18, 0),
      locationName: "Entertainment Quarter",
      address: "Moore Park NSW 2021",
      capacity: 30,
      priceCents: 0,
      isFeatured: false,
      coverImageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=500&fit=crop",
      galleryImages: "[]",
    },
    {
      title: "Sanda (Chinese Kickboxing) Team Building",
      slug: "sanda-team-building-0329",
      sportType: "MARTIAL_ARTS",
      description: "Experience traditional Chinese Sanda (散打) kickboxing in a team setting. Learn striking combinations and footwork drills with our experienced coaches.",
      startAt: dateAt(2026, 3, 29, 10, 0),
      endAt: dateAt(2026, 3, 29, 12, 0),
      locationName: "Sydney Martial Arts Centre",
      address: "Sydney NSW 2000",
      capacity: 20,
      priceCents: 0,
      isFeatured: true,
      coverImageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=500&fit=crop",
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

  // Hero slides
  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({
    data: [
      {
        src: "/images/DJI_0545.jpeg",
        headline: "Move Together.",
        accent: "Grow Together.",
        subtitle: "Sydney's Chinese outdoor community — running, hiking, golf, BJJ, yoga and more.",
        sortOrder: 0,
      },
      {
        src: "/images/26-02-08-event/DJI_02.JPG",
        headline: "Every Week,",
        accent: "Rain or Shine.",
        subtitle: "Discover curated outdoor events that challenge, inspire, and connect.",
        sortOrder: 1,
      },
      {
        src: "/images/bbfb2614da2367c8fadb40fcdcbc4698.jpeg",
        headline: "Find Your",
        accent: "Momentum.",
        subtitle: "From beginners to seasoned athletes — there's a place for everyone.",
        sortOrder: 2,
      },
    ],
  });

  // Admin account
  const passwordHash = await bcrypt.hash("momenta_admin_2025", 10);
  await prisma.admin.create({
    data: { email: "admin@momenta.com.au", passwordHash },
  });

  console.log("Seed complete: 9 March 2026 events, 12 gallery images, 1 admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
