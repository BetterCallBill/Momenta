# Technical Specification
# Momenta Events Platform

**Version:** 1.0  
**Date:** 2026-05-13  
**Author:** Billy Wang  
**Status:** Current

---

## 1. System Overview

Momenta is a bilingual (EN/ZH) sports events platform deployed as a **Next.js 16 App Router monolith**. There is no separate backend service — API routes, server components, and the admin panel all live in the same repository and share a single PostgreSQL database via Prisma ORM.

The system has two audiences:

| Audience | Entry Point | Auth Mechanism |
|---|---|---|
| Public visitors | `/`, `/events`, `/gallery`, etc. | WeChat OAuth (optional, for pre-filling registration) |
| Admins | `/admin/*` | JWT in `admin_token` httpOnly cookie |

---

## 2. Tech Stack

| Layer | Package / Version | Notes |
|---|---|---|
| Framework | `next@^16.1.6` | App Router; React Server Components by default |
| Language | `typescript@^5.9.3` | Strict mode |
| UI | `react@^19.2.4` | — |
| Database | PostgreSQL | Hosted externally; connection via `DATABASE_URL` |
| ORM | `@prisma/client@^7.5.0` + `@prisma/adapter-pg@^7.5.0` | Singleton client in `src/lib/prisma.ts` |
| Auth (admin) | `jose@^6.2.1` | HS256 JWT in httpOnly cookie `admin_token` |
| Auth (user) | WeChat OAuth 2.0 + `jose` JWT | Cookie `wechat_session`; 7-day TTL |
| Passwords | `bcryptjs@^3.0.3` | Admin password hashing only |
| Payments | `stripe@^20.4.1` | Checkout Sessions + webhook |
| Email | `nodemailer@^8.0.4` | Gmail SMTP (STARTTLS port 587) |
| Export | `xlsx@^0.18.5` | Admin Excel export of registrations |
| Styling | `tailwindcss@^4.1.10` | Dark-first; design tokens in `src/design/tokens.ts` |
| Font | Inter | Loaded via Google Fonts in root layout |
| Postgres driver | `pg@^8.20.0` | Used by `@prisma/adapter-pg` |

---

