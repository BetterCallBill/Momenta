# FEATURE 1.1 — Redesign Contact Us Page

**Epic:** EPIC 1 — Contact Us Page Update  
**Priority:** High (Phase 1)  
**Status:** In Progress — current page exists but has wrong data, missing fields, and no i18n

---

## Current State Audit

### Files Involved

| File | Role |
|---|---|
| [src/app/contact/page.tsx](../../../src/app/contact/page.tsx) | Page shell — Server Component |
| [src/components/ContactForm.tsx](../../../src/components/ContactForm.tsx) | Form — `"use client"` component |
| [src/app/api/inquiries/route.ts](../../../src/app/api/inquiries/route.ts) | Backend POST handler |
| [src/lib/i18n.ts](../../../src/lib/i18n.ts) | Translation strings — **contact section does not exist yet** |
| [prisma/schema.prisma](../../../prisma/schema.prisma) | `Inquiry` model |

### What Exists

- Two-column layout: form on **left**, contact info on **right** (md grid).
- Contact info is plain text with gold heading labels — no icons.
- Form fields: Name, Email, Message only. Honeypot included.
- API (`POST /api/inquiries`) saves `name`, `email`, `message` to DB. No email notification sent.

### What Is Wrong / Missing

| Issue | Location | Required Fix |
|---|---|---|
| Wrong email address | `contact/page.tsx:29` | `hello@momenta.com.au` → `momenta0429@gmail.com` |
| Wrong Instagram handle | `contact/page.tsx:49` | `@momenta.syd` → `@momenta_events_group` |
| Wrong WeChat ID | `contact/page.tsx:55` | `MomentaSydney` → `anc1140560182` |
| Stale Facebook link | `contact/page.tsx:58-62` | Remove — not listed in brand contacts |
| No icons on contact info | `contact/page.tsx` | Add SVG icons for each contact type |
| Missing Phone Number field | `ContactForm.tsx` | Add optional phone input |
| Missing Inquiry Type dropdown | `ContactForm.tsx` | Add dropdown: General / Event Booking / Sponsorship / Other |
| No i18n on page or form | Both files | Wrap all strings in `t.*` via `useLanguage()` |
| API missing `phone` / `inquiryType` fields | `api/inquiries/route.ts` | Accept and store new fields |
| `Inquiry` model missing new fields | `schema.prisma` | Add `phone` and `inquiryType` columns |
| No email notification to business | `api/inquiries/route.ts` | Send notification to `momenta0429@gmail.com` on submission |

---

## Correct Contact Information

| Type | Value |
|---|---|
| Email | momenta0429@gmail.com |
| Location | Sydney, Australia |
| Instagram | @momenta_events_group → `https://instagram.com/momenta_events_group` |
| WeChat | anc1140560182 |
| Response Time | We typically respond within 24–48 hours |

---

## Implementation Tasks

### Task 1 — Update Prisma Schema

**File:** `prisma/schema.prisma`

Add `phone` and `inquiryType` to the `Inquiry` model:

```prisma
model Inquiry {
  id          String   @id @default(cuid())
  name        String
  email       String
  phone       String?
  inquiryType String?
  message     String
  honeypot    String?
  createdAt   DateTime @default(now())
}
```

Run migration after:
```bash
npx prisma migrate dev --name add-inquiry-phone-type
```

---

### Task 2 — Add i18n Strings

**File:** `src/lib/i18n.ts`

Add a `contact` section to both `en` and `zh` objects. Both must be added at the same time — TypeScript enforces this via the `satisfies` pattern.

```ts
// Inside translations.en:
contact: {
  page_title: "Contact Us",
  page_subtitle: "Got a question, suggestion, or want to collaborate? We'd love to hear from you.",
  email_label: "Email",
  location_label: "Location",
  location_value: "Sydney, Australia",
  social_label: "Social",
  response_label: "Response Time",
  response_value: "We typically respond within 24–48 hours.",
  form_name: "Full Name",
  form_name_placeholder: "Your full name",
  form_email: "Email Address",
  form_email_placeholder: "you@example.com",
  form_phone: "Phone Number",
  form_phone_placeholder: "04xx xxx xxx",
  form_inquiry_type: "Inquiry Type",
  form_inquiry_general: "General",
  form_inquiry_booking: "Event Booking",
  form_inquiry_sponsorship: "Sponsorship",
  form_inquiry_other: "Other",
  form_message: "Message",
  form_message_placeholder: "How can we help?",
  form_required: "* Required fields",
  form_submit: "Send Message",
  form_submitting: "Sending...",
  form_success_title: "Message Sent!",
  form_success_body: "Thanks for reaching out. We'll get back to you soon.",
  form_error_generic: "Something went wrong. Please try again.",
},

// Inside translations.zh (matching keys):
contact: {
  page_title: "联系我们",
  page_subtitle: "有问题、建议或合作意向？欢迎随时联系我们。",
  email_label: "电子邮件",
  location_label: "地址",
  location_value: "澳大利亚，悉尼",
  social_label: "社交媒体",
  response_label: "回复时间",
  response_value: "我们通常在 24–48 小时内回复。",
  form_name: "真实姓名",
  form_name_placeholder: "您的全名",
  form_email: "电子邮箱",
  form_email_placeholder: "you@example.com",
  form_phone: "手机号码",
  form_phone_placeholder: "04xx xxx xxx",
  form_inquiry_type: "咨询类型",
  form_inquiry_general: "一般咨询",
  form_inquiry_booking: "活动预约",
  form_inquiry_sponsorship: "赞助合作",
  form_inquiry_other: "其他",
  form_message: "留言内容",
  form_message_placeholder: "我们能帮您什么？",
  form_required: "* 为必填项",
  form_submit: "发送留言",
  form_submitting: "发送中...",
  form_success_title: "发送成功！",
  form_success_body: "感谢您的留言，我们将尽快与您联系。",
  form_error_generic: "出现错误，请重试。",
},
```

