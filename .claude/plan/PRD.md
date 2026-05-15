# Product Requirements Document
# Momenta Events Platform

**Version:** 1.0  
**Date:** 2026-05-04  
**Author:** Billy Wang  
**Status:** In Progress

---

## 1. Product Overview

### 1.1 Product Summary

Momenta is a bilingual (English/Chinese) events management platform for a Sydney-based sports and lifestyle events company. The platform serves two audiences: the **public** (event discovery, registration, gallery, contact) and **admins** (event management, registration tracking, content management).

The platform is built on **Next.js 16 (App Router)**, **PostgreSQL via Prisma**, **Tailwind CSS 4**, with **WeChat OAuth**, **Stripe payments**, and **Gmail/Nodemailer** email delivery.

### 1.2 Product Goals

1. Convert website visitors into event registrants through a clear, mobile-first UX.
2. Reduce admin overhead through a fully self-service admin panel with bilingual support.
3. Build brand credibility via polished gallery, team, and social integration.
4. Expand revenue through payment-gated event registration.

### 1.3 User Personas

| Persona | Description | Primary Goals |
|---|---|---|
| **Chinese-speaking attendee** | WeChat-native, limited English, mobile-first | Discover events in Chinese, register via WeChat login, pay seamlessly |
| **English-speaking attendee** | Local Sydney resident, desktop or mobile | Browse events by calendar, register with email, get confirmation |
| **Momenta Admin** | Non-technical staff managing events day-to-day | Add/edit events in Chinese or English, view registrations, manage gallery |
| **Momenta Owner** | Business owner overseeing operations | Export registrations, monitor inquiries, manage payments |

---

## 2. Current Implementation Status

The following features from the development plan are **already implemented** as of this PRD:

| Feature | Status | Key Files |
|---|---|---|
| WeChat OAuth Login | ✅ Done | `src/components/WeChatLoginButton.tsx`, `src/app/api/auth/wechat/` |
| Admin i18n (EN/ZH toggle) | ✅ Done | `src/lib/i18n.ts`, `src/components/LanguageContext.tsx` |
| Stripe Payment Integration | ✅ Done | `src/app/api/checkout/`, `src/app/api/webhooks/stripe/` |
| Registration Email (Nodemailer) | ✅ Done | `src/app/api/registrations/route.ts` |
| Gallery (photos + videos) | ✅ Done | `src/components/GalleryGrid.tsx` |
| Team Member Admin CRUD | ✅ Done | `src/app/admin/team/`, Prisma `TeamMember` model |
| Instagram Showcase | ✅ Done | `src/components/HomeInstagramShowcase.tsx` |
| Monthly Calendar View | ✅ Done | `src/app/calendar/` |
| Contact Form (basic) | ✅ Done | `src/components/ContactForm.tsx` |
| Hero Slide Carousel | ✅ Done | `src/components/HomeHeroCarousel.tsx` |
| Event Registration Modal | ✅ Done | `src/components/RegisterModal.tsx` |
| Previous Events Wall | ✅ Done | `src/components/PreviousEventsWall.tsx` |

---

## 3. Feature Requirements

---

### EPIC 1 — Contact Us Page Update

**Priority:** High (Phase 1)  
**Status:** Partial — form exists, needs redesign

#### 1.1 Goals
- Display all company contact information clearly.
- Provide a professional, validated inquiry form.
- Ensure full mobile responsiveness.

#### 1.2 Contact Information to Display

| Type | Value |
|---|---|
| Email | momenta0429@gmail.com |
| Location | Sydney, Australia |
| Instagram | @momenta_events_group |
| WeChat | anc1140560182 |
| Response Time | Within 24–48 hours |

#### 1.3 Functional Requirements

**FR-1.1** The Contact Us page MUST display a visual contact info block with icons for email, location, WeChat, Instagram, and response time.

**FR-1.2** The inquiry form MUST include the following fields:
- Full Name (required)
- Email Address (required, format-validated)
- Phone Number (optional)
- Inquiry Type (dropdown: General, Event Booking, Sponsorship, Other)
- Message (required, multi-line)

**FR-1.3** The form MUST perform client-side validation before submission (required fields, email format).

**FR-1.4** On successful submission, the form MUST display a success confirmation message inline without a page refresh.

