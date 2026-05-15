# Review Summary

## What Was Implemented

Replaced the Events page card grid (3-col `EventCard` layout with `FilterBar`) with a two-column responsive layout: a compact interactive monthly calendar on the left and an event detail panel on the right. Clicking a calendar day filters the right panel to show that day's events; the default state shows all upcoming events. Month navigation arrows advance or retreat the calendar view, clearing the selection. On screens below `lg` (1024px), the columns stack vertically.

Also forward-ported `SPORT_DOT_COLORS` from the prior `feature/monthly-calendar-dots-task-1` branch (not yet merged into master) since `EventsBrowser` depends on it.

## Files Changed

| File | Change |
|---|---|
| `src/app/events/page.tsx` | Stripped FilterBar, EventCard grid, searchParams, and date-range logic; now renders `<EventsBrowser events={events} />` |
| `src/components/EventsBrowser.tsx` | New "use client" component — calendar + detail panel |
| `src/lib/types.ts` | Added `SPORT_DOT_COLORS` export |

## Strengths

- **Clean server/client split** — `events/page.tsx` stays a Server Component; all interactivity lives in `EventsBrowser`. Consistent with CLAUDE.md architecture rules.
- **No new API route needed** — all upcoming events are fetched once at render time and filtered client-side. Zero extra network round trips on interaction.
- **Reuses existing primitives** — `SPORT_ICONS`, `SPORT_DOT_COLORS`, `SPORT_LABELS`, `formatDate`, `formatTime`, `EventWithCount` — no duplication.
- **Sydney timezone-correct** — `toSydneyDateKey` uses `Intl.DateTimeFormat` with `Australia/Sydney`, matching the pattern from `getDayOfMonth` in `dates.ts`. Event dots appear on the correct calendar day regardless of UTC offset.
- **Accessible calendar** — each day cell is a `<button>` with `disabled={!hasEvents}`, so keyboard navigation skips days with no events. `aria-label` on month-nav buttons. Today is clearly marked with a gold badge.
- **Responsive** — `lg:grid-cols-[360px_1fr]` collapses to a single column below 1024px; calendar leads, panel follows.
- **Build clean** — `next build` passes without errors or warnings.
- **Minimal `events/page.tsx`** — 19 lines vs 87 lines before. The filter logic, FilterBar, and EventCard imports are all gone.

## Issues Found

1. **`as unknown as string` type cast** — In `EventsBrowser.tsx`, `ev.startAt as unknown as string` is used before `new Date(...)`. This acknowledges the known server/client serialization issue (Prisma `Date` → ISO string at the RSC boundary) but the cast is ugly. The existing `EventCard.tsx` uses `new Date(event.startAt)` without a cast and it works at runtime regardless — TypeScript accepts it because `Date` constructor takes `Date | string | number`. The explicit cast here is defensive but unnecessary and should be removed.

2. **`ev.endAt as unknown as string`** — Same issue in `EventDetailCard`. Should just be `new Date(event.endAt)`.

3. **`EventCard.tsx` is now orphaned** — After this change, `EventCard` is imported nowhere in the codebase. It's not deleted but it's dead code. Should be noted and cleaned up in a follow-up.

4. **`FilterBar.tsx` is also orphaned** — Same situation. Both orphaned components are non-blocking for this task but should be cleaned up.

5. **Hardcoded English strings** — `"Events"`, `"Find your next adventure."`, `"No upcoming events. Check back soon."`, `"Upcoming Events"`, `"← All events"`, `"Full"`, `"Register"`, `"Featured"` are all hardcoded. Pre-existing pattern in this page, but the new `EventsBrowser` component adds more hardcoded strings without going through `t.*`. This violates the CLAUDE.md i18n rule. Since `EventsBrowser` is `"use client"`, it can use `useLanguage()` and `t.*`. Should be addressed in a follow-up.

6. **No `address` shown in detail card** — The task description says "location" but `EventDetailCard` only shows `locationName`, not `address`. This is arguably correct (the address is one more tap away on the event detail page), but it differs from the full event detail page which shows both.

## Suggested Improvements

1. **Remove `as unknown as string` casts** — just use `new Date(event.startAt)` directly, matching the pattern in `EventCard.tsx`.
2. **Delete `EventCard.tsx` and `FilterBar.tsx`** — they are confirmed dead code on this branch. A clean-up commit keeps the codebase tidy.
3. **i18n pass** — add `events.title`, `events.subtitle`, `events.upcoming`, `events.no_events`, `events.all_events_back`, `events.no_events_day` to `i18n.ts` and use `useLanguage()` in `EventsBrowser`.
4. **`useMemo` for `byDay`** — the grouping object is recomputed on every render (including state changes from day selection). For small event lists this is negligible, but wrapping in `useMemo([events])` would be more correct.
5. **Scroll behaviour on day select (mobile)** — on small screens, clicking a calendar day doesn't scroll to the detail panel below. Adding a `useRef` + `scrollIntoView` on the panel when `selectedKey` changes would improve mobile UX.

## Risks

- **`SPORT_DOT_COLORS` duplication** — It is now defined in both this branch's `src/lib/types.ts` AND the `feature/monthly-calendar-dots-task-1` branch. When those branches merge to master (or test), there will be a trivial but real merge conflict on this constant. The resolution is simply to keep one copy.
- **Large event sets** — passing all upcoming events as props works fine for tens or hundreds of events. At thousands of events, the serialized props payload grows. Not a realistic concern for this community app.
- **Calendar navigation to months with no upcoming events** — handled correctly: the right panel stays in "Upcoming Events" default state and the calendar shows no dots. No error state needed.

## Edge Cases Checked

- No upcoming events → empty state renders correctly ("No upcoming events. Check back soon.")
- Day with multiple events → all rendered stacked in the panel
- Day clicked but no events (impossible — `disabled={!hasEvents}` blocks interaction)
- Today styling → gold badge on the day number, unaffected by selection
- Month nav → clears `selectedKey`, resets panel to "Upcoming Events"
- Weekend shading → preserved (`isWeekend` logic matches `calendar/page.tsx`)
- Leading/trailing empty cells → rendered as inert divs, not buttons
- Full event → Register button renders as disabled, `aria-disabled={true}`
- Free event → shows "Free", not "$0.00"
- `isFeatured` → "Featured" badge shown in detail card

## Final Verdict

**Approved with comments**

Core feature is solid — the two-column layout works, the server/client split is correct, Sydney timezone grouping is correct, and the build is clean. Fix the two `as unknown as string` casts before or alongside the next task, and track the orphaned components and i18n debt as follow-up items.
