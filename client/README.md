# Dishari client (Next.js + Tailwind)

Frontend for the on-campus placement portal. Light and dark themes, built on Next.js App Router and Tailwind v4.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Put this folder in your repo as `client/`.

## Try it

On `/login` use the two demo buttons:

- **Nusrat** (student, CSE at SUST): has a pending invite, a declined invite to retry, and a screening test to take.
- **Rafiq** (alumni at Nodi Tech): has an invitation to accept and a connected cohort with test results to shortlist.

Verification code in demo mode: `123456`.

## Demo mode

There is no backend connection yet. `lib/store.tsx` is an in-browser database (saved to localStorage) that
implements the rules from your brief:

- A student joins the cohort for their university and department, or starts it if they're first.
- A person can't be invited twice at a time, and a declined invitation can be sent again.
- If someone at a company is invited or has accepted, colleagues at that company are locked out of that cohort.
- Contact numbers are masked until a verified student looks at them.
- Verified alumni connected to a cohort can create a screening test, review scores and shortlist.

To connect your FastAPI backend, replace the bodies of the actions in `lib/store.tsx` with `fetch` calls and keep the signatures.
The pages only call those actions.

## Customise

- Name, Bangla wordmark, tagline: `lib/brand.ts`
- Colours (both themes): top of `app/globals.css`
- Sample data: `lib/seed.ts` (companies and people are fictional; only SUST's email domain is real)

## Structure

```
app/                 pages (landing, alumni, cohorts, auth, dashboard, cohort, invitations, tests, profile)
components/          Header, IdCard, ProgressBar, chips, guards
lib/                 types, selectors (pure rules), store (demo backend), seed
```
