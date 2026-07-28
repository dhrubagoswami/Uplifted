# Impact Flow — Frontend Build Instructions

You are building the production frontend for **Impact Flow**, a donation platform. The visual design already exists as static HTML files (from Claude Design). Your job is to convert them into a real React application with working navigation, working forms, and a data layer that mimics a backend.

**Phase 1 = frontend only, deployed to Vercel, no server.** Phase 2 will add a real API. Everything you write must survive that transition without a rewrite.

---

## 0. Non-negotiable rules

1. **Never fetch dummy data directly from a component.** All data access goes through `src/api/*` service functions that are `async`, return Promises, and simulate latency. Phase 2 replaces their bodies with `fetch`. Nothing else changes.
2. **No `localStorage` / `sessionStorage`** unless I explicitly ask. Use React context + state.
3. **Money is stored as integer paise everywhere.** Format only at render, via one helper. `430000` in the data means ₹4,300.00 — pick this convention and hold it.
4. **Do not redesign.** The HTML is the source of truth for visuals. Extract its tokens, don't invent new ones. If a design decision is missing, match the nearest existing pattern and leave a `// TODO(design):` comment.
5. **Do not invent screens.** Build exactly the routes listed in §4.
6. **Every screen renders loading, empty, and error states.** No exceptions, including tables.
7. **TypeScript strict mode.** No `any`. Types live in `src/types/` and are the contract Phase 2 must honour.
8. Stop and ask me before installing any dependency not listed in §2.

---

## 1. Task order

Work through these phases in order. **Stop at the end of each phase, summarise what you built in 5 lines or fewer, and wait for my go-ahead.** Do not run ahead.

| Phase | Deliverable |
|---|---|
| P0 | Scaffold, tooling, design tokens extracted from HTML, Vercel deploy of an empty shell |
| P1 | Type definitions + mock database + API service layer + React Query wiring |
| P2 | UI primitive component library |
| P3 | Layouts, routing, theme + currency contexts |
| P4 | Public zone screens |
| P5 | Donation flow (multi-step, stateful) |
| P6 | Donor account zone |
| P7 | Admin zone |
| P8 | Kiosk zone |
| P9 | Responsive audit, a11y audit, Vercel production deploy |

---

## 2. Stack

Fixed. Do not substitute.

```
Vite + React 18 + TypeScript (strict)
react-router-dom v6            routing
@tanstack/react-query v5       server-state (critical — see §5)
tailwindcss v3                 styling
lucide-react                   icons
recharts                       charts
react-hook-form + zod          forms + validation
clsx + tailwind-merge          class composition (export a `cn()` helper)
```

Dev: eslint, prettier, `@typescript-eslint`. No component library (no MUI, no shadcn install — hand-build primitives from the HTML).

---

## 3. Project structure

```
src/
  api/            service layer — the ONLY place mock data is touched
    client.ts     delay(), simulateError(), ApiError class
    campaigns.ts  donations.ts  organizations.ts  donors.ts
    auth.ts       analytics.ts  payments.ts  kiosks.ts
  mocks/          the fake database
    db.ts         in-memory store, mutable, seeded on import
    seed/         campaigns.ts donations.ts donors.ts organizations.ts analytics.ts
  types/          domain types — Campaign, Donation, Donor, Organization, ApiResponse<T>
  hooks/          useCampaigns, useDonation, useTheme, useCurrency, useIdleTimeout...
  contexts/       ThemeContext, CurrencyContext, AuthContext, DonationFlowContext
  components/
    ui/           primitives (§7)
    campaign/     domain components
    donation/     charts/  admin/  kiosk/
  layouts/        PublicLayout AccountLayout AdminLayout KioskLayout
  pages/          public/ account/ admin/ kiosk/
  lib/            cn.ts  format.ts  constants.ts  validators.ts
  styles/         globals.css (CSS variables from the HTML)
  routes.tsx      single route table
  main.tsx  App.tsx
```

---

## 4. Route table

