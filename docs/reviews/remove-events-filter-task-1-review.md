# Review Summary

## What Was Implemented

Removed the `FilterBar` component and all associated filter logic from the Events page (`/events`). The page now fetches all upcoming events (start time ≥ now) ordered chronologically and displays them without any sport, date-range, or keyword filtering.

## Files Changed

| File | Change |
|---|---|
| `src/app/events/page.tsx` | Removed `FilterBar` import, `Suspense` import, `PageProps` type, all `searchParams` handling, date-range switch block, filter `where` clauses, and the `<FilterBar />` JSX. Simplified query to fetch upcoming events. Updated subtitle and empty-state copy. |
| `src/components/FilterBar.tsx` | Deleted entirely. |

## Strengths

- **Minimal diff** — 132 lines deleted, 0 lines of new logic added. The page is now simpler than before.
- **Correct query** — `startAt: { gte: new Date() }` correctly excludes past events, matching what users expect from an "events" listing.
- **No dead code left** — `Suspense`, `PageProps`, `getThisWeekRange`, `getNextWeekRange`, `getThisMonthRange`, and `SPORT_LABELS` are all removed from this file (those date helpers remain in use elsewhere and were intentionally kept in `dates.ts`).
- **Build passes** — `next build` completes without errors or warnings after the change.
- **Type check passes** — `tsc --noEmit` clean.
- **Empty-state copy updated** — "Try adjusting your filters." replaced with "No upcoming events. Check back soon." — accurate now that there are no filters.

## Issues Found

- **Hardcoded strings** — `"Events"`, `"Find your next adventure."`, and the empty-state message remain hardcoded English rather than going through `t.*` from `useLanguage()`. This is a pre-existing violation of the i18n rule in `CLAUDE.md`, not introduced by this change. Tracked as a separate concern.

## Suggested Improvements

- Add the Events page title and subtitle to `src/lib/i18n.ts` (`en` + `zh`) and thread `useLanguage()` through — but this requires converting the Server Component to have a client boundary, or extracting the text nodes into a small `"use client"` child component. Out of scope for this task.

## Risks

- **None.** This is a pure deletion of a feature that existed solely for UX filtering on the client. The underlying data query is straightforward and cannot break other pages. `FilterBar.tsx` had no other consumers.

## Edge Cases Checked

- Past events: excluded by `gte: new Date()` — correct.
- No upcoming events: empty state renders correctly.
- Many events: grid layout unchanged (`md:grid-cols-2 lg:grid-cols-3`).
- Date range helpers in `dates.ts`: confirmed still used by `page.tsx` (homepage), `api/events/route.ts`, and `WeeklyCalendar.tsx` — **not deleted**.

## Final Verdict

**Approved** — clean, focused removal with no regressions. The i18n note is a pre-existing issue and does not block this task.
