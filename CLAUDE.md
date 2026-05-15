# CLAUDE.md — Momenta Events Platform

## Project Overview

Momenta is a bilingual (English/Chinese) sports events platform for a Sydney-based community group. It has two audiences:

- **Public site** — event discovery, registration, gallery, contact
- **Admin panel** (`/admin/*`) — event/content management, registration tracking, data export

The app is a **Next.js 16 App Router** monolith with a PostgreSQL database. There is no separate backend service — API routes live alongside pages in the same repo.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Database | PostgreSQL via Prisma 7 + `@prisma/adapter-pg` |
| Auth (admin) | JWT (`jose`) in httpOnly cookie; bcryptjs for passwords |
| Auth (user) | WeChat OAuth2 + JWT session |
| Payments | Stripe (checkout sessions + webhook) |
| Email | Nodemailer via Gmail SMTP |
| Styling | Tailwind CSS 4 |
| Font | Inter (Google Fonts, loaded in `src/app/layout.tsx`) |
| Export | `xlsx` for Excel export of registrations |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — wraps everything in <LanguageProvider>
│   ├── page.tsx                # Homepage
│   ├── (public pages)/         # events/, calendar/, gallery/, about/, sponsors/, contact/
│   ├── admin/                  # Admin panel — all pages are "use client"
│   │   ├── layout.tsx          # Sidebar nav + auth gate
│   │   └── [section]/page.tsx  # One file per admin section
│   └── api/
│       ├── admin/              # Protected admin API routes
│       ├── auth/wechat/        # WeChat OAuth flow
│       ├── registrations/      # Public registration endpoint
│       ├── checkout/           # Stripe checkout session creation
│       ├── webhooks/stripe/    # Stripe webhook handler
│       └── (public reads)/     # events/, gallery/, sponsors/, etc.
├── components/
│   ├── home/                   # Homepage-only section components
│   └── *.tsx                   # Shared components
├── lib/
│   ├── prisma.ts               # Singleton Prisma client
│   ├── i18n.ts                 # All EN + ZH translation strings
│   ├── types.ts                # Shared TypeScript types (re-exports Prisma types)
│   ├── dates.ts                # Date formatting + Sydney timezone utils
│   ├── email.ts                # Nodemailer email helpers
│   ├── imageUrl.ts             # Image URL normalisation (Cloudinary / Drive)
│   └── instagram.ts            # Instagram API fetch
└── design/
    └── tokens.ts               # Color, spacing, shadow, radius constants
