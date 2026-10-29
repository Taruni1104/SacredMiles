# Yatra Code-Level Audit (Draft)

**Review date:** 2026-10-29  
**Scope:** `grand-pilgrimage-app` source tree, configuration, local build, and
planning requirements available in the workspace.  
**Review type:** Implementation audit, not a penetration test or a complete
production security assessment.

**Update:** The internal navigation and map mount-state lint findings described
below were fixed after the initial audit. A secret-safe, opt-in `/api/ai`
provider boundary was also added. The remaining product and architecture
findings are still open.

## Executive summary

The project is a functional Next.js prototype with four statically generated
routes:

- `/` — journey-type selection.
- `/tours` — searchable local destination catalogue.
- `/map` — Leaflet map with destination markers.
- `/planner` — deterministic itinerary preview.

`npm run build` and `npm run lint` now succeed. The principal product risk is not a
runtime crash but a mismatch between the intended pilgrimage planner and the
implemented algorithm: the current planner does not calculate routes, travel
times, overnight journeys, costs, opening hours, or mandatory temple coverage.

No Redis, database, authentication, payment, AI, or server API integration is
present. Redis is not required for this project.

## Validation evidence

| Check | Result |
|---|---|
| `npm run build` | Pass; all application routes generated |
| `npm run lint` | Pass after resolving A-01 and A-02 |
| Automated tests | No test suite or test script found |
| Redis dependency/configuration | Not present |
| Application routes | `/`, `/map`, `/planner`, `/tours` |

The build emits a warning because another `package-lock.json` exists at
`C:\Users\tarun\package-lock.json`. This does not currently fail the build but
can make workspace-root resolution and future builds less predictable.

## Findings

### A-01 — Lint failure from internal anchor navigation (Resolved)

**Severity:** Medium  
**Confidence:** High  
**Location:** `app/layout.js:23-26`

**Status:** Resolved by replacing internal anchors with `next/link`.

The global navigation uses raw `<a href>` elements for internal Next.js routes.
ESLint reports this for the Home link and the same pattern exists for Tours,
Map, and Planner. This causes `npm run lint` to fail and forfeits client-side
navigation benefits.

**Impact**

- CI quality gates that run lint will fail.
- Full document navigation is used instead of Next.js route transitions.
- Navigation behavior is less consistent with the App Router.

**Recommendation**

Use `next/link` for internal links. Keep external links, such as the
OpenStreetMap attribution, as anchors.

---

### A-02 — Lint failure from mount-state effect in the map (Resolved)

**Severity:** Medium  
**Confidence:** High  
**Location:** `components/features/MapView.js:26-32`

**Status:** Resolved by relying on the route-level `ssr: false` boundary and
removing the redundant mount state.

`MapView` initializes `isMounted` to `false` and immediately calls
`setIsMounted(true)` from a mount effect. The React hooks lint rule rejects this
because it creates a synchronous state update during effect processing.

**Impact**

- `npm run lint` fails.
- The map performs an extra render solely to gate browser-only rendering.
- The current pattern is harder to reason about as the map grows.

**Recommendation**

Keep the route-level `dynamic(..., { ssr: false })` boundary and remove the
redundant client mount state, or replace it with a documented browser-only
boundary pattern that satisfies the current React/Next.js rules.

---

### A-03 — Itinerary algorithm creates unrealistic and potentially misleading schedules

**Severity:** High  
**Confidence:** High  
**Location:** `lib/data.js:100-157`

`generateItinerary()` selects at most one destination per day using array order
and creates fixed activities at 08:00, 10:00, 16:00, and 20:00. It does not use
coordinates, `time_needed`, opening hours, actual transport data, or route
distances.

**Impact**

- A generated plan can claim a plausible schedule while ignoring travel
  feasibility.
- Long-distance destinations may be placed on consecutive days without a
  transport leg.
- The product requirement to reduce travel time and recommend overnight travel
  is not implemented.
- Users could reasonably interpret the result as a practical travel plan.

**Recommendation**

Introduce a validated itinerary domain model with explicit transport legs,
visit durations, meal/rest blocks, accommodation nights, and feasibility
checks. Until then, label the output as a demo preview and show a clear
disclaimer in the UI.

