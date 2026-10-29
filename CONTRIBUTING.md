# Contributing

## Local setup

Requirements:

- Node.js compatible with the installed Next.js version.
- npm.

Install dependencies and start the development server:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

No Redis server, database, API key, or external service is required for the
current prototype.

## Validation

Run the production build:

```powershell
npm run build
```

Run linting:

```powershell
npm run lint
```

The repository currently has no automated test suite. New behavior should add
tests before adding external services or changing itinerary rules.

## Change guidelines

- Keep destination data and itinerary rules in `lib/data.js` unless a new
  service boundary is required.
- Reuse components from `components/ui/`.
- Preserve responsive behavior and keyboard-accessible controls.
- Do not commit `.env`, API keys, passwords, user data, or generated folders.
- Update `README.md` and `ARCHITECTURE.md` when runtime behavior changes.
- Keep external integrations behind explicit adapters with timeout and error
  handling.

## Suggested pull-request checklist

- [ ] The feature has a clear user-facing requirement.
- [ ] Loading, empty, error, and success states are handled.
- [ ] Keyboard and responsive behavior were checked.
- [ ] `npm run lint` was run.
- [ ] `npm run build` was run.
- [ ] Documentation and `.env.example` were updated if configuration changed.
- [ ] No secrets or generated files are included.