```

---

## Architecture Rules

### Server vs. Client Components

- **Pages under `src/app/` default to Server Components.** Only add `"use client"` when you need browser APIs, hooks, or interactivity.
- **All admin pages are `"use client"`** — they fetch their own data via `useEffect` + `fetch("/api/admin/...")`.
- **Public pages fetch data at render time on the server** using `await prisma.*` directly in the page component, then pass data as props to client components.
- **Never import `prisma` in a `"use client"` file.** Prisma runs only on the server.

### API Routes

- Every API route file exports named HTTP method functions: `GET`, `POST`, `PUT`, `DELETE` — no default exports.
- Use `NextRequest` / `NextResponse` from `next/server`.
- Public routes: `/api/*` (no auth check)
- Admin routes: `/api/admin/*` — must verify the `admin_token` JWT cookie before responding. Look at existing admin routes for the auth pattern.
- Return `NextResponse.json(data, { status: N })` — always include a status code.
- Non-blocking side effects (email sending) use `.catch(console.error)` — never `await` them in the response path.

### Database

- One singleton Prisma client exported from `src/lib/prisma.ts`. Always import from there: `import { prisma } from "@/lib/prisma"`.
- **Never** create a `new PrismaClient()` inline.
- All IDs are `cuid()` strings, not integers.
- DateTime fields in the DB are UTC. Display them in Sydney time using `src/lib/dates.ts` helpers.
- JSON array fields (`galleryImages`, `tags`) are stored as `String` in the schema and serialised with `JSON.stringify` / parsed with `parseJsonArray()` from `src/lib/types.ts`.
- After changing `schema.prisma`, run `pnpm prisma migrate dev --name <descriptive-name>`.

---

## Coding Standards

### TypeScript

- Use types from `src/lib/types.ts` — it re-exports Prisma-generated types and adds domain types.
- Prefer `type` over `interface` for plain data shapes.
- Use `satisfies` for config objects that should be type-checked without widening (see `i18n.ts`).
- Do not use `any`. Use `unknown` and narrow it explicitly.

### Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| React components | PascalCase | `RegisterModal.tsx` |
| Hooks | camelCase with `use` prefix | `useLanguage()` |
| API route files | `route.ts` in folder | `app/api/events/route.ts` |
| Prisma model fields | camelCase | `startAt`, `priceCents`, `isFeatured` |
| CSS class strings | Tailwind utility classes only | `"flex items-center gap-2"` |
| Constants / lookups | SCREAMING_SNAKE_CASE | `SPORT_LABELS`, `EMPTY_FORM` |

### File Organisation

- One component per file.
- Homepage-specific section components live in `src/components/home/`.
- Generic reusable components live in `src/components/`.
- Utility functions (not React) live in `src/lib/`.

---

## Frontend Conventions

### i18n (Mandatory)

Every user-visible string must go through the i18n system. No hardcoded English strings in JSX.

```tsx
// At the top of any "use client" component
const { t } = useLanguage();

// In JSX
<h1>{t.nav.events}</h1>
<p>{t.common.spots_left(5)}</p>
```

To add new strings:
1. Add the key to **both** `en` and `zh` objects in `src/lib/i18n.ts`.
2. The `Translations` type is derived from `translations.en` — TypeScript will error if `zh` is missing a key.

### State Management

- No global state library. State lives in React component `useState`.
- Language preference: `LanguageContext` (React context) + `localStorage`.
- Theme preference: `localStorage` + `dark` class on `<html>` (injected by inline script in `layout.tsx` to avoid flash).
- Admin data: fetched in `useEffect` on mount, stored in local `useState`.

### Forms

- Use the native `<dialog>` element for modals (see `RegisterModal.tsx`).
- Read form values via `new FormData(e.currentTarget)` in submit handlers.
- Show `status: "idle" | "loading" | "success" | "error"` state for async submissions.
- Client-side validate before POST; show inline error messages, not `alert()`.

### Date Display

Always use helpers from `src/lib/dates.ts`. All functions handle the `Australia/Sydney` timezone automatically.

```ts
import { formatDate, formatTime, formatDateLong } from "@/lib/dates";
// Never use: new Date().toLocaleString() without the TZ option
```

### Images

Use `next/image` for all images. Remote hostnames must be in `next.config.ts` → `images.remotePatterns`. Currently allowed: Unsplash, Picsum, Cloudinary (`res.cloudinary.com`), Google Drive (`drive.google.com`, `lh3.googleusercontent.com`).

---

## Styling Rules

- **Tailwind CSS 4 only.** No inline `style={{}}`, no CSS modules, no styled-components.
- Design tokens are in `src/design/tokens.ts`. The Tailwind config uses these values — prefer semantic class names (`text-gold-500`, `bg-neutral-900`) over arbitrary values (`text-[#D4A017]`).
- **Color palette:** `brand-black` (#0A0A0A), `brand-white` (#FAFAFA), `gold-500` (#D4A017) as primary accent, `neutral-*` scale for UI surfaces.
- **Dark mode is the default.** The `<html>` tag always starts with `class="dark"`. Use `dark:` variants only for light-mode overrides (reversed from typical usage).
- **Noise texture:** The `noise-overlay` class on `<body>` adds a subtle film grain — preserve this on new full-page layouts.
- **Border radius conventions:** `rounded-lg` (12px) for cards, `rounded-2xl` (20px) for modals/sheets, `rounded-full` for pills/badges.
- **Admin layout:** sidebar is `w-56 bg-neutral-900`, content area is `max-w-5xl mx-auto px-8 py-8`.

---

## Backend / API Patterns

### Admin Auth Pattern

Every admin API route must verify the JWT before processing:

```ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const cookieStore = await cookies();
const token = cookieStore.get("admin_token")?.value;
if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// then jwtVerify(token, JWT_SECRET)
```

(Copy the pattern from `src/app/api/admin/registrations/route.ts`.)

### Registration Flow

- **Free events:** `POST /api/registrations` — validates, upserts User, creates Registration, sends email (non-blocking).
- **Paid events:** `POST /api/checkout` → Stripe Checkout session → redirect → Stripe webhook at `POST /api/webhooks/stripe` updates `Registration.stripeSessionId` and `status`.
- The `/api/registrations` route rejects paid events (`priceCents > 0`) — they must go through checkout.

### Duplicate Guard

The `Registration` model has a DB-level unique constraint: `@@unique([email, eventId])`. Always check for the existing record before insert and return 409 if found.

### Email

```ts
import { sendConfirmationEmail } from "@/lib/email";
// Call non-blocking:
sendConfirmationEmail({ ... }).catch((err) => console.error("[email]", err));
```

Never `await` email sends in the HTTP response path.

---

## Database Patterns

### Sport Types

Defined in `src/lib/types.ts`: `RUNNING | HIKING | GOLF | BJJ | YOGA | OTHER`. The `SPORT_LABELS` and `SPORT_ICONS` maps provide display values. Use these everywhere; do not hardcode sport strings.

### Capacity Check

```ts
const event = await prisma.event.findUnique({
  where: { id: eventId },
  include: { _count: { select: { registrations: true } } },
});
const spotsLeft = event.capacity - event._count.registrations;
```

Always fetch count with `_count` in a single query — never do two queries.

### JSON Array Fields

`GalleryImage.tags` and `Event.galleryImages` are `String` columns storing JSON arrays.

```ts
import { parseJsonArray } from "@/lib/types";
const tags = parseJsonArray(image.tags); // → string[]
// Save:
await prisma.galleryImage.update({ data: { tags: JSON.stringify(newTags) } });
```

---

## Environment Variables

```
DATABASE_URL              # PostgreSQL connection string
NEXT_PUBLIC_SITE_URL      # Public base URL (e.g. https://momenta.com.au)
JWT_SECRET                # Admin JWT signing secret
STRIPE_SECRET_KEY         # Stripe secret key
STRIPE_WEBHOOK_SECRET     # Stripe webhook signing secret
WECHAT_APP_ID             # WeChat OAuth app ID
WECHAT_APP_SECRET         # WeChat OAuth app secret
WECHAT_SESSION_SECRET     # WeChat session JWT secret
GMAIL_USER                # Gmail sender address
GMAIL_APP_PASSWORD        # Gmail app password (not account password)
```

Do not access `process.env.*` in client components. Only server-side code (API routes, server components) can read secrets. Use `NEXT_PUBLIC_` prefix only for values safe to expose to the browser.

---

## Adding New Features

### New Public Page

1. Create `src/app/<route>/page.tsx` as a Server Component.
2. Fetch data directly with `await prisma.*` at the top of the component.
3. Add `export const dynamic = "force-dynamic"` if the data changes frequently.
4. Pass data as props to child `"use client"` components for interactivity.
5. Add the route to the `Header.tsx` nav array and translate the label in `src/lib/i18n.ts`.

### New Admin Section

1. Create `src/app/admin/<section>/page.tsx` with `"use client"` at the top.
2. Fetch data via `useEffect` → `fetch("/api/admin/<section>")`.
3. Create `src/app/api/admin/<section>/route.ts` with `GET` + `POST`.
4. Create `src/app/api/admin/<section>/[id]/route.ts` with `PUT` + `DELETE`.
5. Add the section to the `navItems` array in `src/app/admin/layout.tsx`.
6. Add admin JWT auth verification to every new API route.

### New Database Model

1. Add the model to `prisma/schema.prisma`.
2. Run `pnpm prisma migrate dev --name add-<model-name>`.
3. Add the type re-export to `src/lib/types.ts` if it will be used across files.

### New i18n String

1. Add to `translations.en` in `src/lib/i18n.ts`.
2. Add the matching key to `translations.zh` (TypeScript will error if missing).
3. Use `const { t } = useLanguage()` in the component.

---

## Dos and Don'ts

**Do:**
- Import Prisma client only from `src/lib/prisma.ts`.
- Use `src/lib/dates.ts` for all date formatting — never raw `.toLocaleString()`.
- Add new translation keys to both `en` and `zh` simultaneously.
- Use the native `<dialog>` element for modals.
- Keep admin pages as `"use client"` + `useEffect` fetchers; keep public pages as Server Components.
- Use `parseJsonArray()` from `src/lib/types.ts` for `tags` and `galleryImages` fields.
- Send emails non-blocking with `.catch()`.

**Don't:**
- Don't `import { PrismaClient } from "@prisma/client"` and instantiate it manually.
- Don't add new remote image hostnames to `next.config.ts` without considering whether they're permanent.
- Don't hardcode English strings in JSX — always go through `t.*`.
- Don't put secrets in `NEXT_PUBLIC_` env vars.
- Don't `await` email or webhook calls in the HTTP response path.
- Don't use `new Date().toLocaleString()` — use the `src/lib/dates.ts` helpers which handle Sydney timezone.
- Don't add a new state management library — use React `useState` and context.
- Don't add CSS modules or inline styles — Tailwind only.
- Don't duplicate sport type strings — use `SPORT_LABELS` / `SPORT_ICONS` from `src/lib/types.ts`.