Build exactly this. Every route must be reachable by clicking through the UI.

**Public** (`PublicLayout`)
```
/                          Home
/campaigns                 Browse + filters
/campaigns/:slug           Campaign detail
/campaigns/:slug/donate    Donation flow (4 steps, own sub-state)
/donation/success/:id      Confirmation + receipt
/organizations/:slug       Organization profile
/how-it-works              Transparency + fees
/about                     About
/search                    Search results (reads ?q=)
/help                      FAQ
/login  /signup            Donor auth
*                          404
```

**Donor account** (`AccountLayout`, guarded, role `donor`)
```
/account                   Overview
/account/donations         History
/account/recurring         Manage monthly gifts
/account/saved             Saved campaigns
/account/settings          Profile / payment methods / preferences
```

**Admin** (`AdminLayout`, guarded, role `admin`)
```
/admin/login               Org login (unguarded)
/admin                     Dashboard
/admin/campaigns           Campaign table
/admin/campaigns/new       5-step create wizard
/admin/campaigns/:id       Campaign analytics
/admin/campaigns/:id/edit  Edit (reuse wizard)
/admin/donations           Transactions + detail drawer
/admin/donors              Donors + drill-in drawer
/admin/analytics           Charts
/admin/payouts             Balance + settlements
/admin/kiosks              Devices + pairing modal
/admin/settings            Org / team / payments / security
```

**Kiosk** (`KioskLayout`, no global nav, dark locked)
```
/kiosk                     Attract screen
/kiosk/browse              Campaign grid
/kiosk/campaign/:slug      Simplified detail
/kiosk/give/:slug          Amount → pay → optional receipt email
/kiosk/thanks/:id          Thank you + auto-reset
```

**Dev**
```
/dev/sitemap               Plain list of every route as links. Ship it.
```

---

## 5. Data layer — this is the part that must not be a hassle later

### 5.1 Three strict layers

```
Component  →  React Query hook  →  api service fn  →  mocks/db
                                   ^^^^^^^^^^^^^^^
                              Phase 2 replaces ONLY this body
```

A component that imports from `src/mocks/` is a bug.

### 5.2 Service function contract

Every service function is async, takes a typed params object, returns a typed Promise, throws `ApiError` on failure.

```ts
// src/api/client.ts
export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) { super(message) }
}
export const delay = (ms = 300 + Math.random() * 400) =>
  new Promise(r => setTimeout(r, ms))

// src/api/campaigns.ts
export interface ListCampaignsParams {
  page?: number; limit?: number; category?: Category[];
  sort?: 'trending' | 'newest' | 'ending' | 'closest' | 'funded';
  verifiedOnly?: boolean; urgentOnly?: boolean; q?: string;
}
export interface Paginated<T> {
  data: T[]; page: number; limit: number; total: number; totalPages: number
}

export async function listCampaigns(p: ListCampaignsParams = {}): Promise<Paginated<Campaign>> {
  await delay()
  // filter/sort/paginate against db.campaigns — same semantics a real API would apply
  return { data, page, limit, total, totalPages }
}

export async function getCampaign(slug: string): Promise<Campaign> {
  await delay()
  const c = db.campaigns.find(x => x.slug === slug)
  if (!c) throw new ApiError(404, 'Campaign not found', 'CAMPAIGN_NOT_FOUND')
  return c
}
```

Rules:
- **Filtering, sorting, searching and pagination happen inside the service function**, not in the component. That logic moves to the server in Phase 2 and the component never learns.
- Paginated endpoints always return the `Paginated<T>` envelope. Never a bare array.
- Writes mutate `db` so the demo feels alive — donate, and the campaign's raised total and donor count actually go up, and the ticker picks it up.
- Every write returns the created/updated entity, exactly as a REST API would.
- IDs use realistic prefixed formats generated by a helper: `cmp_x7k2m`, `don_9f3b1`, `org_2a8dc`, `dnr_5k1pz`. Receipts: `IF-2026-004821`.
- Timestamps are ISO 8601 strings, never `Date` objects, in the data layer.