## 3. Repository Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — LanguageProvider, dark class, noise texture
│   ├── page.tsx                    # Homepage (Server Component)
│   ├── events/
│   │   ├── page.tsx                # Events list (Server Component)
│   │   └── [slug]/
│   │       ├── page.tsx            # Event detail (Server Component)
│   │       └── register/
│   │           ├── page.tsx        # Registration entry (Server Component)
│   │           ├── RegisterForm.tsx
│   │           ├── success/page.tsx
│   │           └── cancel/page.tsx
│   ├── calendar/page.tsx           # Monthly calendar (Server Component)
│   ├── gallery/page.tsx
│   ├── contact/page.tsx
│   ├── about/page.tsx
│   ├── sponsors/page.tsx
│   ├── admin/
│   │   ├── layout.tsx              # Sidebar nav + logout (Client Component)
│   │   ├── login/page.tsx          # Admin login
│   │   ├── page.tsx                # Dashboard
│   │   ├── events/page.tsx
│   │   ├── registrations/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── previous-events/page.tsx
│   │   ├── hero-slides/page.tsx
│   │   ├── sponsors/page.tsx
│   │   └── team/page.tsx
│   └── api/
│       ├── admin/
│       │   ├── auth/route.ts           # POST login, DELETE logout
│       │   ├── events/route.ts         # GET all, POST create
│       │   ├── events/[id]/route.ts    # PUT update, DELETE remove
│       │   ├── gallery/route.ts
│       │   ├── gallery/[id]/route.ts
│       │   ├── hero-slides/route.ts
│       │   ├── hero-slides/[id]/route.ts
│       │   ├── registrations/route.ts  # GET (with ?eventId filter)
│       │   ├── registrations/export/route.ts  # GET → .xlsx download
│       │   ├── sponsors/route.ts
│       │   ├── sponsors/[id]/route.ts
│       │   ├── team/route.ts
│       │   └── team/[id]/route.ts
│       ├── auth/wechat/
│       │   ├── start/route.ts      # Redirect to WeChat QR
│       │   ├── callback/route.ts   # Exchange code → JWT cookie → postMessage
│       │   ├── logout/route.ts     # Clear cookie
│       │   └── mock/route.ts       # DEV ONLY — disable in prod
│       ├── checkout/route.ts       # POST — create Stripe Checkout Session
│       ├── events/route.ts         # GET public events list
│       ├── gallery/route.ts        # GET public gallery
│       ├── hero-slides/route.ts    # GET active hero slides
│       ├── inquiries/route.ts      # POST contact form submission
│       ├── registrations/route.ts  # POST free-event registration
│       ├── sponsors/route.ts       # GET active sponsors
│       └── webhooks/stripe/route.ts # POST Stripe webhook handler
├── components/
│   ├── home/                        # Homepage-only section components
│   │   ├── HomeHeroCarousel.tsx
│   │   ├── HomeAbout.tsx
│   │   ├── HomeContactForm.tsx
│   │   ├── HomeInstagramShowcase.tsx
│   │   ├── PartnersCarousel.tsx
│   │   └── PreviousEventsWall.tsx
│   ├── ContactForm.tsx
│   ├── ContactInfoPanel.tsx
│   ├── CTABanner.tsx
│   ├── Carousel.tsx
│   ├── EventCard.tsx
│   ├── FilterBar.tsx
│   ├── Footer.tsx
│   ├── GalleryGrid.tsx
│   ├── Header.tsx
│   ├── InstagramShowcase.tsx
│   ├── LanguageContext.tsx          # React context + hook
│   ├── LanguageToggle.tsx
│   ├── Lightbox.tsx
│   ├── RegisterModal.tsx
│   ├── ThemeToggle.tsx
│   ├── UpcomingStrip.tsx
│   ├── WeChatLoginButton.tsx
│   └── WeeklyCalendar.tsx
└── lib/
    ├── prisma.ts                    # Singleton PrismaClient export
    ├── i18n.ts                      # All EN + ZH translation strings
    ├── types.ts                     # Prisma type re-exports + domain types
    ├── dates.ts                     # Sydney-timezone date helpers
    ├── email.ts                     # Nodemailer helpers (confirmation + inquiry)
    ├── imageUrl.ts                  # Cloudinary / Drive URL normalisation
    ├── instagram.ts                 # Instagram Basic Display API fetch
    ├── stripe.ts                    # Stripe client singleton
    ├── wechat.ts                    # WeChat OAuth API calls
    └── wechatSession.ts             # WeChat JWT sign/verify + cookie name
