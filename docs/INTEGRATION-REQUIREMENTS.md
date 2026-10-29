# Integration Requirements

This document records integrations described by the planning artifacts but not
implemented in the current prototype.

## Maps and routing

Purpose:

- Render destination markers.
- Calculate route order.
- Estimate travel distance and duration.
- Draw the selected itinerary route.

Required contract:

- Geocode or accept trusted latitude/longitude.
- Return route legs with distance, duration, and mode.
- Enforce request timeouts and provider error handling.
- Never expose private provider keys in client-side code.

The current map uses Leaflet with OpenStreetMap tiles and does not require an
API key.

## Persistence

Future entities:

- Destinations.
- Transport routes.
- Accommodation.
- Events.
- Users and preferences.
- Saved itineraries.
- Reviews.
- Cost estimates.

The current application has no database and must continue to work without one
until persistence is intentionally introduced.

## Future AI itinerary generation

AI is intentionally deferred in the intermediate version. If an AI provider is
added later, the service should:

- Receive validated, structured preferences.
- Preserve mandatory destinations.
- Return schema-validated JSON rather than unstructured text.
- Apply deterministic route and safety checks after model output.
- Avoid sending secrets or unnecessary personal data.
- Record provider errors without silently returning a successful-looking plan.

AI should assist with explanations and suggestions; it should not be the sole
source of truth for distances, schedules, prices, or temple opening rules.

## Authentication and booking

Future authentication should protect:

- Saved itineraries.
- Travel history.
- Personal preferences.
- Reviews.
- Booking records.

Payment and booking integrations require server-side credential storage,
provider webhooks, idempotency, audit logging, and explicit consent flows.

## Redis

Redis is not used. Local development must not require it.

## Configuration policy

Use `.env.example` for names only. Never commit real values in `.env`, logs,
screenshots, ZIP files, or documentation.