---

### A-04 — Mandatory itinerary constraints are not enforced

**Severity:** High  
**Confidence:** High  
**Location:** `lib/data.js:105-112`

The implementation does not enforce the planning requirements from the
project artifacts, including:

- Including every required temple.
- Starting at Visakhapatnam Airport.
- Ending at Visakhapatnam Airport.
- Supporting the full requested pilgrimage sequence.
- Preferring overnight journeys where useful.

The function simply filters by state, sorts by type, and slices the first
`dayCount` records.

**Impact**

- A 48-day plan can omit required destinations.
- Selecting a region can make mandatory destinations impossible without warning.
- The output does not satisfy the core product acceptance criteria.

**Recommendation**

Represent mandatory destinations separately from optional destinations. Validate
coverage before returning an itinerary and return an explicit warning or error
when the requested duration cannot satisfy the constraints.

---

### A-05 — Planner silently hides available regions

**Severity:** Medium  
**Confidence:** High  
**Location:** `app/planner/page.js:25,77`

The planner derives all unique states but renders only `states.slice(0, 6)`.
The remaining destinations are not selectable through the UI.

**Impact**

- Users cannot plan directly for all regions represented in the data.
- The available choices depend on array ordering rather than an intentional
  product rule.
- The UI does not disclose that the list is truncated.

**Recommendation**

Render the complete list through a select, searchable combobox, or grouped
region control. If a limited list is intentional, provide an explicit
“More regions” interaction.

---

### A-06 — Generation uses an unmanaged artificial timeout

**Severity:** Medium  
**Confidence:** High  
**Location:** `app/planner/page.js:28-35`

The planner uses `setTimeout` to simulate generation but does not retain or
clear the timer when the component unmounts. It also has no error path because
the current generator is synchronous.

**Impact**

- A delayed callback can attempt to update state after navigation.
- The UI communicates an AI-like operation (“Consulting the Stars...”) even
  though no AI or remote generation exists.
- Future asynchronous integration could inherit the missing cancellation/error
  behavior.

**Recommendation**

Remove the artificial delay for the local algorithm, or wrap it in a cancellable
async service with cleanup, explicit error state, and honest copy such as
“Building your preview...”.

---

### A-07 — Map route visualization is non-functional

**Severity:** Medium  
**Confidence:** High  
**Location:** `components/features/MapView.js:44,71`

`pathPositions` is always an empty array, so the `Polyline` never renders a
journey route. The map shows all database markers regardless of the itinerary
selected in the planner.

**Impact**

- The map page does not visualize a user’s path despite the product promise.
- The map and planner are separate experiences with no shared itinerary state.
- The map statistics are not derived from the actual route.

**Recommendation**

Pass a validated itinerary or destination ID list into `MapView`, derive marker
and route positions from that state, and calculate displayed totals from route
data rather than hardcoded values.

---

### A-08 — External marker assets are unpinned and loaded from a third party

**Severity:** Low  
**Confidence:** High  
**Location:** `components/features/MapView.js:11-13`

Leaflet marker images are loaded from `unpkg.com` at runtime and reference
version `1.7.1`, while the installed Leaflet dependency is `1.9.4`.

**Impact**

- Map markers depend on third-party availability and network policy.
- Asset behavior can change independently of the application.
- The runtime version differs from the installed library version.

**Recommendation**

Serve compatible marker assets from the application’s `public/` directory or
resolve them from the installed Leaflet package during the build. Add an
explicit fallback state for tile or marker loading failures.

---

### A-09 — Destination actions are success-shaped placeholders

**Severity:** Medium  
**Confidence:** High  
**Location:** `app/tours/page.js:64`

Every destination card renders a “View Details” button without an event handler
or destination detail route.

The root layout also renders Login and Book Now controls without behavior.

**Impact**

- Users receive controls that do not perform the advertised action.
- This creates broken task flows and reduces trust in the interface.

**Recommendation**

Either implement destination detail, authentication, and booking entry points,
or change the controls to clearly marked “Coming soon” presentation elements
that are not styled as completed actions.

