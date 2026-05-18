# Review Summary — event-detail-full-banner-task-1

## What Was Implemented

Two improvements to the public event detail page (`src/app/events/[slug]/page.tsx`):

1. **Full-viewport banner** — changed banner height from `h-[60vh] min-h-105 max-h-175` to `h-dvh`. The hero image now fills the entire visible viewport on load. `h-dvh` uses CSS `100dvh` (dynamic viewport height), which correctly accounts for mobile browser chrome (URL bar) that `h-screen`/`100vh` does not.

2. **Description line break preservation** — changed `whitespace-pre-wrap` → `whitespace-pre-line` on the description paragraph. Both classes preserve `\n` characters as visible breaks; `pre-line` additionally collapses sequences of multiple spaces, which is preferable for user-entered textarea content from the admin panel.

Two Tailwind/JSX cleanup items from the previous review's suggested improvements were also resolved in the same commit:

- `bg-gradient-to-t` → `bg-linear-to-t` (Tailwind CSS 4 canonical; now consistent with the `bg-linear-to-b` on the adjacent line)
- `&ensp;·&ensp;` → `{" · "}` (idiomatic JSX string interpolation)

One correction made mid-implementation: initially replaced `wrap-break-word` with `break-words`, but the IDE diagnostic confirmed `wrap-break-word` is the Tailwind CSS 4 canonical form (not `break-words` from v3). The original class was preserved.

---

## Files Changed

| File | Change |
|---|---|
| `src/app/events/[slug]/page.tsx` | 4 lines changed (4 substitutions, net zero) |

---

## Strengths

- **`h-dvh` over `h-screen`** — the correct modern choice for full-viewport heroes. `100dvh` adapts to the visible area when the mobile browser address bar is shown or hidden; `100vh` does not. Zero extra complexity.
- **Removes `min-h-105 max-h-175`** — these clamp constraints were only needed because the 60vh value could produce an unusably small banner on very short viewports. With `h-dvh` the banner is always exactly the viewport, so the clamps are correctly removed rather than left as dead code.
- **`whitespace-pre-line` is the right pick for textarea input** — the behaviour difference from `pre-wrap` is that multiple consecutive spaces are collapsed. User-typed descriptions commonly have these (copy-paste artefacts, extra spaces before punctuation); `pre-line` makes them invisible rather than rendering awkward gaps.
- **Canonical Tailwind CSS 4 cleanup** — `bg-linear-to-t` and `bg-linear-to-b` are now consistent. The two gradient divs look identical in pattern, which is correct.
- **TypeScript clean** — `tsc --noEmit` produces no output.
- **Single-file change** — zero blast radius. No API, schema, or component changes.

---

## Issues Found

### 1. CTA is below the fold by design — no scroll affordance (minor, UX)
With `h-dvh`, the Register button is not visible until the user scrolls. Nothing on the page signals there is content below. A subtle scroll indicator (e.g. a chevron-down or a fading bottom border on the banner) would improve discoverability. Not a blocker, but a UX gap for first-time visitors.

### 2. Very tall banners on landscape mobile may feel excessive (minor)
On a phone rotated to landscape, `h-dvh` will be relatively short (around 320–400px), which is fine. In portrait, it is the full ~850px on modern phones — intended. No regression, just noting the deliberate trade-off.

### 3. Pre-existing: `top-24` back-link is header-height-coupled (carried from previous review)
`top-24` is still a magic number tied to the fixed header height. Still not a blocker but worth extracting to a CSS variable if the header height changes.

---

## Suggested Improvements

1. **Add a scroll indicator to the banner** — a gently animated chevron-down at `bottom-6` (above the overlaid text) would guide users to scroll for details. Low effort, meaningful UX improvement.
2. **Extract header height offset** — a Tailwind CSS variable (e.g. `--header-h: 96px`) reused for both the back-link `top-24` and any future sticky-header clearance would prevent silent breakage if the header height changes.

---

## Risks

- **Images with subject at the bottom** — `object-center` will centre-crop the image vertically. With a full-viewport banner, images where the subject (e.g. a runner) is positioned near the bottom may now crop the subject out at the top. `object-top` or `object-position` tuning could be applied per-event, but requires schema changes. Acceptable for now given current image content.
- **Very long event titles** — `md:text-5xl` at full viewport height leaves more vertical space above, so a two-line title wraps further from the bottom edge of the gradient. Gradient coverage is sufficient but should be monitored if titles grow beyond ~60 characters.

---

## Edge Cases Checked

- [x] No `coverImageUrl` → `bg-neutral-900` fills `h-dvh` correctly (absolute inset-0)
- [x] `isFull = true` → banner unaffected; CTA replaced with red notice below fold
- [x] `priceCents = 0` → no impact on banner or description rendering
- [x] `event.description` null/empty → description section hidden, no layout gap
- [x] Description with `\n` line breaks → `whitespace-pre-line` renders visible breaks
- [x] Description with multiple consecutive spaces → `whitespace-pre-line` collapses them correctly (improvement over `pre-wrap`)
- [x] `isFeatured = false` → Featured pill absent, no layout regression

---

## Final Verdict

**Approved**

All four changes are minimal, correct, and directly address the stated requirements. The mid-implementation correction (keeping `wrap-break-word` after IDE feedback) demonstrates the canonical Tailwind CSS 4 class was already in use — a false alarm that was handled cleanly. No blocking issues. The two suggested improvements (scroll indicator, header height variable) are polish items suitable for a follow-up.