**FR-1.5** On submission failure, the form MUST display a user-friendly error message.

**FR-1.6** The backend API endpoint (`POST /api/inquiries`) MUST save submissions to the `Inquiry` database table AND send an email notification to `momenta0429@gmail.com`.

**FR-1.7** The page layout MUST be a two-column grid (contact info left, form right) on desktop, and stacked single-column on mobile.

**FR-1.8** All text on the Contact Us page MUST be translatable via the existing i18n system (`src/lib/i18n.ts`).

#### 1.4 Non-Functional Requirements

- The page must render correctly on iPhone SE (375px) and above.
- Honeypot spam protection must be preserved.

---

### EPIC 2 — User Authentication (WeChat OAuth)

**Priority:** High (Phase 1)  
**Status:** ✅ Implemented — no further action required

#### 2.1 Summary

WeChat OAuth login is fully implemented. Users can log in via WeChat on the frontend; the backend handles the OAuth callback, creates or retrieves a user record, and issues a JWT session stored in an httpOnly cookie.

#### 2.2 Remaining Consideration

- Verify that the WeChat mock login (`/api/auth/wechat/mock`) is disabled in production builds.
- Confirm `WECHAT_APP_ID` and `WECHAT_APP_SECRET` are set in the production environment.

---

### EPIC 3 — Admin Multi-Language System

**Priority:** High (Phase 1)  
**Status:** ✅ Implemented — no further action required

#### 3.1 Summary

The full-site i18n system is implemented using a custom React context (`LanguageContext`). Language state is persisted to `localStorage`. All static text in the admin and public site should use the `useLanguage()` hook.

#### 3.2 Remaining Consideration

- Audit any newly added admin pages or components to confirm all strings pass through the `t()` translation function.
- Verify Chinese translations in `src/lib/i18n.ts` are complete and accurate for all admin panel sections.

---

### EPIC 4 — Event Module Frontend Redesign

**Priority:** Medium (Phase 3)  
**Status:** Partial — calendar exists, filter bar and two-column layout need work

#### 4.1 Feature 4.1 — Remove Existing Filters

**FR-4.1.1** The `FilterBar` component (`src/components/FilterBar.tsx`) and all its related state logic MUST be removed from the Events page (`src/app/events/page.tsx`).

**FR-4.1.2** Events displayed on the `/events` page should default to chronological order without filter controls.

#### 4.2 Feature 4.2 — Monthly Calendar Navigation

**Status:** Partial — `/calendar` page exists but may need enhancement

**FR-4.2.1** The calendar MUST display the current month as a standard grid (Sun–Sat or Mon–Sun, configurable).

**FR-4.2.2** The calendar MUST include left/right arrow buttons to navigate between months.

**FR-4.2.3** Dates containing events MUST be visually highlighted (dot indicator or background color).

**FR-4.2.4** Clicking a highlighted date MUST load that date's event details in the right panel.

#### 4.3 Feature 4.3 — Two-Column Event Page Layout

**FR-4.3.1** The Events page MUST render a two-column layout on desktop:
- **Left column:** Monthly calendar with navigation arrows.
- **Right column:** Event detail panel for the selected date.

**FR-4.3.2** The event detail panel MUST display:
- Event name
- Event time (start and end)
- Event location
- Headcount limit
- Event fee (or "Free" if no charge)

**FR-4.3.3** On mobile, the layout MUST stack vertically — calendar on top, detail panel below.

**FR-4.3.4** All text in the two-column layout MUST be translatable via the i18n system.

---

### EPIC 5 — Event Admin Bug Fixes

**Priority:** High (Phase 1)  
**Status:** Pending

#### 5.1 Feature 5.1 — Description Word Wrap Fix

**FR-5.1.1** In the admin events table, the description column MUST apply `word-break: break-word` and `white-space: normal` CSS to prevent layout overflow.

**FR-5.1.2** A `max-width` constraint SHOULD be applied to the description column cell.

#### 5.2 Feature 5.2 — Start Time / End Time Save Bug

**FR-5.2.1** The event creation and edit forms MUST correctly serialize datetime values including timezone offset before sending to the backend.

**FR-5.2.2** The backend DTO MUST parse and store datetime values in UTC.

