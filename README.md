# DMUN Foundation – Feature Enhancements Summary

This document captures the work delivered during the DMUN Foundation hackathon milestones that were completed in this workspace. It explains the major features, supporting components, and how to explore or extend them.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Milestone Overview](#milestone-overview)
3. [Detailed Enhancements](#detailed-enhancements)
   - [Footer Redesign (Milestone 2)](#footer-redesign-milestone-2)
   - [Menu Drawer Experience (Milestone 3a)](#menu-drawer-experience-milestone-3a)
   - [Executives Portal (Milestone 3b)](#executives-portal-milestone-3b)
   - [Documents Draft Assistant (Milestone 4)](#documents-draft-assistant-milestone-4)
   - [Executive Leadership Page (Milestone 5)](#executive-leadership-page-milestone-5)
   - [Search Overhaul (Milestone 6 – Base)](#search-overhaul-milestone-6--base)
   - [Rule-Based Site Orchestration (Milestone 6 – Advanced)](#rule-based-site-orchestration-milestone-6--advanced)
4. [Support Components](#support-components)
5. [Testing & Verification](#testing--verification)
6. [Next Ideas](#next-ideas)

---

## Project Setup

The project continues to use **React 19**, **Vite**, **styled-components**, and several supporting client-side libraries (Framer Motion, GSAP, pdfjs-dist, mammoth, Fuse.js). To install dependencies and run locally:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

---

## Milestone Overview

| Milestone              | Feature                                         | Status       |
| ---------------------- | ----------------------------------------------- | ------------ |
| Milestone 2            | Footer redesign                                 | ✅ Completed |
| Milestone 3a           | Menu drawer rework                              | ✅ Completed |
| Milestone 3b           | Executives login portal                         | ✅ Completed |
| Milestone 4            | Documents Draft Assistant                       | ✅ Completed |
| Milestone 5            | Executive Leadership page                       | ✅ Completed |
| Milestone 6 (base)     | Search enhancements with Fuse.js                | ✅ Completed |
| Milestone 6 (advanced) | Rule-based site orchestration & personalization | ✅ Completed |

---

## Detailed Enhancements

### Footer Redesign (Milestone 2)

- Replaced the legacy footer with a modern, responsive layout using styled-components.
- Grouped navigation links, action buttons, contact details, and social icons into a compact grid.
- Added Framer Motion cues for subtle hover/entry animations.
- Ensured the design respects DMUN brand colors (`--andover-*` variables) and remains accessible on mobile and desktop.

### Menu Drawer Experience (Milestone 3a)

- Rebuilt the menu drawer to slide in from the right (per the latest guidance) and consume ~30% of the viewport width.
- Added backdrop overlay that closes the drawer when clicked.
- Reorganized navigation into thematic groupings. Removed duplicated links (Volunteer, Donate, Contact) from the list to keep them only in the quick-action section.
- Included links to the new pages (`/executives-login`, `/leadership`).

### Executives Portal (Milestone 3b)

- Route: `/executives-login`.
- Features:
  - Seed users (Lead, Co-Lead, two general staff) injected into `localStorage` on first run.
  - Role-based dashboard:
    - **Lead**: add users, promote/demote Co-Lead, broadcast messages.
    - **Co-Lead**: broadcast messages, view responses.
    - **General staff**: read message feed, respond with Yes/No/Maybe.
  - Toast-style alerts, confirmation prompts, and badge colors for roles.
  - `localStorage` keys: `dmun_users`, `dmun_messages`, `dmun_current_user`.
- Styling follows the existing design system with dynamic color tokens.

### Documents Draft Assistant (Milestone 4)

- Route: `/documents-assistant`.
- Functionality:
  - Upload TXT, PDF (via pdf.js), and DOCX (via mammoth) documents entirely client-side.
  - Parse and score the file against GDMUN Rules of Procedure structure:
    - Required headings (Country, Delegate, Committee, Agenda, etc.).
    - Content depth, uniqueness, stance, references.
  - 25-point rubric with per-category breakdown and human-style feedback.
  - Basic “originality check” disclaimer.
- UI adjustments ensure minimal whitespace and quick visual scan.

### Executive Leadership Page (Milestone 5)

- Route: `/leadership`.
- Components:
  - Animated hero with mission statement and quote callouts.
  - Filter bar to sort leadership cards by department.
  - `LeadershipCard` component with headshot, title, location, biography, social/email links.
  - Responsive grid that centers cards and handles single-card layouts gracefully.
- Accessibility:
  - Keyboard focus states, alt text, and semantic markup.

### Search Overhaul (Milestone 6 – Base)

- Added **Fuse.js** with rich search index at `src/data/searchIndex.js` (pages, leadership, news articles, assistants, etc.).
- Created context provider (`src/context/SearchContext.jsx`) for global search state.
- Header search replaced with a persistent input offering:
  - Instant suggestions.
  - Highlighted matches.
  - “See all” entry point to `/search`.
  - Recent and popular search hints (stored in `localStorage`).
- Route `/search` renders categorized results, filters, and “Did you mean…” suggestions. Responsive grid adjustments prevent card overlap.

### Rule-Based Site Orchestration (Milestone 6 – Advanced)

- Introduced `RuleContext` provider (`src/context/RuleContext.jsx`) to manage:
  - Audience “persona” selection (Delegate, Parent, Educator, General).
  - Layering of base content → persona presets → Lead-authored overrides.
  - Persistence of persona selection and custom rules via `localStorage`.
- Added persona selector to the header (“Viewing as …”) so anyone can preview audience-specific content.
- Created Lead-only Rule Management console at `/rule-management`:
  - Requires logging in as Lead within the Executives Portal (data read from `dmun_current_user`).
  - Allows editing hero lines, subtitles, CTA text/links, and promotional banners for Home/Programs/About pages per persona.
  - Supports save, revert, and reset actions.
- Updated pages to consume dynamic content:
  - `Home.jsx`: hero lines/subtitle/buttons/promo banner use personalized content.
  - `Programs.jsx`: hero headline, subtitle, CTA, and callout adjust per audience.
  - `About.jsx`: hero title/subtitle and mission paragraphs adapt based on persona.
- Base presets were authored for each persona so the content switches instantly even without custom rules (e.g., delegates see conference CTAs, parents see leadership messaging, educators see curriculum copy).

---

## Support Components

- `src/components/search/` – Modular search UI (SearchBar, suggestions dropdown, result cards).
- `src/pages/SearchResults.jsx` – Reusable UI for search filters and results list.
- `src/pages/RuleManagement.jsx` – Rule editor form with styled panel layout.
- `src/data/leadership.js` – Central leadership dataset used by cards and search indexing.
- `src/data/newsroomArticles.js` – Shared newsroom data for search and pages.

---

## Testing & Verification

### Persona Personalization

1. Run `npm run dev`.
2. Navigate to `/`.
3. Toggle the persona selector in the header and confirm hero text, CTAs, and optional banners shift appropriately.
4. Visit `/programs` and `/about` to verify persona-specific copy.

### Rule Management

1. Log in as the Lead (`jaewon.choi@dmun.org`) via `/executives-login`.
2. Navigate to `/rule-management`.
3. Modify hero lines/CTA for a persona and save.
4. Switch persona in the header to confirm the override appears.

### Search

1. Use header search to type `advocasy`, `help children`, `prog`, etc.
2. Confirm suggestions appear and `/search` shows relevant results with highlight, filters, and “Did you mean…” suggestions.
3. Ensure result cards layout correctly at various window sizes.

### Executives Portal

1. `/executives-login` – log in with Lead or Co-Lead credentials.
2. Broadcast messages, add users, adjust roles, log out/in to verify persistence in `localStorage`.

### Documents Assistant

1. `/documents-assistant` – upload sample TXT/PDF/DOCX files.
2. Verify parsing, scoring, and feedback generation.

---

## Next Ideas

- Broaden the rule system to cover additional pages (Newsroom, Take Action) or component-level banners.
- Add analytics to the rule editor to show which persona is most active and which rules are applied.
- Integrate image uploads for leadership cards, or connect `RuleManagement` to preview content live.
- Expand search index to include dynamic content (messages, upcoming programs) via automated scripts.

---

For code locations and more context, browse the directories referenced above. All major features are modularized and rely on existing theme tokens (`--andover-*`) for styling consistency. Feel free to reach out if deeper documentation or walkthroughs are required. !**_ End Patch_** End Patch

# DMUN-Foundation
