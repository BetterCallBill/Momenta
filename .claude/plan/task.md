# Task List — Momenta Events Platform

> Sorted by priority (High → Medium → Low), then phase. Last updated: 2026-05-14.

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
| 14 | Events page — two-column layout (calendar left, detail panel right) | 4.3 | 3 | Medium | ⏳ Pending | New responsive grid; event detail panel shows name, time, location, capacity, fee |
| 15 | Event detail page — full-width poster banner | 9.1 | 3 | Medium | ⏳ Pending | Add `posterImage` field to `Event` schema; render as banner above details |
| 16 | Gallery admin — replace featured text input with boolean checkbox | 7.2 | 4 | Low | ⏳ Pending | `admin/gallery/page.tsx` UI change; verify `GalleryImage.featured` schema type |
| 17 | Gallery — group images by event name in accordion layout | 7.3 | 4 | Low | ⏳ Pending | Add `eventName` relation to `GalleryImage`; accordion component on public gallery |
| 18 | Team public page — verify responsive card layout renders correctly | 8.1 | 4 | Low | 🔍 Verify | Admin CRUD done; confirm public `/about` or team route displays members sorted by `sortOrder` |
| 19 | Instagram feed — verify API token not expired; add fallback | 10.1 | 4 | Low | 🔍 Verify | Token expires ~60 days; confirm "Follow Us" links to `@momenta_events_group` |

---

## Summary by Status

| Status | Count |
|---|---|
| ✅ Done | 11 |
| 🔍 Verify | 4 |
| ⏳ Pending | 4 |
| **Total** | **19** |

---

## Next Up (Medium Priority)

1. **Task 14** — Events page two-column layout (calendar left, detail panel right)
2. **Task 15** — Event detail page: full-width poster banner (`posterImage` field)