**FR-5.2.3** The frontend display of event times MUST convert UTC to Sydney local time (AEST/AEDT, `Australia/Sydney` timezone).

**Debugging Checklist:**
1. Inspect datetime picker output format in `src/app/admin/events/`.
2. Inspect API payload in the POST/PUT request body.
3. Inspect Prisma `Event` model for `startTime` / `endTime` field types (`DateTime`).
4. Confirm timezone is preserved in the DB and recovered correctly on read.

---

### EPIC 6 — Registration & Payment Flow

**Priority:** High (Phase 2)  
**Status:** Partial — email and Stripe exist; extra fields and full flow need validation

#### 6.1 Feature 6.1 — Registration Confirmation Email

**Status:** ✅ Implemented

**Remaining Consideration:** Verify the HTML email template includes all required fields (attendee name, event name, date/time, venue, payment summary).

#### 6.2 Feature 6.2 — Payment Integration

**Status:** ✅ Stripe implemented

**Remaining Consideration:**
- Verify `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are set in production.
- Verify the webhook at `/api/webhooks/stripe` correctly updates `Registration.paymentStatus` on successful charge.
- Test the end-to-end flow: Register → Stripe Checkout → Webhook → Status Update → Confirmation Email.

#### 6.3 Feature 6.3 — Registration Form Extra Fields

**FR-6.3.1** The registration form (`src/components/RegisterModal.tsx`) MUST include:
- **Interested Event Type** — multi-select or dropdown (options: Running, Hiking, Golf, BJJ, Yoga, Other)
- **Age Range** — dropdown (e.g., 18–25, 26–35, 36–45, 46–55, 55+)

**FR-6.3.2** The Prisma `Registration` schema MUST be updated to store these new fields.

**FR-6.3.3** The `POST /api/registrations` backend DTO MUST accept and validate the new fields.

**FR-6.3.4** The admin registrations view (`/admin/registrations`) MUST display these fields in the table and include them in the Excel export.

**FR-6.3.5** All new field labels MUST be translatable via the i18n system.

---

### EPIC 7 — Gallery Management Upgrade

**Priority:** Medium (Phase 4)  
**Status:** Partial — video support exists; accordion grouping and featured checkbox need work

#### 7.1 Feature 7.1 — Gallery Video Support

**Status:** ✅ Implemented — `GalleryGrid` renders video players for video MIME types.

#### 7.2 Feature 7.2 — Featured Checkbox Refactor

**FR-7.2.1** In the admin gallery management UI, the `featured` field MUST be rendered as a boolean checkbox, not a text input or select.

**FR-7.2.2** The Prisma `GalleryImage.featured` field MUST be a `Boolean` type (verify schema).

#### 7.3 Feature 7.3 — Event Name Accordion Grouping

**FR-7.3.1** Gallery items MUST support an optional `eventName` relation field linking them to an event.

**FR-7.3.2** The public gallery page MUST group images by event name and render each group inside a collapsible accordion component.

**FR-7.3.3** Each accordion group header MUST display the event name and image count.

**FR-7.3.4** Accordion groups MUST be expanded by default and collapsible on click.

---

### EPIC 8 — Team Page

**Priority:** Low (Phase 4)  
**Status:** ✅ Admin CRUD implemented — public-facing page needs verification

#### 8.1 Data Model

The `TeamMember` Prisma model is already defined with:
- `name`, `title`, `photo`, `bio`, `displayOrder`

#### 8.2 Functional Requirements

**FR-8.1** The public-facing Team section MUST render all active team members from the database in a responsive card layout.

**FR-8.2** Cards MUST display: photo, name, title, and bio.

**FR-8.3** Cards MUST be sorted by `displayOrder` ascending.

**FR-8.4** The Team section MUST be accessible from the main navigation or About page.

**FR-8.5** All static labels in the Team section MUST be translatable via the i18n system.

---

### EPIC 9 — Event Detail Page Improvement

**Priority:** Medium (Phase 3)  
**Status:** Pending

#### 9.1 Feature 9.1 — Full Poster Banner Display

**FR-9.1.1** The `Event` Prisma model MUST include a `posterImage` field (`String?` URL).

**FR-9.1.2** The admin event editor MUST include a poster image upload/URL field.

**FR-9.1.3** The public event detail page MUST render the poster image as a full-width banner at the top of the page, above event details.

**FR-9.1.4** If no poster image is set, the banner area MUST fall back to a styled placeholder or the event's cover image.

---

### EPIC 10 — Instagram Integration

**Priority:** Low (Phase 4)  
**Status:** ✅ Implemented — `HomeInstagramShowcase.tsx` and `src/lib/instagram.ts` exist

#### 10.1 Remaining Consideration

- Verify the Instagram API token in `.env` is set and not expired (Instagram tokens expire after ~60 days without refresh).
- Add a token refresh mechanism or a fallback static display if the API is unavailable.
- Confirm the "Follow Us" button links to `https://instagram.com/momenta_events_group`.

