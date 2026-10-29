# Yatra Architecture

## Scope

Yatra is a Next.js App Router prototype for exploring Indian pilgrimage
destinations, viewing them on a map, and generating a simple day-by-day
itinerary.

The frontend stack is semantic HTML rendered through React JSX, JavaScript,
Bootstrap 5 for responsive UI, and custom CSS for the visual design system.
Next.js provides the React runtime, routing, and build tooling; it is not a
replacement for the required frontend technologies.

The current application is deliberately local and dependency-light:

- Destination data is a JavaScript constant in `lib/data.js`.
- Itinerary generation is deterministic and synchronous apart from a UI-only
  800 ms delay.
- The optional intermediate backend uses Node.js, Express, and MySQL.
- The frontend still works locally without MySQL.
- AI, Redis, authentication, and payment services are deferred.
- Leaflet is loaded only in the browser because it depends on browser APIs.

## Runtime flow

```text
Home (/)
  -> user selects a trip type
  -> /planner?type=<trip-type>

Tours (/tours)
  -> reads DESTINATIONS_DB
  -> filters by name, state, or type

Map (/map)
  -> dynamically loads MapView with SSR disabled
  -> renders destination coordinates as Leaflet markers

Planner (/planner)
  -> reads query-string trip type
  -> collects start date, days, region, and trip type
  -> calls generateItinerary()
  -> renders an editable ItineraryTimeline
  -> stores the current local itinerary in browser storage

Map (/map)
  -> reads the locally saved itinerary when available
  -> renders its destination coordinates as a connected route
```

## Source layout

- `app/`: routes, root layout, global styles, and page-level UI.
- `components/ui/`: reusable `Card`, `CardHeader`, `CardContent`, and `Button`.
- `components/features/`: map, itinerary timeline, and trip-selection features.
- `lib/data.js`: destination records, trip types, and the itinerary function.
- `server/index.js`: optional Express/MySQL API for destinations and saved
  itinerary metadata.
- `database/schema.sql`: small MySQL schema for the intermediate backend.
- `python/itinerary_helper.py`: standalone standard-library planning utility.
- `public/`: static assets.

## Data model currently implemented

Each destination has:

```js
{
  id,
  name,
  state,
  type,
  time_needed,
  lat,
  lng,
  description
}
```

Generated itinerary days additionally include a date, destination ID,
coordinates, estimated travel distance, and estimated travel minutes.

## Current itinerary algorithm

1. Copy the destination list.
2. Filter by state when a specific state is selected.
3. Sort temples first for pilgrimage mode or sightseeing locations first for
   sightseeing mode.
4. Take at most one destination per requested day.
5. Estimate consecutive-leg distance using the Haversine formula and derive a
   local travel-time estimate.
6. Add dated activities for travel, refreshment, the destination visit, and
   dinner.
7. Fill unused days with a generic relaxation/travel day.
8. Estimate transport, accommodation, food, and donation costs in INR.

This remains a prototype algorithm. It does not use live routing, opening
hours, transport schedules, overnight travel, booking prices, or a required
start/end point. Users can reorder generated days in the planner; the current
order is persisted in browser storage and used by the map route.

## Planned production architecture

The next architecture increment should add:

1. A persistence layer for destinations, routes, users, saved itineraries, and
   cost estimates.
2. Server-side route and itinerary services with schema validation.
3. A routing provider for travel time and distance.
4. An authentication provider and per-user authorization.
5. A constrained itinerary engine that includes mandatory temples and validates
   the Visakhapatnam start/end requirement.
6. Observability for API failures, provider timeouts, and itinerary-generation
   decisions.

Redis is optional future infrastructure for caching and background jobs. It is
not part of the current application and must not be required for local startup.
