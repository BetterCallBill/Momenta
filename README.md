# Momenta — Sydney's Chinese Outdoor Community

Event hosting platform for outdoor activities: running, hiking, golf, BJJ, yoga, and more.

Built with **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Prisma 6** + **Tailwind CSS 4** + **PostgreSQL**.

---

## Quick Start

### Prerequisites

- Node.js >= 20.19
- Docker (for local PostgreSQL) **OR** a remote PostgreSQL instance

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

**Option A: Docker PostgreSQL (recommended)**

```bash
docker compose up -d
cp .env.example .env
# DATABASE_URL is already set to localhost:5432
```

**Option B: Remote PostgreSQL (Neon / Supabase)**

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL to your connection string
```

### 3. Run migrations and seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home: hero, events, calendar, instagram
│   ├── events/page.tsx     # Event list with filters
│   ├── events/[slug]/register/  # Registration page
│   ├── gallery/page.tsx    # Photo gallery with lightbox
│   ├── about/page.tsx      # About us
│   ├── contact/page.tsx    # Contact form
│   └── api/                # API route handlers
│       ├── events/         # GET events (filtered)
│       ├── registrations/  # POST registration
│       ├── gallery/        # GET gallery images
│       └── inquiries/      # POST contact inquiry
├── components/             # React components
│   ├── Header.tsx          # Sticky nav with gold CTA
│   ├── Footer.tsx          # Links + social icons
│   ├── HeroSection.tsx     # Full-viewport hero
│   ├── Carousel.tsx        # Featured events slider
│   ├── UpcomingStrip.tsx   # Event teaser cards
│   ├── WeeklyCalendar.tsx  # Mon-Sun calendar grid
│   ├── EventCard.tsx       # Event card with register
│   ├── FilterBar.tsx       # Sport/date/keyword filters
│   ├── RegisterModal.tsx   # Registration modal dialog
│   ├── GalleryGrid.tsx     # Masonry photo grid
│   ├── Lightbox.tsx        # Full-screen image viewer
│   ├── ContactForm.tsx     # Contact form with honeypot
│   ├── CTABanner.tsx       # Section-break CTA block
│   └── InstagramShowcase.tsx  # Mock Instagram grid
├── lib/                    # Shared utilities
│   ├── prisma.ts           # Prisma client singleton
│   ├── dates.ts            # Sydney timezone date logic
│   ├── types.ts            # TypeScript types + constants
│   └── instagram.ts        # Mock Instagram adapter
└── design/
    └── tokens.ts           # Brand colors + design tokens
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed script (10 events, 12 images)
```

---

## Database Schema

- **Event** — title, slug, sportType, description, startAt/endAt, location, capacity, price, coverImage
- **Registration** — eventId, name, email, phone, notes
- **GalleryImage** — url, alt, tags
- **Inquiry** — name, email, message, honeypot (spam trap)

---

## Design System

- **Brand colors**: Black (`#0A0A0A`) + Gold (`#D4A017`)
- **Typography**: Inter (Google Fonts)
- **Tailwind theme**: Custom `gold-50` through `gold-900` scale, `brand-black`, `brand-white`, `neutral-600` through `neutral-900`
- **Components**: Dark backgrounds, gold accent CTAs, minimal and bold

---

## Instagram Integration

The MVP uses a mock adapter (`src/lib/instagram.ts`) that returns static data. To connect to the real Instagram API:

1. Create a Facebook App and Instagram Basic Display API credentials
2. Implement `LiveInstagramAdapter` calling `https://graph.instagram.com/me/media`
3. Swap the export in `instagram.ts` (same `getInstagramPosts()` interface)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string (from [Neon](https://neon.tech) or [Supabase](https://supabase.com), both have free tiers)
4. Set build command: `npx prisma generate && next build`
5. After deploy, run migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Language | TypeScript 5.9 |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 |
| Deployment | Vercel (recommended) |
