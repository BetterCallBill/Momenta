# Website Development Master Plan (Claude Code Friendly)

> This document is structured for AI-assisted coding workflows.
> Each FEATURE contains clear implementation tasks that can be executed sequentially.
> Recommended usage: feed one FEATURE at a time into Claude Code / Cursor.

---

# EPIC 1. CONTACT US PAGE UPDATE

## FEATURE 1.1 Redesign Contact Us Page

### Objective
Improve the Contact Us page to provide complete company contact information, a professional inquiry form, and better mobile responsiveness.

### Detailed Tasks

#### Task 1.1.1 Audit Existing Contact Us Page
- Locate current Contact Us frontend page component.
- Review existing fields, layout, and styling.
- Identify which contact details are missing:
Email
momenta0429@gmail.com

Location
Sydney, Australia

Social
Instagram: momenta_events_group
WeChat: anc1140560182

Response Time
We typically respond within 24–48 hours.

- Check whether current inquiry form is functional.

#### Task 1.1.2 Redesign Contact Information Section
- Add dedicated section for:
  - Company email
  - Phone number
  - WeChat ID / QR code
  - Office/studio address
  - Social media links
- Use icon-based visual layout for cleaner presentation.

#### Task 1.1.3 Rebuild Inquiry Form
- Form fields:
  - Full Name
  - Email Address
  - Phone Number
  - Inquiry Type (dropdown)
  - Message
- Add frontend validation:
  - required field validation
  - email format validation

#### Task 1.1.4 Backend Inquiry Submission API
- Create API endpoint to receive inquiry form submissions.
- Save inquiry records to database or send directly to business email inbox.
- Add success/failure response handling.

#### Task 1.1.5 Connect Frontend Form to Backend
- Submit form data via POST request.
- Show success message after submission.
- Show error message if submission fails.

#### Task 1.1.6 Mobile Responsive Optimization
- Ensure all content stacks properly on smaller screens.
- Test inquiry form usability on mobile.

---

# EPIC 2. USER AUTHENTICATION SYSTEM

## FEATURE 2.1 WeChat OAuth Login Integration

### Objective
Allow users to log in or sign up using their WeChat account.

### Detailed Tasks

#### Task 2.1.1 Research WeChat OAuth Requirements
- Confirm required:
  - App ID
  - App Secret
  - Callback URL
- Review OAuth login flow documentation.

#### Task 2.1.2 Backend Auth API Setup
Create:
- `/api/auth/wechat/login`
- `/api/auth/wechat/callback`

Implementation:
- redirect user to WeChat auth page
- receive authorization code
- exchange code for user profile

#### Task 2.1.3 User Database Schema Update
Add new user fields:
- wechatOpenId
- wechatUnionId
- loginProvider

#### Task 2.1.4 JWT / Session Creation
- After successful WeChat auth:
  - create user if not exists
  - generate auth token/session

#### Task 2.1.5 Frontend Add WeChat Login Button
- Add "Login with WeChat" button to login/register page.
- Connect button redirect to backend auth route.

#### Task 2.1.6 Frontend Callback Handling
- Receive login token from callback.
- Save token to local auth state.
- Redirect user to dashboard/home page.

---

# EPIC 3. ADMIN MULTI-LANGUAGE SYSTEM

## FEATURE 3.1 Admin Panel Internationalization

### Objective
Support Chinese and English language switching in the entire Admin panel.

### Detailed Tasks

#### Task 3.1.1 Setup Translation Framework
- Install i18n library.
- Configure language provider.

#### Task 3.1.2 Create Translation Files
Create:
- `/locales/en.json`
- `/locales/zh.json`

#### Task 3.1.3 Build Language Toggle Component
- Add language switch button in Admin header/navbar.

#### Task 3.1.4 Convert All Static Text to Translation Keys
Apply translation to:
- menus
- buttons
- labels
- placeholders
- validation messages
- table headers
- modal text

#### Task 3.1.5 Persist Selected Language
- store selected language in localStorage/session

#### Task 3.1.6 Real-time Page Refresh on Language Change
- changing language should update all content immediately without manual refresh

---

# EPIC 4. EVENT MODULE FRONTEND REDESIGN

## FEATURE 4.1 Remove Existing Filters

### Detailed Tasks
- Locate current event filter/search UI.
- Remove filter bar from frontend.
- Remove unused filter state logic.

---

## FEATURE 4.2 Build Monthly Calendar Navigation

### Detailed Tasks

#### Task 4.2.1 Create Calendar Month Grid Component
- show current month
- show all dates in standard calendar format

#### Task 4.2.2 Add Previous/Next Month Arrows
- left arrow = previous month
- right arrow = next month

#### Task 4.2.3 Bind Event Data to Calendar Dates
- highlight dates that contain events

