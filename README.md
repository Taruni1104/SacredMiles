# SacredMiles — The Art of a Meaningful Journey

SacredMiles is a Next.js application for planning and exploring spiritual journeys
across India. It currently provides a journey-type landing page, a searchable
destination catalogue, a Leaflet destination map, and a deterministic
day-by-day itinerary preview.

## Required frontend stack

- HTML through semantic JSX elements.
- React and JavaScript.
- Bootstrap 5 for responsive layout and interactive UI primitives.
- Custom CSS for Yatra branding and design tokens.
- Next.js App Router as the React runtime and build/development server.

The active pages use Bootstrap classes and custom CSS; they do not depend on
Tailwind CSS.

## Intermediate full-stack stack

- HTML through semantic React JSX.
- CSS and Bootstrap 5 for responsive layout.
- JavaScript and React for the frontend.
- Node.js and Express for the optional API.
- MySQL for optional persistence.
- Python standard library for the standalone itinerary helper.
- Next.js provides the React runtime and frontend build server.

The frontend does not require MySQL or Python to start.

Transport links are redirect-only. The app does not expose provider credentials,
search live availability, collect booking passwords or OTPs, process payments,
or mark a journey as booked.

## Current capabilities

- Choose Pilgrimage Focused, Sightseeing & Culture, or Balanced Journey.
- Use the SacredMiles editorial brand direction across the landing and discovery
  experience.
- Browse and search destinations by name, state, or type.
- View destination markers and popups on an India map.
- Open a canonical destination story page from tour cards and map markers.
- Use a shared destination-story schema that marks incomplete research explicitly.
- Open external Uber, Rapido, IRCTC, and Google bus-search links for itinerary legs.
- Add a destination from its story page to the saved itinerary without
  discarding the existing local plan, then recalculate route and budget
  estimates.
- Review a categorized local budget at `/budget`.
- Track transport and destination research tasks at `/bookings`.
- Record personal trip spending at `/expenses` and submit pending user price
  reports from destination story pages.
- Show verified official temple resources and claim-level source references
  where they have been checked.
- Generate a prototype itinerary from duration, region, and travel style.
- View generated activities in a chronological timeline.

## Current limitations

This is not yet a production booking platform. MySQL remains optional, but the
optional API now supports hashed-password accounts, server sessions, personal
expenses, and pending price reports. Payments, destination images, transport
schedules, route optimization, and live cost calculation are not implemented.
AI and Redis are intentionally deferred.

The complete architecture and planned service boundaries are documented in
[ARCHITECTURE.md](./ARCHITECTURE.md). Planned integrations are listed in
[docs/INTEGRATION-REQUIREMENTS.md](./docs/INTEGRATION-REQUIREMENTS.md).

## Requirements

- Node.js compatible with Next.js 16.
- npm.

## Setup

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required for the local frontend mode. To enable
the optional Node/MySQL API, copy `.env.example` to `.env.local`, configure
MySQL, run `database/schema.sql` first, and set
`NEXT_PUBLIC_API_URL=http://localhost:4000` for the Next.js process. The API
uses HttpOnly session cookies and does not store plaintext passwords. Never
commit real secrets.

## Commands

```powershell
npm run dev
npm run server
npm run build
npm run start
npm run lint
```

The project currently has no automated test command or test suite. Build and
lint status should be checked before submitting changes.

The Python helper can be run independently:

```powershell
python python/itinerary_helper.py --days 7 --state "Uttar Pradesh"
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Journey-type selection |
| `/tours` | Searchable destination catalogue |
| `/map` | Leaflet map with destination markers |
| `/planner` | Duration, region, and trip-type itinerary preview |
| `/budget` | Itemized local budget estimate with travelers and contingency controls |
| `/bookings` | Local booking checklist with explicit booking statuses |
| `/expenses` | Personal expense tracker with CSV export and API-backed mode |
| `/destinations/[slug]` | Destination story, journey actions, cost estimate, and related destinations |

Destination research status: all 35 catalogue records are now matched to the
preliminary source register dated 2026-10-30. That register contains 4 verified
source entries, 14 partially verified entries, and 17 unverified candidates.
Kashi Vishwanath, Tirupati TTD, and Somnath also retain selected manually
verified official resources in the canonical data. The register is source
discovery, not a complete story pass: no destination has a complete detailed
source-backed narrative yet, and unverified or partially verified links are
not presented as confirmed booking links.

The imported research artifacts are preserved in
`docs/research/`, including the preliminary report and CSV register. The
runtime mapping and source metadata are in
`lib/sacredmiles-source-register.json` and `lib/data.js`.

## Data and itinerary behavior

The local destination catalogue and itinerary function are in
`lib/data.js`. A generated day currently contains fixed travel, refresh,
destination-visit, and dinner activities. Destinations are selected from the
local array and are not geographically optimized.

The original planning artifacts in the parent workspace include a detailed
pilgrimage document, cost spreadsheet, prompt, and mind map. They are source
requirements and reference material; they are not imported at runtime.

The current planner, budget, and booking tracker remain local-first previews.
They use browser storage and deterministic assumptions; they do not provide
live fares, availability, accommodation inventory, official fee quotes,
payments, or booking confirmations.

Without `NEXT_PUBLIC_API_URL`, personal expenses and user-reported prices are
local-only and versioned in browser storage. With the optional API enabled,
registration and login use server sessions and the API exposes MySQL-backed
expense and price-report records. The current expense/report screens still
retain their local-first workflow; migrating their full CRUD UI to server sync,
including conflict handling for existing browser records, remains a separate
step. Price reports remain pending user reports; a trusted moderator/admin
workflow and receipt file storage are not implemented, so they do not become
official estimates automatically.

## Security and privacy

- Do not add real API keys, passwords, tokens, or database credentials.
- Do not commit `.env` or `.env.local`.
- Do not include production user data in sample files or project ZIPs.
- Keep future provider credentials server-side.

## Contribution guide

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local validation and review
guidance.
