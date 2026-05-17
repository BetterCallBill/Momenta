# Task List — Momenta Events Platform

> Sorted by priority (High → Medium → Low), then phase. Last updated: 2026-05-17.

---

## Legend

| Status | Meaning |
|---|---|
| ✅ Done | Implemented and merged |
| 🔍 Verify | Implemented but needs production/smoke test |
| 🔄 In Progress | Partially complete |
| ⏳ Pending | Not yet started |

---

## Task Table

| # | Task | Epic | Phase | Priority | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | Contact Us page redesign — correct contact data, icons, info-left layout | 1.1 | 1 | High | ✅ Done | Merged via feature/contact-us-redesign-task-1 |
| 2 | Contact form — add Phone + Inquiry Type fields, full i18n | 1.1 | 1 | High | ✅ Done | `ContactForm.tsx`, `i18n.ts` updated |
| 3 | Inquiry API — accept new fields, send notification email to business | 1.1 | 1 | High | ✅ Done | `api/inquiries/route.ts` + `email.ts` |
| 4 | WeChat OAuth login — popup flow, JWT session cookie | 2.1 | 1 | High | ✅ Done | `api/auth/wechat/*`, `WeChatLoginButton.tsx` |
| 5 | Disable WeChat mock login route in production | 2.1 | 1 | High | 🔍 Verify | `/api/auth/wechat/mock` must be blocked in prod |
| 6 | Admin panel i18n — EN/ZH toggle, all strings translated | 3.1 | 1 | High | ✅ Done | `LanguageContext.tsx`, `i18n.ts` |
| 7 | Admin events table + event detail page — fix description word wrap and line break display | 5.1 | 1 | High | ✅ Done | `wrap-break-word whitespace-pre-wrap max-w-64` on admin table cell; `whitespace-pre-wrap` on public detail `<p>` |
| 8 | Admin events form — fix start/end time timezone serialization bug | 5.2 | 1 | High | ✅ Done | `toSydneyDatetime()` for read, `sydneyLocalToISO()` for write; `formatDate` now uses `SYDNEY_TZ` |
| 9 | Registration confirmation email | 6.1 | 2 | High | ✅ Done | `email.ts` `sendConfirmationEmail()` |
| 10 | Stripe payment integration — Checkout Session + webhook | 6.2 | 2 | High | 🔍 Verify | Verify `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` set in prod; test end-to-end |
| 11 | Registration form — add Interested Event Type + Age Range fields | 6.3 | 2 | High | ✅ Done | `ageRange` + `interestedEventTypes` on `Registration`; age range dropdown + sport type checkboxes in `RegisterForm.tsx`; admin table + XLSX export updated |
| 12 | Remove filter bar from Events page | 4.1 | 3 | Medium | ✅ Done | Merged via feature/remove-events-filter-task-1; deleted `FilterBar.tsx`, simplified query to upcoming events chronologically |
| 13 | Calendar — enhance monthly grid with event dot indicators | 4.2 | 3 | Medium | ✅ Done | Merged via feature/monthly-calendar-dots-task-1; sport-colored dots (sky/emerald/lime/red/violet/gold), max 3 + overflow count, Sydney timezone fix |
| 14 | Events page — two-column layout (calendar left, detail panel right) | 4.3 | 3 | Medium | ✅ Done | Merged via feature/events-two-column-task-1; EventsBrowser client component with interactive mini-calendar + EventDetailCard panel |
| 15 | Event detail page — full-width poster banner | 9.1 | 3 | Medium | ✅ Done | Merged via feature/event-poster-banner-task-1; 60vh cinematic banner with overlaid title, sport badge, date/time, location |
| 16 | Gallery admin — replace featured text input with boolean checkbox | 7.2 | 4 | Low | ✅ Done | Merged via feature/gallery-featured-checkbox-task-1; "Show on homepage" checkbox in add + edit forms; buildTags() merges state into tags JSON array |
| 17 | Gallery — group images by event name in accordion layout | 7.3 | 4 | Low | ✅ Done | Merged via feature/gallery-event-name-task-1 + feature/gallery-accordion-task-2 |
| 18 | Team public page — verify responsive card layout renders correctly | 8.1 | 4 | Low | 🔍 Verify | Admin CRUD done; confirm public `/about` or team route displays members sorted by `sortOrder` |
| 19 | Instagram feed — verify API token not expired; add fallback | 10.1 | 4 | Low | 🔍 Verify | Token expires ~60 days; confirm "Follow Us" links to `@momenta_events_group` |
| 20 | Translation: add i18n keys + wire Footer, EventsBrowser, HomeContactForm | 11.1 | 5 | Medium | ✅ Done | Merged via feature/translation-keys-task-1; events.*, footer.quick_links/follow_us, home.contact_*, contact.form_optional added (en + zh) |
| 21 | Translation: wire About page (server/client split) | 11.2 | 5 | Medium | ⏳ Pending | Extract AboutPageClient; add about.* i18n keys |
| 22 | Translation: wire event detail page (server/client split) | 11.3 | 5 | Medium | ⏳ Pending | Extract EventDetailClient; add event detail i18n keys |
| 23 | Translation: admin editing UI (SiteContent DB model) | 11.4 | 5 | Medium | ⏳ Pending | Prisma SiteContent model, admin API routes, /admin/translations page |
| 24 | Admin Enquiries page — list all contact form submissions | 1.2 | 1 | Medium | ✅ Done | Merged via feature/admin-enquiries-task-24; `GET /api/admin/enquiries` + `/admin/enquiries/page.tsx`; name, email, phone, type, message (truncated), Sydney timestamp; sidebar nav entry |

---

## Summary by Status

| Status | Count |
|---|---|
| ✅ Done | 17 |
| 🔍 Verify | 4 |
| ⏳ Pending | 3 |
| **Total** | **24** |

---

## Next Up

1. **Task 21** — Translation: wire About page (server/client split + i18n)
2. **Task 22** — Translation: wire event detail page
3. **Task 23** — Translation: admin editing UI (SiteContent model)