---

### A-10 — Clickable cards and hover-only interaction reduce accessibility

**Severity:** Medium  
**Confidence:** High  
**Location:** `app/page.js:42-62`, `components/features/TripTypeSelection.js:50-62`

The home journey cards use a clickable `<div>`, while the unused
`TripTypeSelection` component changes button styling on mouse enter/leave.
Keyboard activation and non-pointer alternatives are not equivalent.

**Impact**

- Keyboard users may not be able to activate the card as expected.
- Hover-only feedback does not work on touch devices.
- Interactive semantics are unclear to assistive technology.

**Recommendation**

Use semantic links or buttons for navigation, provide visible `:focus-visible`
states, and keep the interactive target singular. Remove or wire the duplicate
selection component so it cannot diverge from the home flow.

---

### A-11 — Duplicate, unused trip-selection implementation

**Severity:** Low  
**Confidence:** High  
**Location:** `components/features/TripTypeSelection.js:19-67`

`TripTypeSelection` duplicates the home-page journey cards but is not used by an
application route. Its buttons do not navigate to the planner.

**Impact**

- Product behavior can diverge between two implementations.
- Dead code increases maintenance and audit surface.
- Future fixes may be applied to only one copy.

**Recommendation**

Remove the unused component or make the home page consume it, adding the
navigation callback as an explicit prop.

---

### A-12 — No automated regression coverage for core planning behavior

**Severity:** High  
**Confidence:** High  
**Location:** Project-wide; `package.json`

There is no test script and no test file for itinerary generation, filtering,
navigation, map loading, or accessibility behavior.

**Impact**

- Required-temple omissions and route feasibility regressions can go unnoticed.
- Refactoring the planner is risky.
- The project cannot demonstrate acceptance of the planning artifacts.

**Recommendation**

Start with unit tests for `generateItinerary()` and destination filtering, then
add component tests for planner controls and an end-to-end test for the primary
journey selection flow.

## Architecture and scope observations

These are not necessarily defects in a prototype, but they are material gaps
against the intended product:

- No server/API boundary exists.
- No persistent database exists.
- No authentication or authorization exists.
- No cost calculation is connected to the spreadsheet requirements.
- No transport, accommodation, restaurant, booking, review, language, offline,
  or AI integration exists.
- `time_needed` is stored but unused.
- The map summary values are hardcoded.
- The legacy `app/page.module.css` appears unused.

These should be tracked as explicit product backlog items rather than treated
as hidden implementation capabilities.

## Security review boundary

No obvious application secret was found in the reviewed source tree, and the
project does not currently expose a backend or persistence layer. This draft is
not a full security review. Before introducing accounts, payments, external
providers, or AI, perform a dedicated assessment covering authentication,
authorization, input validation, SSRF/provider calls, secret handling, privacy,
rate limiting, and dependency vulnerabilities.

## Remediation priority

### P0 — Before presenting as a real travel planner

1. Implement or explicitly scope the mandatory destination and
   Visakhapatnam start/end constraints.
2. Replace fixed schedules with feasibility-aware itinerary logic.
3. Add warnings and disclaimers so demo output cannot be mistaken for verified
   travel advice.

### P1 — Before merge or deployment

1. Fix A-01 and A-02 so lint passes.
2. Add tests for itinerary generation and required coverage.
3. Connect the planner to the map or clearly label the map as an independent
   destination explorer.
4. Remove or implement placeholder actions.

### P2 — Product completeness

1. Show all regions.
2. Add destination detail pages and real content.
3. Move marker assets into the project.
4. Add cost, transport, accommodation, and persistence services.

## Suggested acceptance criteria for the next milestone

- `npm run lint` passes with zero errors.
- `npm run build` passes without workspace-root ambiguity.
- A test proves all mandatory destinations are either included or reported as
  infeasible.
- A test proves the generated plan starts and ends at the configured airports.
- A generated itinerary exposes real transport legs and does not claim
  unverified schedules.
- The map receives the generated route and displays the same destination order.
- Every visible primary button has a defined action or an explicit disabled/
  coming-soon state.
