# Yatra — Grand Pilgrimage of India

Yatra is a Next.js prototype for planning and exploring spiritual journeys
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

## Current capabilities

- Choose Pilgrimage Focused, Sightseeing & Culture, or Balanced Journey.
- Browse and search destinations by name, state, or type.
- View destination markers and popups on an India map.
- Generate a prototype itinerary from duration, region, and travel style.
- View generated activities in a chronological timeline.

## Current limitations

This is not yet a production booking platform. It currently has no required
database, authentication, bookings, payments, destination images, transport
schedules, route optimization, or cost calculation. The map displays markers
but does not draw a generated route. AI and Redis are intentionally deferred.

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

No environment variables are required for the frontend. To run the optional
Node/MySQL API, copy `.env.example` to `.env.local`, configure MySQL, and run
`database/schema.sql` first. Never commit real secrets.

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

## Data and itinerary behavior

The local destination catalogue and itinerary function are in
`lib/data.js`. A generated day currently contains fixed travel, refresh,
destination-visit, and dinner activities. Destinations are selected from the
local array and are not geographically optimized.

The original planning artifacts in the parent workspace include a detailed
pilgrimage document, cost spreadsheet, prompt, and mind map. They are source
requirements and reference material; they are not imported at runtime.

## Security and privacy

- Do not add real API keys, passwords, tokens, or database credentials.
- Do not commit `.env` or `.env.local`.
- Do not include production user data in sample files or project ZIPs.
- Keep future provider credentials server-side.

## Contribution guide

See [CONTRIBUTING.md](./CONTRIBUTING.md) for local validation and review
guidance.
