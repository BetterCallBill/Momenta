# Review Summary — Admin Events Timezone Fix

## What Was Implemented

Fixed two-way timezone serialization in the Admin Events form:

1. **Read path** — `toSydneyDatetime(iso)`: converts a UTC ISO string from the DB into `YYYY-MM-DDTHH:MM` in Sydney time, so `datetime-local` inputs are pre-filled correctly when editing an event.
2. **Write path** — `sydneyLocalToISO(localDatetime)`: converts the naive `YYYY-MM-DDTHH:MM` string from the form input (interpreted as Sydney local time) into a proper UTC ISO string before POSTing to the API. DST (AEST/AEDT ±10/±11) is handled by computing the Sydney offset dynamically via `Intl`.
3. **Table display** — added `timeZone: 'Australia/Sydney'` to the inline `formatDate` call.

## Files Changed

- `src/app/admin/events/page.tsx`

## Strengths

- **DST-correct**: `sydneyLocalToISO` uses `Intl.DateTimeFormat` to derive the actual UTC offset for the entered moment, not a hardcoded `+10`/`+11`. This handles the clock-change weeks correctly.
- **No API changes needed**: once the client sends a proper UTC ISO string, the existing `new Date(startAt)` in the API routes parses it correctly.
- **Minimal blast radius**: change is isolated to one client component; no DB migration, no shared lib, no other pages affected.
- **Type-safe**: `Intl.DateTimeFormatPartTypes` used correctly; TypeScript passes with no errors.
- **Consistent with project patterns**: aligns with the intent of `src/lib/dates.ts` (all Sydney-tz formatting uses `Intl`).

## Issues Found

### Minor

1. **`SYDNEY_TZ` constant is local, not from `src/lib/dates.ts`**: `dates.ts` already exports `TZ` (same value). Importing it would eliminate the duplicate literal and enforce a single source of truth.  
   However, since `dates.ts` is a server+client file and this is a `"use client"` component, the import would work fine — it's just a string constant with no server-only APIs. Not a breaking issue, but worth aligning.

2. **No guard for empty `startAt`/`endAt` in `sydneyLocalToISO`**: If the form somehow submits with an empty string (though `required` on the inputs prevents it in the browser), `new Date(':00.000Z')` would produce `Invalid Date` and the function would return `"Invalid Date"`. The API's `new Date(startAt)` would then silently store `NaN`. A `if (!localDatetime) throw new Error(...)` guard would make failures explicit.

3. **`EMPTY_FORM.startAt` is `''`**: When creating a new event, `sydneyLocalToISO('')` is called on submit. The `required` attribute on the `datetime-local` inputs prevents submission with an empty value, so this is safe in practice — but see issue #2.

### Cosmetic

4. The two comments above the helper functions explain the _what_, not the _why_. Per project conventions, comments should explain non-obvious constraints. These can be removed.

## Suggested Improvements

```ts
// Option A: import TZ from the shared lib instead of redeclaring
import { TZ as SYDNEY_TZ } from "@/lib/dates";

// Option B: add a guard (belt-and-suspenders)
function sydneyLocalToISO(localDatetime: string): string {
    if (!localDatetime) return '';
    // ... rest unchanged
}
```

## Risks

- **DST ambiguous hour**: When clocks fall back (last Sunday of April in Sydney), a wall-clock hour repeats. The `Intl`-based offset approach will consistently pick one interpretation (the first occurrence). This is acceptable for event scheduling — the edge case is rare and the admin can manually adjust if needed.
- **Browser `Intl` support**: `Intl.DateTimeFormat` with `formatToParts` is supported in all modern browsers (Chrome 57+, Firefox 51+, Safari 10.1+). No risk for this admin panel.

## Edge Cases Checked

| Scenario | Result |
|---|---|
| Creating event in AEST (UTC+10) | Correct: 9:00 AM Sydney → `T23:00:00.000Z` (prev day) |
| Creating event in AEDT (UTC+11) summer | Correct: 9:00 AM Sydney → `T22:00:00.000Z` (prev day) |
| Editing existing event | Correct: UTC from DB → displayed as Sydney local in input |
| Table display | Correct: `timeZone: 'Australia/Sydney'` applied |
| Empty form (new event, no time entered) | Safe: `required` on inputs prevents submission |

## Final Verdict

**Approved with comments**

The fix is correct, DST-aware, and well-scoped. The two minor issues (shared `TZ` constant, empty-string guard) are low-priority polish items that do not affect correctness. Safe to merge.