---

### Task 3 — Rebuild ContactForm Component

**File:** `src/components/ContactForm.tsx`

Key changes:
- Add `"use client"` + `useLanguage()` hook.
- Add **Phone Number** field (optional input, `name="phone"`).
- Add **Inquiry Type** dropdown (required, `name="inquiryType"`), with options: General / Event Booking / Sponsorship / Other.
- Replace all hardcoded strings with `t.contact.*` keys.
- POST body must include `phone` and `inquiryType`.
- Preserve existing honeypot field and success/error state pattern.

Form field order: Full Name → Email Address → Phone Number → Inquiry Type → Message.

Input styling to match existing pattern:
```
className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-brand-white placeholder:text-brand-white/30 focus:border-gold-500 focus:outline-none"
```

Select/dropdown uses same class as input but `<select>` element. Add `bg-neutral-800` explicitly since `<select>` doesn't inherit background in all browsers.

---

### Task 4 — Redesign Contact Page

**File:** `src/app/contact/page.tsx`

Changes:
- Convert to use `useLanguage()` — page must become `"use client"` since it renders contact info with translated strings, OR extract the contact info into a `"use client"` child component.
  - **Preferred approach:** Keep page as a Server Component and create a new `"use client"` component `ContactInfoPanel.tsx` that renders the icon+info block using `useLanguage()`.
- Fix all contact details (email, Instagram, WeChat — see table above).
- Remove Facebook link entirely.
- Add SVG icons next to each contact item.
- Swap column order to: **contact info left, form right** on desktop (md:grid-cols-2, info in first column).

**Icon suggestions (inline SVG or Heroicons):**
- Email → envelope icon
- Location → map pin icon
- Instagram → camera/Instagram icon
- WeChat → chat bubble icon
- Response Time → clock icon

**Instagram link:** `https://instagram.com/momenta_events_group`  
**WeChat display:** Show the WeChat ID as copyable text (no deep link — WeChat IDs don't have a universal URL scheme).

---

### Task 5 — Update API Route

**File:** `src/app/api/inquiries/route.ts`

Changes:
1. Accept `phone` and `inquiryType` from request body.
2. Pass them to `prisma.inquiry.create()`.
3. After save, send email notification to `momenta0429@gmail.com` (non-blocking, same pattern as registration confirmation).

```ts
// After successful DB save — non-blocking
sendInquiryNotificationEmail({
  to: "momenta0429@gmail.com",
  name,
  email,
  phone: phone || null,
  inquiryType: inquiryType || "General",
  message,
}).catch((err) => console.error("[email] inquiry notification failed:", err));
```

Add `sendInquiryNotificationEmail` to `src/lib/email.ts` following the existing `sendConfirmationEmail` pattern.

---

## Acceptance Criteria

- [ ] Page displays the correct email (`momenta0429@gmail.com`), Instagram (`@momenta_events_group`), WeChat (`anc1140560182`).
- [ ] Facebook link is removed.
- [ ] Each contact item has an icon.
- [ ] Form has 5 fields: Full Name, Email, Phone (optional), Inquiry Type (dropdown), Message.
- [ ] Inquiry Type dropdown has 4 options: General, Event Booking, Sponsorship, Other.
- [ ] Frontend validates required fields and email format before submission.
- [ ] Successful submission shows inline success state without page reload.
- [ ] Failed submission shows inline error message.
- [ ] All visible strings switch between English and Chinese when the language toggle is used.
- [ ] Submission saves `phone` and `inquiryType` to the `Inquiry` DB record.
- [ ] Submission triggers a notification email to `momenta0429@gmail.com`.
- [ ] Honeypot spam protection is preserved.
- [ ] On mobile (375px), the layout stacks to single column: contact info on top, form below.
- [ ] On desktop (md+), layout is two columns: contact info left, form right.

---

## Files to Create / Modify Summary

| Action | File |
|---|---|
| Modify | `prisma/schema.prisma` — add `phone?`, `inquiryType?` to `Inquiry` |
| Run | `npx prisma migrate dev --name add-inquiry-phone-type` |
| Modify | `src/lib/i18n.ts` — add `contact` section to `en` and `zh` |
| Modify | `src/components/ContactForm.tsx` — add fields, i18n, updated POST body |
| Modify | `src/app/contact/page.tsx` — fix contact data, add icons, fix column order |
| Create | `src/components/ContactInfoPanel.tsx` — extracted `"use client"` contact info block |
| Modify | `src/app/api/inquiries/route.ts` — accept new fields, send notification email |
| Modify | `src/lib/email.ts` — add `sendInquiryNotificationEmail` helper |