---

## 4. Technical Constraints

| Constraint | Detail |
|---|---|
| Framework | Next.js 16 App Router — all pages use server components by default; client state requires `"use client"` |
| Database | PostgreSQL via Prisma ORM — all schema changes require a migration (`npx prisma migrate dev`) |
| Auth | Admin: JWT in httpOnly cookie. User: WeChat JWT session |
| Styling | Tailwind CSS 4 — use design tokens from `src/design/tokens.ts`; avoid inline styles |
| i18n | All user-visible strings must use the `t()` function from `useLanguage()` hook; new keys go in `src/lib/i18n.ts` |
| Image Hosting | Remote images must be from allowed domains in `next.config.ts` (Cloudinary, Google Drive, Unsplash) |
| Payments | Stripe only — no other payment gateways |
| Email | Gmail SMTP via Nodemailer |

---

## 5. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Mobile Responsiveness | All pages must render correctly at 375px width and above |
| Page Load Time | Core Web Vitals LCP < 2.5s on mobile (3G simulated) |
| Accessibility | All interactive elements must have ARIA labels; form errors must be announced to screen readers |
| Security | No secrets in client-side code; all admin routes protected by JWT middleware; honeypot on public forms |
| Browser Support | Chrome, Safari, Firefox — last 2 major versions |

---

## 6. Success Metrics

| Metric | Target |
|---|---|
| Contact form submission rate | > 5% of contact page visitors |
| Event registration conversion | > 15% of event detail page visitors |
| Admin task completion time | Admin can create a new event in < 3 minutes |
| Mobile usage | Page usability score > 90 on Lighthouse mobile audit |
| Language switch usage | Track % of sessions where language is toggled to Chinese |

---

## 7. Phased Delivery Plan

### Phase 1 — Business Foundation (Now)
| Epic | Feature | Status |
|---|---|---|
| 1 | Contact Us Redesign | Pending |
| 2 | WeChat Login | ✅ Done |
| 3 | Admin i18n | ✅ Done |
| 5 | Event Admin Bug Fixes | Pending |

### Phase 2 — Conversion System
| Epic | Feature | Status |
|---|---|---|
| 6.1 | Registration Email | ✅ Done |
| 6.2 | Payment Integration | ✅ Done (verify) |
| 6.3 | Registration Form Extra Fields | Pending |

### Phase 3 — Event Experience
| Epic | Feature | Status |
|---|---|---|
| 4 | Calendar Redesign & Two-Column Layout | Partial |
| 9 | Event Detail Poster Banner | Pending |

### Phase 4 — Branding & Content
| Epic | Feature | Status |
|---|---|---|
| 7.2 | Gallery Featured Checkbox Refactor | Pending |
| 7.3 | Gallery Accordion Grouping | Pending |
| 8 | Team Page (public) | Verify |
| 10 | Instagram Integration | ✅ Done (verify token) |

---

## 8. Open Questions

| # | Question | Owner |
|---|---|---|
| 1 | Is the WeChat App ID approved for the Sydney audience (Overseas WeChat OAuth requires additional approval)? | Billy |
| 2 | What Inquiry Types should appear in the Contact Us dropdown? | Billy |
| 3 | Should the Events page retain any filtering at all, or remove completely? | Billy |
| 4 | What age range buckets are preferred for the registration form? | Billy |
| 5 | Should gallery accordion groups be ordered by event date or alphabetically? | Billy |
| 6 | Is there a refresh token flow for the Instagram API or is manual renewal acceptable? | Billy |

---

*End of PRD*