#### Task 4.2.4 Add Date Click Interaction
- clicking a date loads event detail data

---

## FEATURE 4.3 Event Page Two-column Layout

### Detailed Tasks

#### Left Column
- calendar
- month arrows

#### Right Column
- selected date event details

Display:
- event name
- event time
- event location
- headcount limit
- event fee

#### Task 4.3.1 Build responsive grid layout
#### Task 4.3.2 Build event detail panel
#### Task 4.3.3 Connect selected date state with detail panel

---

# EPIC 5. EVENT ADMIN BUG FIXES

## FEATURE 5.1 Description Word Wrap Fix

### Detailed Tasks
- locate event admin table description column
- apply CSS:
  - word-break
  - white-space normal
  - max-width if needed

---

## FEATURE 5.2 Start Time / End Time Save Bug

### Detailed Tasks

#### Task 5.2.1 Inspect frontend datetime picker value format
#### Task 5.2.2 Inspect API payload serialization
#### Task 5.2.3 Inspect backend DTO mapping
#### Task 5.2.4 Inspect DB datetime storage timezone issue
#### Task 5.2.5 Fix and retest save/edit flow

---

# EPIC 6. REGISTRATION & PAYMENT FLOW

## FEATURE 6.1 Registration Confirmation Email

### Detailed Tasks

#### Task 6.1.1 Setup Email Sending Service
- SMTP / SendGrid / Nodemailer

#### Task 6.1.2 Create HTML Confirmation Template
Include:
- attendee name
- event name
- date/time
- venue
- payment info

#### Task 6.1.3 Trigger Email After Successful Registration

---

## FEATURE 6.2 Payment Integration

### Detailed Tasks

#### Task 6.2.1 Select Payment Gateway
Recommended:
- [Stripe](chatgpt://generic-entity?number=0)
- [PayPal](chatgpt://generic-entity?number=1)

#### Task 6.2.2 Backend Payment Intent API
- create payment session
- return payment URL/token

#### Task 6.2.3 Frontend Checkout Page
- redirect user after registration
- display payment amount

#### Task 6.2.4 Payment Callback Handling
- update registration payment status after success

---

## FEATURE 6.3 Registration Form Extra Fields

### Detailed Tasks
Add fields:
- Interested Event Type
- Age Range

Backend work:
- update DTO
- update DB schema
- update admin registration viewer

---

# EPIC 7. GALLERY MANAGEMENT UPGRADE

## FEATURE 7.1 Gallery Video Support

### Detailed Tasks
- allow video upload MIME types
- update media storage handling
- render video player in frontend gallery

---

## FEATURE 7.2 Featured Checkbox Refactor

### Detailed Tasks
- replace featured text/select input with boolean checkbox
- update backend field binding

---

## FEATURE 7.3 Event Name Accordion Grouping

### Detailed Tasks
- add event name relation field to gallery item
- group gallery items by event name
- build accordion collapse/expand UI

---

# EPIC 8. TEAM PAGE

## FEATURE 8.1 Display Team Members

### Detailed Tasks

#### Task 8.1.1 Create Team Member Data Model
Fields:
- name
- title
- photo
- bio
- display order

#### Task 8.1.2 Build Admin CRUD Management
- add/edit/delete team member

#### Task 8.1.3 Build Frontend Team Section
- responsive card layout for all members

---

# EPIC 9. EVENT DETAIL PAGE IMPROVEMENT

## FEATURE 9.1 Full Poster Banner Display

### Detailed Tasks
- add poster image field to event model
- upload poster in admin page
- render full poster/banner at top of event detail page

---

# EPIC 10. INSTAGRAM INTEGRATION

## FEATURE 10.1 Follow Our Journey Feed

### Detailed Tasks

#### Task 10.1.1 Research Instagram API or Embed Method
#### Task 10.1.2 Create frontend Instagram feed section
#### Task 10.1.3 Fetch and display latest posts
#### Task 10.1.4 Add follow button linked to Instagram account

---

# RECOMMENDED EXECUTION ORDER

## Phase 1. Business Foundation
1. Contact Us Page
2. WeChat Login
3. Multi-language Admin
4. Event Admin Bug Fixes

## Phase 2. Conversion System
5. Registration Email
6. Payment
7. Registration Fields

## Phase 3. Event Experience
8. Event Calendar Redesign
9. Event Detail Poster

## Phase 4. Branding & Content
10. Gallery
11. Team
12. Instagram

---

# CLAUDE CODE USAGE RECOMMENDATION

Feed Claude Code one FEATURE at a time using:

- objective
- detailed tasks
- ask Claude to inspect current codebase
- ask Claude to generate implementation plan first
- then ask Claude to execute task by task

Do NOT feed all epics at once.

---