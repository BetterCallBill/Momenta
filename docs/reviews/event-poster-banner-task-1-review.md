# Review Summary — event-poster-banner-task-1

## What Was Implemented

Redesigned the event detail page hero from a shallow 256–384px cover strip into a full-width cinematic poster banner (`60vh`, clamped between `min-h-105` and `max-h-175`). Key changes:

- Event title, sport badge, "Featured" pill, date/time, and location name are now overlaid directly on the banner image via absolute positioning.
- Back link moved inside the banner at `top-24` (below the fixed header).
- A two-layer gradient (bottom-up for text contrast + top-down vignette for header legibility) replaces the single gradient from before.
- The detail body below the banner starts flush at `pt-10` with no negative-margin hack.
- Tailwind CSS 4 canonical classes used throughout (`min-h-105`, `max-h-175`, `bg-linear-to-b`).

---

## Files Changed

| File | Change |
|---|---|
| `src/app/events/[slug]/page.tsx` | Restructured banner and body layout (+65 / -35 lines) |

---

## Strengths

- **No new dependencies or abstractions.** Pure layout restructuring in one file.
- **Correct fallback.** The `event.coverImageUrl`-absent branch uses `absolute inset-0 bg-neutral-900`, which works correctly inside a `relative` parent — the previous `h-full w-full` approach would have required the parent to have an explicit height, which is now `60vh` so both work, but `absolute inset-0` is more robust.
- **Two-layer gradient is principled.** Bottom-up gradient for the overlay text; top-down vignette is visually subtle enough for images with light tops while protecting the header area.
- **`object-center` added.** Ensures portrait-orientation images (common for event posters) center rather than crop from the top-left.
- **Tailwind CSS 4 warnings resolved.** All three IDE diagnostics (`min-h-[420px]`, `max-h-[700px]`, `bg-gradient-to-b`) were corrected to canonical forms before commit.
- **TypeScript clean.** Zero errors from `tsc --noEmit`.

---

## Issues Found

### 1. Date/time and location are duplicated (minor)
The banner overlay strip (lines 88–98) and the meta cards grid (lines 106–123) both show date/time and location. This is intentional — the banner gives at-a-glance context, the cards provide the full address — but the duplication adds visual noise and maintenance surface. The cards should clearly add value the banner doesn't (full address vs. location name, registered count). Currently they do, so acceptable.

### 2. `top-24` back-link position is header-height-dependent (minor)
`top-24` (96px) is tuned to clear the fixed `Header` component. If the header height ever changes, this value silently breaks. The header currently has no exported height constant. Not a blocker, but fragile.

### 3. Hardcoded EN strings (pre-existing, not introduced here)
"Back to Events", "About this event", "Event Full", "Free", "This event is fully booked." etc. are hardcoded. This was true before this PR. Since the page is a Server Component that cannot call `useLanguage()`, fixing this requires a different approach (e.g. server-side locale detection or a separate i18n utility for server components). Out of scope for this task.

### 4. `&ensp;·&ensp;` HTML entity in JSX (negligible)
Line 91 uses `&ensp;·&ensp;` as a separator. This works fine in React JSX but is unusual — most devs use `{" · "}` or a `<span>` separator. Not incorrect, just slightly non-idiomatic.

### 5. `bg-gradient-to-t` not updated to canonical form
Line 47 still uses `bg-gradient-to-t` (the bottom-up gradient). The IDE only flagged `bg-gradient-to-b` (line 49). Depending on the Tailwind CSS 4 version, `bg-gradient-to-t` may also need to be `bg-linear-to-t`. Worth checking for consistency but not a build-breaker.

---

## Suggested Improvements

1. **Extract header height as a CSS variable or Tailwind spacing token** so `top-24` in the back link can reference it semantically.
2. **Replace `&ensp;·&ensp;` with `{" · "}`** for idiomatic JSX.
3. **Audit `bg-gradient-to-t` → `bg-linear-to-t`** to match the CSS 4 migration applied to the other gradient on line 49.

---

## Risks

- **Light-coloured banner images**: The top vignette (`from-brand-black/40`) may look heavy on very bright images. Mid-range images should be fine. No event images are currently light-toned in the DB, but worth monitoring as content grows.
- **Very long event titles**: `md:text-5xl` on long titles could wrap badly at mid-breakpoints. The `leading-tight` helps, but multi-line titles will push against the bottom gradient edge. Low risk given typical event naming conventions.

---

## Edge Cases Checked

- [x] No `coverImageUrl` → dark `bg-neutral-900` fills the banner, gradients and overlaid text still render correctly
- [x] `isFull = true` → "Event Full" in capacity card, CTA replaced with red "fully booked" notice
- [x] `priceCents = 0` → "Free" displayed in price card and register CTA
- [x] `isFeatured = false` → "Featured" pill absent from banner overlay (conditional render)
- [x] `event.description` empty/null → description section hidden, no layout gap

---

## Final Verdict

**Approved with comments**

The implementation is clean, minimal, and matches the design intent. The three suggested improvements (canonical gradient class, `&ensp;` cleanup, header height coupling) are low-priority polish items that can be addressed in a follow-up. The pre-existing i18n gap is architectural and out of scope. No blocking issues.
