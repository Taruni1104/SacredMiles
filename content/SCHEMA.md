# SacredMiles Destination Content Schema

Every file under `content/destinations/<id>.json` must conform to this schema.
The `id` and `slug` must exactly match the corresponding entry in `lib/data.js`.

## Top-level fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | Matches `DESTINATIONS_DB[n].id` exactly |
| `slug` | string | ✓ | Same as `id` — used in URL `/destinations/<slug>` |
| `name` | string | ✓ | Display name |
| `alternativeNames` | string[] | | Sanskrit, regional, or historical names |
| `category` | `"temple" \| "sightseeing"` | ✓ | Matches `DESTINATIONS_DB[n].type` |
| `city` | string | | Nearest city or town |
| `state` | string | ✓ | Matches `DESTINATIONS_DB[n].state` |
| `country` | string | ✓ | Always `"India"` for current catalogue |
| `coordinates` | `{ lat: number, lng: number }` | ✓ | Matches `DESTINATIONS_DB[n].lat/lng` |
| `overview` | string | ✓ | 2–4 sentence editorial introduction |
| `historicalBackground` | ContentSection | | See below |
| `religiousSignificance` | ContentSection | | |
| `legendsAndTraditions` | ContentSection | | |
| `architecture` | ContentSection | | |
| `ritualsAndFestivals` | ContentSection | | |
| `thingsToExplore` | ThingToExplore[] | | |
| `visitorInformation` | VisitorInformation | | |
| `bestTimeToVisit` | string | | e.g. "October to March" |
| `howToReach` | HowToReach | | |
| `nearbyPlaces` | NearbyPlace[] | | IDs from `DESTINATIONS_DB` preferred |
| `gallery` | GalleryImage[] | | Wikimedia Commons images only (initially) |
| `sources` | Source[] | ✓ | At least one source per content file |
| `verificationStatus` | `"draft" \| "pending_review" \| "approved" \| "rejected"` | ✓ | |
| `lastVerified` | string (ISO date) | ✓ | |
| `contentVersion` | number | ✓ | Increment on each substantive edit |

## ContentSection

```json
{
  "text": "Narrative text.",
  "classification": "documented-fact | religious-tradition | legend | modern-visitor-info",
  "sourceIds": ["source-0"],
  "completeness": "complete | partial | stub"
}
```

`classification` is mandatory. Never mark a religious belief or legend as
`"documented-fact"`.

## ThingToExplore

```json
{
  "name": "Kashi Vishwanath Corridor",
  "description": "...",
  "type": "landmark | ritual | experience | cultural"
}
```

## VisitorInformation

```json
{
  "entryFee": { "amount": 0, "currency": "INR", "notes": "Free entry", "sourceId": "source-0", "verificationStatus": "verified | unverified" },
  "openingHours": { "summary": "4 AM – 11 PM", "sourceId": null, "verificationStatus": "unverified" },
  "dressCode": "...",
  "photographyPolicy": "...",
  "accessibilityNotes": "...",
  "bestArrivalTime": "..."
}
```

Never hardcode fees or hours without a verified source. Use `null` and
`"unverified"` when unknown.

## HowToReach

```json
{
  "nearestAirport": { "name": "...", "distanceKm": 0 },
  "nearestRailway": { "name": "...", "distanceKm": 0 },
  "roadAccess": "...",
  "localTransport": "..."
}
```

## NearbyPlace

```json
{ "id": "sarnath", "name": "Sarnath", "distanceKm": 12, "notes": "..." }
```

Prefer IDs from `DESTINATIONS_DB` so the app can resolve them.

## GalleryImage

```json
{
  "wikimediaFile": "File:Kashi_Vishwanath_Temple_Varanasi.jpg",
  "thumbUrl": "https://upload.wikimedia.org/...",
  "fullUrl": "https://upload.wikimedia.org/...",
  "filePageUrl": "https://commons.wikimedia.org/wiki/File:...",
  "title": "...",
  "author": "...",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
  "attributionRequired": true,
  "usable": true,
  "notes": ""
}
```

Never invent image URLs. `usable` must be `false` if the licence is not
confirmed compatible with the app's intended use.

## Source

```json
{
  "id": "source-0",
  "title": "...",
  "publisher": "...",
  "url": "https://...",
  "sourceType": "official-temple | government-tourism | heritage-authority | academic | news",
  "accessedDate": "2026-10-30",
  "supportsFields": ["overview", "historicalBackground"],
  "verificationStatus": "verified | partially_verified | unverified"
}
```
