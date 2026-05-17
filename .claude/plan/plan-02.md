## Plan: Multilingual + Admin + UX Improvements (Plan 02)

TL;DR — Add full translation support, improve contact email flow, make WeChat name read-only, improve event and gallery UX, and align several admin edit interactions. Roll out via a Neon test branch + Vercel preview and small, reviewable commits.

### Steps
1. Add translation keys and wiring
   - Add missing i18n keys across `src/app/` pages and components
   - Update `src/lib/i18n.ts` translations for `en` and `zh`
   - Add admin UI to edit translated content (DB schema changes may be required)
2. Contact form email integration
   - Update `/api/inquiries/route.ts` to send email to `momenta0429@gmail.com` with sender name, sender email, message content, and timestamp
   - Use non-blocking send via `src/lib/email.ts` helper
3. Make `WeChat Name` read-only
   - Make field UI read-only in admin forms and ignore client-side edits server-side
4. Event detail page improvements
   - Render full poster/banner at top of `src/app/events/[slug]/page.tsx`
   - Preserve admin-entered line breaks in description (use `whitespace-pre-wrap` or safe rendering)
5. Admin event list simplification
   - Remove description preview from `src/app/admin/events/page.tsx`
6. Gallery page video support
   - Render `<video>` when `type === 'video'` and `videoUrl` is present
   - Ensure admin create/edit supports `videoUrl`
7. Hero Slides: inline edit UX
   - Refactor `src/app/admin/hero-slides/*` to use inline expansion (reuse gallery pattern)
8. Sponsors: 2-column layout + inline edit
   - Update `src/app/admin/sponsors/page.tsx` layout and inline edit behaviour
9. Team: inline edit UX
   - Update `src/app/admin/team/*` to match gallery inline editing pattern

### Tasks Table
| # | Task | Files / Areas | Status |
|---:|---|---|---|
| 1 | Translation: add keys + admin editing | `src/lib/i18n.ts`, `src/app/**`, `src/app/admin/**` | Not started |
| 2 | Contact form → send email to momenta0429@gmail.com | `src/app/api/inquiries/route.ts`, `src/lib/email.ts`, env | Done |
| 3 | Make WeChat Name read-only | `src/lib/wechatSession.ts`, admin registration forms | Not started |
| 4 | Event detail: full banner + preserve line breaks | `src/app/events/[slug]/page.tsx`, `globals.css` | Not started |
| 5 | Admin event list: remove description preview | `src/app/admin/events/page.tsx` | Not started |
| 6 | Gallery: support videos rendering | `src/app/gallery/page.tsx`, `src/components/GalleryGrid.tsx`, `src/app/api/admin/gallery/route.ts` | Not started |
| 7 | Hero Slides: inline edit UX like Gallery | `src/app/admin/hero-slides/page.tsx` | Not started |
| 8 | Sponsors: 2-column + inline edit | `src/app/admin/sponsors/page.tsx` | Not started |
| 9 | Team: inline edit UX like Gallery | `src/app/admin/team/page.tsx` | Not started |

### Relevant files
- `src/lib/i18n.ts` — add keys and translations
- `src/app/api/inquiries/route.ts` — email sending
- `src/lib/email.ts` — email helper, ensure non-blocking send
- `src/app/gallery/page.tsx` + `src/app/admin/gallery` — video support + admin changes
- `src/app/events/[slug]/page.tsx` — event poster + description formatting
- `src/app/admin/*` — hero-slides, sponsors, team, events admin pages

### Verification
1. Type-check: `pnpm tsc --noEmit` passes; new translation keys exist in both locales.
2. Local test: run `pnpm dev`, exercise contact form (use test SMTP or staging Gmail), create gallery video item and confirm `<video>` renders.
3. Staging: create Neon test branch, run `pnpm prisma migrate deploy`, deploy to Vercel preview and confirm no P2022 errors.
4. Manual QA: admin create/edit translated content, event description rendering, gallery video playback, and inline edits for Hero/Sponsors/Team.

### Decisions & assumptions
- All visible strings must use the i18n `t.*` system and keys live in `src/lib/i18n.ts` with matching `en` and `zh` objects.
- Email sending uses existing Nodemailer helper; set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in Vercel/env.
- WeChat name is read-only at UI and server levels.
- Gallery videos are stored in `videoUrl` and indicated by `type === 'video'`.

### Further considerations
1. Translation storage strategy: per-field locale columns (e.g. `title_en`/`title_zh`) vs JSON per-field — decide before schema changes.
2. For staging emails prefer Mailtrap or similar to avoid sending live emails during QA.

---

Generated and saved as `.claude/plan/plan-02.md`.
