# Momenta — Sydney's Chinese Outdoor Community

Event hosting platform for outdoor activities: running, hiking, BJJ, yoga, CrossFit, martial arts, and more.

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

**Option B: Remote PostgreSQL (Neon / Supabase / AWS RDS)**

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

## Admin Panel

Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

**Default credentials** (set via seed script):

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | `admin@momenta.com.au`   |
| Password | `momenta_admin_2025`     |

### Admin features

- **Hero Slides** — manage homepage carousel images, headlines, and subtitles
- **Sponsors** — manage partner logos and links shown in the Partners section
- **Events** — view events and registrations
- **Gallery** — manage featured images shown on the homepage

---

## Available Scripts

| Command              | Description                 |
| -------------------- | --------------------------- |
| `npm run dev`        | Start development server    |
| `npm run build`      | Production build            |
| `npm run start`      | Start production server     |
| `npm run db:migrate` | Run Prisma migrations       |
| `npm run db:seed`    | Seed the database           |
| `npm run db:studio`  | Open Prisma Studio (DB GUI) |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home: hero, about, partners, events, instagram, contact
│   ├── admin/              # Admin panel (JWT-protected)
│   │   ├── login/          # Admin login page
│   │   ├── hero-slides/    # Manage homepage carousel
│   │   ├── sponsors/       # Manage partner logos
│   │   ├── gallery/        # Manage gallery images
│   │   └── layout.tsx      # Admin sidebar layout
│   └── api/                # API route handlers
│       ├── events/         # GET events
│       ├── registrations/  # POST registration
│       ├── gallery/        # GET gallery images
│       ├── inquiries/      # POST contact inquiry
│       ├── hero-slides/    # GET active slides (public)
│       ├── sponsors/       # GET active sponsors (public)
│       └── admin/          # Protected admin APIs
│           ├── auth/       # POST login / DELETE logout
│           ├── hero-slides/
│           └── sponsors/
├── components/             # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── WeeklyCalendar.tsx  # Mon-Sun event grid
│   └── home/
│       ├── HomeHeroCarousel.tsx   # Full-viewport hero carousel (DB-driven)
│       ├── HomeAbout.tsx          # About section
│       ├── PartnersCarousel.tsx   # Auto-scrolling partners strip (DB-driven)
│       ├── PreviousEventsWall.tsx # Photo grid with lightbox (DB-driven)
│       ├── HomeInstagramShowcase.tsx
│       └── HomeContactForm.tsx
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── dates.ts            # Sydney timezone date helpers
│   ├── types.ts            # TypeScript types
│   └── instagram.ts        # Instagram adapter (mock)
└── proxy.ts                # Auth middleware (protects /admin routes)
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed: 9 March 2026 events + gallery + admin
```

---

## Database Schema

| Model          | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `Event`        | Title, slug, sportType, start/end, location, capacity |
| `Registration` | eventId, name, email, phone, notes                   |
| `GalleryImage` | url, alt, tags (comma-separated, e.g. `"featured"`)  |
| `Inquiry`      | Contact form submissions                             |
| `HeroSlide`    | Homepage carousel slides (image, headline, accent, subtitle) |
| `Sponsor`      | Partner logos and links                              |
| `Admin`        | Admin accounts (email + bcrypt password hash)        |

---

## Design System

- **Brand colors**: Black (`#0A0A0A`) + Gold (`#D4A017`)
- **Typography**: Inter (Google Fonts)
- **Tailwind theme**: Custom `gold-50`–`gold-900`, `brand-black`, `brand-white`
- **Components**: Dark backgrounds, gold accent CTAs, minimal and bold

---

## Instagram Integration

The MVP uses a mock adapter (`src/lib/instagram.ts`) returning static data. To connect to the real Instagram API:

1. Create a Facebook App with Instagram Basic Display API credentials
2. Implement `LiveInstagramAdapter` calling `https://graph.instagram.com/me/media`
3. Swap the export in `instagram.ts` (same `getInstagramPosts()` interface)

---

## Deployment

### Vercel + Neon/Supabase (recommended)

1. Push to GitHub and import the project at [vercel.com](https://vercel.com)
2. Set environment variables:
   - `DATABASE_URL` — PostgreSQL connection string
   - `JWT_SECRET` — random secret for admin auth (e.g. `openssl rand -base64 32`)
3. Set build command: `npx prisma generate && next build`
4. After first deploy, run migrations and seed:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### AWS (App Runner + RDS)

1. Create an **AWS RDS PostgreSQL** instance (`db.t3.micro` is sufficient)
2. Deploy the Next.js app via **AWS App Runner** (connect to GitHub repo)
3. Set environment variables in App Runner:
   - `DATABASE_URL=postgresql://USER:PASS@your-rds-host.rds.amazonaws.com:5432/momenta`
   - `JWT_SECRET=your-random-secret`
4. Run migrations against RDS:
   ```bash
   DATABASE_URL="postgresql://..." npx prisma migrate deploy
   ```

---

## Tech Stack

| Layer      | Technology                |
| ---------- | ------------------------- |
| Framework  | Next.js 16 (App Router)   |
| UI         | React 19 + Tailwind CSS 4 |
| Language   | TypeScript 5.9            |
| ORM        | Prisma 6                  |
| Database   | PostgreSQL 16             |
| Auth       | JWT (jose) + bcryptjs     |
| Deployment | Vercel or AWS App Runner  |