```

---

## 4. Database Schema

All models use `cuid()` string PKs. DateTime fields are stored in UTC; display uses Sydney-timezone helpers from `src/lib/dates.ts`.

### 4.1 Models

**Event**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| title | String | — |
| slug | String | Unique; used as URL segment |
| sportType | String | One of `SPORT_LABELS` keys: RUNNING, HIKING, GOLF, BJJ, YOGA, OTHER |
| description | String | — |
| startAt | DateTime | UTC |
| endAt | DateTime | UTC |
| timezone | String | Default `Australia/Sydney` |
| locationName | String | — |
| address | String | — |
| capacity | Int | — |
| priceCents | Int | 0 = free |
| isFeatured | Boolean | Default false |
| coverImageUrl | String | — |
| galleryImages | String | JSON array of image URLs (`"[]"` default) |
| createdAt | DateTime | — |

**User**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| email | String | Unique |
| name | String | — |
| phone | String | Default `""` |
| wechatOpenId | String? | Unique; null for non-WeChat users |
| wechatName | String? | — |
| createdAt | DateTime | — |

**Registration**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| eventId | String | FK → Event |
| userId | String? | FK → User (null for paid pre-webhook) |
| name | String | — |
| email | String | — |
| phone | String | — |
| age | Int? | — |
| gender | String? | — |
| wechatName | String? | — |
| wechatOpenId | String? | — |
| notes | String? | — |
| status | String | `confirmed` \| `pending_payment` |
| stripeSessionId | String? | Unique; set when going through checkout |
| createdAt | DateTime | — |
| *(unique constraint)* | | `(email, eventId)` |

**GalleryImage**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| url | String | — |
| alt | String | — |
| type | String | `image` \| `video` |
| videoUrl | String? | Used when type = `video` |
| tags | String | JSON array (`"[]"` default) |
| createdAt | DateTime | — |

**Sponsor**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| name | String | — |
| logoUrl | String | — |
| description | String | — |
| websiteUrl | String? | — |
| sortOrder | Int | Default 0 |
| isActive | Boolean | Default true |
| createdAt | DateTime | — |

**TeamMember**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| name | String | — |
| role | String | — |
| bio | String? | — |
| avatarUrl | String? | — |
| sortOrder | Int | Default 0 |
| createdAt | DateTime | — |

**Admin**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| email | String | Unique |
| passwordHash | String | bcryptjs |
| createdAt | DateTime | — |

**Inquiry**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| name | String | — |
| email | String | — |
| phone | String? | — |
| inquiryType | String? | General \| Event Booking \| Sponsorship \| Other |
| message | String | — |
| honeypot | String? | Spam guard; rejected server-side if non-empty |
| createdAt | DateTime | — |

**HeroSlide**
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| src | String | Image URL |
| headline | String | — |
| accent | String | Highlighted word in headline |
| subtitle | String | — |
| sortOrder | Int | Default 0 |
| isActive | Boolean | Default true |
| createdAt | DateTime | — |

### 4.2 JSON Array Fields

`Event.galleryImages` and `GalleryImage.tags` are stored as JSON strings in `String` columns. Always use `parseJsonArray()` from `src/lib/types.ts` to deserialise and `JSON.stringify()` to serialise:

```ts
import { parseJsonArray } from "@/lib/types";
const tags = parseJsonArray(image.tags); // → string[]
await prisma.galleryImage.update({ data: { tags: JSON.stringify(newTags) } });
```

---

## 5. Authentication

### 5.1 Admin Authentication

**Flow:**
1. `POST /api/admin/auth` — accepts `{ email, password }`, verifies against `Admin.passwordHash` with `bcryptjs.compare()`, issues HS256 JWT signed with `JWT_SECRET`, set as `admin_token` httpOnly cookie.
2. `DELETE /api/admin/auth` — clears the cookie.

**Route protection pattern** (every admin API route must include):

```ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const cookieStore = await cookies();
const token = cookieStore.get("admin_token")?.value;
if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
```

Admin pages (`/admin/*`) are all `"use client"` — they rely on the cookie being present; redirect to `/admin/login` on 401 responses.

### 5.2 WeChat OAuth (User Authentication)

**Flow:**
1. User clicks the WeChat login button → `WeChatLoginButton.tsx` opens a popup to `/api/auth/wechat/start`.
2. `start` route redirects to WeChat QR OAuth URL.
3. User scans QR → WeChat redirects to `/api/auth/wechat/callback?code=xxx`.
4. `callback` route exchanges the code for user info via WeChat API (`exchangeCodeForUserInfo`), signs a JWT (`wechat_session` cookie, 7-day TTL, httpOnly, SameSite=lax), and renders a minimal HTML page that `postMessage`s `WECHAT_LOGIN_SUCCESS` back to the opener and closes.
5. The opener (`WeChatLoginButton`) receives the message and pre-fills the registration form with `wechatName` and `wechatOpenId`.

**Session JWT payload:**

```ts
{ openId: string; name: string; avatarUrl?: string }
```

**Note:** `/api/auth/wechat/mock` exists for development and **must be disabled or blocked in production**.

---

## 6. API Reference

### 6.1 Public API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/events` | List all events (ordered by `startAt` asc) |
| GET | `/api/gallery` | List all gallery images |
| GET | `/api/hero-slides` | List active hero slides (ordered by `sortOrder`) |
| GET | `/api/sponsors` | List active sponsors |
| POST | `/api/registrations` | Register for a free event |
| POST | `/api/checkout` | Create Stripe Checkout session for a paid event |
| POST | `/api/inquiries` | Submit a contact form inquiry |
| POST | `/api/webhooks/stripe` | Stripe webhook (signature-verified) |
| GET | `/api/auth/wechat/start` | Initiate WeChat OAuth popup flow |
| GET | `/api/auth/wechat/callback` | WeChat OAuth callback |
| POST | `/api/auth/wechat/logout` | Clear WeChat session cookie |

### 6.2 Admin API Routes (all require `admin_token` JWT cookie)

| Method | Path | Description |
|---|---|---|
| POST | `/api/admin/auth` | Admin login |
| DELETE | `/api/admin/auth` | Admin logout |
| GET/POST | `/api/admin/events` | List all / create event |
| PUT/DELETE | `/api/admin/events/[id]` | Update / delete event |
| GET/POST | `/api/admin/gallery` | List all / create gallery item |
| PUT/DELETE | `/api/admin/gallery/[id]` | Update / delete gallery item |
| GET/POST | `/api/admin/hero-slides` | List all / create hero slide |
| PUT/DELETE | `/api/admin/hero-slides/[id]` | Update / delete hero slide |
| GET | `/api/admin/registrations` | List registrations (optional `?eventId=`) |
| GET | `/api/admin/registrations/export` | Download `.xlsx` of all registrations |
| GET/POST | `/api/admin/sponsors` | List all / create sponsor |
| PUT/DELETE | `/api/admin/sponsors/[id]` | Update / delete sponsor |
| GET/POST | `/api/admin/team` | List all / create team member |
| PUT/DELETE | `/api/admin/team/[id]` | Update / delete team member |

### 6.3 Registration Flow (Free Events)

```
POST /api/registrations
Body: { eventId, name, email, phone, age?, gender, wechatName?, wechatOpenId?, notes? }

Checks (in order):
1. Required field validation (eventId, name, email, phone, gender)
2. Email format regex
3. Age range (10–120 if provided)
4. Event exists
5. priceCents === 0 (paid events rejected — use /api/checkout)
6. Capacity check (event.capacity - _count.registrations > 0)
7. Duplicate guard (unique email + eventId)
8. Upsert User (by wechatOpenId first, then email)
9. Create Registration (status: "confirmed")
10. Send confirmation email (non-blocking .catch())

Response: 201 Registration | 400 | 404 | 409
```

### 6.4 Registration Flow (Paid Events)

```
POST /api/checkout
Body: { eventId, name, email, phone, notes? }

1. Validate required fields
2. Fetch event; verify priceCents > 0
3. Capacity check
4. Create Stripe Checkout Session (mode: "payment", currency: "aud")
   - Metadata: { eventId, name, email, phone, notes }
   - successUrl: /events/[slug]/register/success?session_id={CHECKOUT_SESSION_ID}
   - cancelUrl:  /events/[slug]/register/cancel
5. Create Registration with status: "pending_payment", stripeSessionId

Response: { checkoutUrl: string }

POST /api/webhooks/stripe
- Verifies Stripe-Signature header
- On checkout.session.completed + payment_status === "paid":
  → Registration.status = "confirmed" (matched by stripeSessionId)
```

---

## 7. Frontend Architecture

### 7.1 Server vs. Client Components

| Pattern | Rule |
|---|---|
| Public pages | Server Components — fetch directly with `await prisma.*` at render time |
| Admin pages | `"use client"` — fetch via `useEffect` + `fetch("/api/admin/...")` |
| Interactive UI | `"use client"` — only where browser APIs, hooks, or event handlers are needed |
| Prisma | **Never** import in `"use client"` files |

### 7.2 i18n System

All user-visible strings go through the translation system. No hardcoded English strings in JSX.

**Provider:** `LanguageContext.tsx` wraps the entire app in `layout.tsx`. Language preference is persisted to `localStorage`.

**Usage in components:**
```tsx
const { t } = useLanguage();
<h1>{t.nav.events}</h1>
<p>{t.common.spots_left(5)}</p>
```

**Adding new strings:**
1. Add the key to `translations.en` in `src/lib/i18n.ts`.
2. Add the matching key to `translations.zh` — TypeScript will error if missing (the `Translations` type is derived from `translations.en`).

### 7.3 State Management

No global state library. State is co-located:

| Concern | Mechanism |
|---|---|
| Language | `LanguageContext` + `localStorage` |
| Dark/light theme | `localStorage` + `dark` class on `<html>` (injected by inline script to avoid flash) |
| Admin data | `useEffect` fetch on mount, local `useState` |
| Form state | Local `useState` with `"idle" \| "loading" \| "success" \| "error"` pattern |

### 7.4 Forms

- Native `<dialog>` for modals (`RegisterModal.tsx` is the reference implementation).
- `new FormData(e.currentTarget)` in submit handlers.
- Client-side validation before POST; inline error messages (no `alert()`).

### 7.5 Date Handling

All date display uses `src/lib/dates.ts` (timezone: `Australia/Sydney`). Never use `new Date().toLocaleString()` directly.

| Function | Output example |
|---|---|
| `formatTime(date)` | `"7:00 pm"` |
| `formatDate(date)` | `"Sat 14 Jun"` |
| `formatDateLong(date)` | `"Saturday, 14 June 2025"` |
| `getDayName(date)` | `"Sat"` |
| `getDayOfMonth(date)` | `14` |
| `getThisWeekRange()` | `{ start, end }` — Mon–Sun in Sydney time |

### 7.6 Image Handling

Use `next/image` for all images. Allowed remote hostnames in `next.config.ts`:

| Host | Use |
|---|---|
| `images.unsplash.com` | Placeholder/stock images |
| `picsum.photos` | Dev placeholders |
| `res.cloudinary.com` | Production image uploads |
| `drive.google.com` | Google Drive images |
| `lh3.googleusercontent.com` | Google-hosted images |

---

## 8. Styling System

### 8.1 Conventions

- **Tailwind CSS 4 only.** No inline `style={{}}`, no CSS modules.
- **Dark mode is the default.** The `<html>` tag always starts with `class="dark"`. Use `dark:` variants only for light-mode overrides.
- **Noise texture:** The `noise-overlay` class on `<body>` adds film grain — preserve it on new full-page layouts.

### 8.2 Design Tokens (`src/design/tokens.ts`)

| Token | Value |
|---|---|
| `black` | `#0A0A0A` (brand background) |
| `white` | `#FAFAFA` (brand foreground) |
| `gold-500` | `#D4A017` (primary accent) |
| `neutral-*` | 50–900 scale for UI surfaces |
| Font | Inter, system-ui, sans-serif |
| Radius sm | 8px |
| Radius md | 12px |
| Radius lg | 20px |

### 8.3 Component Conventions

| Element | Class pattern |
|---|---|
| Cards | `rounded-lg` (12px) |
| Modals / sheets | `rounded-2xl` (20px) |
| Pills / badges | `rounded-full` |
| Admin sidebar | `w-56 bg-neutral-900` |
| Admin content | `max-w-5xl mx-auto px-8 py-8` |

---

## 9. Email System

Two email functions in `src/lib/email.ts`, both using a reused singleton Nodemailer transporter (Gmail SMTP, STARTTLS port 587):

| Function | Trigger | Recipient |
|---|---|---|
| `sendConfirmationEmail()` | Free registration confirmed | Registrant |
| `sendInquiryNotificationEmail()` | Contact form submitted | `momenta0429@gmail.com` |

Both functions are called **non-blocking** with `.catch(console.error)` — email failure never blocks the HTTP response.

Graceful degradation: if `GMAIL_USER` or `GMAIL_APP_PASSWORD` env vars are absent, the function logs a warning and returns without throwing.

---

## 10. Environment Variables

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URL` | Prisma | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Stripe checkout, email templates | Public base URL |
| `JWT_SECRET` | `jose` — admin JWT | Signing secret |
| `STRIPE_SECRET_KEY` | `src/lib/stripe.ts` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | `/api/webhooks/stripe` | Webhook signature verification |
| `WECHAT_APP_ID` | `src/lib/wechat.ts` | WeChat OAuth |
| `WECHAT_APP_SECRET` | `src/lib/wechat.ts` | WeChat OAuth |
| `WECHAT_SESSION_SECRET` | `src/lib/wechatSession.ts` | User JWT signing |
| `GMAIL_USER` | `src/lib/email.ts` | Gmail sender address |
| `GMAIL_APP_PASSWORD` | `src/lib/email.ts` | Gmail App Password (not account password) |

**Rule:** Never expose secrets via `NEXT_PUBLIC_` prefix. Only `NEXT_PUBLIC_SITE_URL` is client-safe.

---

## 11. Admin Panel

The admin panel lives at `/admin/*`. All pages are `"use client"` components that fetch data on mount.

### 11.1 Sections

| Route | Purpose |
|---|---|
| `/admin` | Dashboard |
| `/admin/events` | Create, edit, delete events |
| `/admin/registrations` | View registrations; filter by event; export to Excel |
| `/admin/gallery` | Upload/manage gallery images and videos |
| `/admin/previous-events` | Manage the homepage Previous Events wall |
| `/admin/hero-slides` | Manage hero carousel slides |
| `/admin/sponsors` | Manage sponsor logos and links |
| `/admin/team` | Manage team member cards |
| `/admin/login` | Admin login (no sidebar) |

### 11.2 Auth Gate

The sidebar layout (`src/app/admin/layout.tsx`) does not itself gate access — individual pages redirect to `/admin/login` when the API returns 401. The `admin_token` cookie is verified on every admin API call.

---

## 12. Sport Types

Defined in `src/lib/types.ts`. Always use constants — never hardcode sport strings.

```ts
type SportTypeValue = "RUNNING" | "HIKING" | "GOLF" | "BJJ" | "YOGA" | "OTHER";

SPORT_LABELS: Record<string, string>  // e.g. { RUNNING: "Running", ... }
SPORT_ICONS:  Record<string, string>  // e.g. { RUNNING: "🏃", ... }
```

---

## 13. Development Commands

```bash
pnpm dev             # Start dev server
pnpm build           # Production build
pnpm lint            # ESLint
pnpm db:migrate      # prisma migrate dev
pnpm db:seed         # prisma db seed
pnpm db:studio       # Prisma Studio GUI
pnpm db:push         # prisma db push (no migration file)
```

After any `schema.prisma` change: `pnpm prisma migrate dev --name <descriptive-name>`.

---

## 14. Security Considerations

| Area | Implementation |
|---|---|
| Admin auth | JWT in httpOnly cookie; not accessible to JS |
| Stripe webhooks | `stripe.webhooks.constructEvent()` signature verification on every call |
| WeChat OAuth | Code exchange happens server-side; no secrets in client |
| Contact form spam | Honeypot field (`Inquiry.honeypot`); rejected server-side if non-empty |
| SQL injection | Prisma ORM — parameterised queries throughout |
| Secrets | All secrets in server-only env vars; `NEXT_PUBLIC_` only for `SITE_URL` |
| Mock WeChat route | `/api/auth/wechat/mock` — must be blocked in production |
| Admin password | bcryptjs hashing; no plaintext storage |

---

*End of Technical Specification*