### 5.3 Required endpoints

```
campaigns:     list, get(slug), create, update, updateStatus, listUpdates, addUpdate
organizations: list, get(slug), getCampaigns
donations:     list(filters+pagination), get(id), create, refund, listByCampaign,
               listByDonor, getRecent(n)   ← ticker
donors:        list, get(id), getStats
auth:          login({email,password,role}), logout, getSession
payments:      createIntent(amount, method), confirmPayment(intentId) ← the seam for Razorpay/Stripe
analytics:     getDashboardKpis, getRevenueSeries(range), getChannelSplit,
               getFunnel, getTopCampaigns, getRetention
kiosks:        list, get(id), pair(code), heartbeat
account:       getProfile, updateProfile, listRecurring, pauseRecurring,
               cancelRecurring, listSaved, toggleSaved
```

`payments.confirmPayment` must be the single place a real gateway plugs in. Fake it with a 1.5s delay and a 100% success rate, but keep a `SIMULATE_FAILURE` flag in `lib/constants.ts` so I can demo the error state.

### 5.4 React Query

- `QueryClientProvider` in `App.tsx`, `staleTime: 30_000`, `retry: 1`.
- Query keys are structured arrays: `['campaigns', 'list', params]`, `['campaigns', 'detail', slug]`.
- Mutations invalidate the right keys. Creating a donation invalidates `['campaigns','detail',slug]`, `['donations']`, and `['analytics']`.
- Use `isPending` for skeletons and `isError` for error states. No manual `useState` loading flags.
- Live ticker: `useQuery` on `donations.getRecent` with `refetchInterval: 5000`.

### 5.5 Mock DB

`src/mocks/db.ts` exports a mutable object seeded from `src/mocks/seed/`. Seed data is defined once and typed with the real domain types — if it doesn't typecheck against `Campaign`, the seed is wrong, not the type.

Seed contents (already specified in the design doc — reuse the exact figures):
12 campaigns, 4 organizations, 40 donations, 20 donors, 5 kiosk devices, 90 days of daily revenue with a weekend dip and one launch spike, one logged-in donor (Ananya Rao), one logged-in admin (Vikram Menon, Saathi Foundation).

Campaigns 1, 2 and 4 get full story copy, 4 dated updates and 4 FAQs. The rest get short versions.

---

## 6. Converting the HTML

For each HTML file:

1. Read it fully before writing anything.
2. On the **first** file only: extract every CSS custom property into `src/styles/globals.css` under `:root` and `.dark`, and map them in `tailwind.config.js` as semantic names — `bg`, `surface`, `surface-2`, `border`, `text`, `text-2`, `text-3`, `primary`, `violet`, `accent`, `success`, `warning`, `danger`. From then on use `bg-surface`, `text-text-2` etc. **No hex literals in any component.**
3. Identify repeated blocks and extract them to `components/` before building the page. Do not copy-paste a card three times.
4. Convert inline `<script>` behaviour to React state and effects. Delete the scripts.
5. Replace hardcoded content with data from hooks.
6. Preserve exact spacing, radii, shadows, animation durations and easing curves from the HTML.
7. Keep `prefers-reduced-motion` handling.

If two HTML files disagree on a token value, use the one from the home page and tell me.

---

## 7. Component library (Phase P2)

Build in `src/components/ui/`. Each: typed props, `forwardRef` where it wraps a DOM element, variants via a `cn()` + variant-map pattern, and support for `className` override.

```
Button Input Textarea Select Checkbox Radio Switch Slider
Badge Pill Avatar AvatarStack Tooltip Skeleton Spinner Divider
Card StatTile ProgressMeter Tabs Accordion Modal Drawer BottomSheet
Toast/Toaster EmptyState ErrorState DataTable Pagination FilterBar
SearchCommand ThemeToggle CurrencyToggle StepIndicator
```

**`ProgressMeter`** is the signature component — segmented fill, one segment per impact unit, capped at 60 segments with ratio scaling above that, leading segment glowing in `--accent`, single-line caption below, collapses to a continuous bar under 640px, animates 0→value once on scroll into view. Get this one right.

**`DataTable`** is generic: `DataTable<T>` with column defs, sort, row click, bulk select, and a pagination footer wired to the `Paginated<T>` envelope. Every admin table uses it. Do not hand-roll a second table.

---

## 8. Contexts

- **ThemeContext** — `'light' | 'dark' | 'system'`, applies `.dark` to `<html>`, reads `prefers-color-scheme`, in-memory only.
- **CurrencyContext** — `'INR' | 'USD'`, exposes `format(paise: number): string` with Indian digit grouping for INR, 83:1 conversion for USD. Every money value on screen goes through it.
- **AuthContext** — `{ user, role, login, logout, isLoading }`. Fake: any credentials succeed, role determined by which login page was used. `<RequireAuth role="admin">` wrapper handles guarding and redirects with a `from` state.
- **DonationFlowContext** — holds the 4-step form state so Back never loses data, scoped to the `/campaigns/:slug/donate` route subtree.

---

## 9. Screen-specific requirements

**Donation flow** — 4 steps in one route with an internal step state, not 4 routes. Step 1 amount (one-time/monthly toggle, 4 impact chips, custom input, fee-cover checkbox default on). Step 2 details (anonymity switch greys the name field). Step 3 payment method tiles (UPI / Card / Net Banking / Wallet / PayPal) with real validation via zod. Step 4 review with per-section edit links, then `payments.confirmPayment` → `donations.create` → navigate to `/donation/success/:id`. Sticky summary rail on desktop, collapsible header on mobile.

**Admin create-campaign wizard** — 5 steps, live `CampaignCard` preview updating as you type, save-as-draft calling `campaigns.create` with `status: 'draft'` on every step.

**Kiosk** — `KioskLayout` locks dark theme, hides global nav, and mounts `useIdleTimeout(60_000)` which shows a 10s warning modal then routes to `/kiosk`. Minimum touch target 72px, primary buttons ≥96px tall. No hover-dependent affordances. Design target 1080×1920 portrait.

**Search** — reads `?q=`, debounced 300ms, updates the URL, searchable across campaigns and organizations.

**Browse filters** — all filter state lives in the URL query string so the page is shareable and back/forward works.

---

## 10. Quality floor (enforce in P9, but don't violate along the way)

- Breakpoints 390 / 768 / 1024 / 1440. Test the donation flow and every admin table at 390px.
- WCAG 2.1 AA contrast in both themes. Visible keyboard focus ring everywhere. Focus trap in modals and drawers. Skip-to-content link. Labelled inputs. `aria-live="polite"` on the ticker.
- No console errors or warnings.
- `npm run build` clean, zero TS errors.
- Route-level code splitting with `React.lazy` + `Suspense`. Kiosk and admin zones must not ship in the public bundle.
- Lighthouse ≥ 90 performance and ≥ 95 accessibility on `/` and `/campaigns`.

---

## 11. Vercel

- `vite build` → `dist`. Framework preset: Vite.
- Add `vercel.json` with an SPA rewrite so deep links work:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- Env vars via `import.meta.env.VITE_*` only. Add `VITE_API_BASE_URL` now, unused, so Phase 2 has a slot.
- Deploy at the end of P0 (empty shell) and again at P9. Preview deploys on every branch.

---

## 12. Working style

- Small commits, conventional messages: `feat(campaigns): add browse filters`.
- Run `tsc --noEmit` and the linter before declaring a phase complete.
- If the HTML is missing a state the spec requires (empty table, failed payment), build it to match the surrounding design and flag it in your phase summary.
- If you're about to duplicate more than ~15 lines, extract a component instead.
- Don't write tests in Phase 1 unless I ask.

Start with **P0**. Confirm the plan and the HTML files you can see, then scaffold.
