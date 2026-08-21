# Administrative Repair Verification — 2026-08-21

## Local browser smoke checks

| Route | Confirmed behavior |
| --- | --- |
| `/` | The repaired public homepage loads successfully, retains its public navigation, and keeps orientation actions available to anonymous visitors only. |
| `/volunteer` | The page renders a real public enquiry form with full name, email, relevant-experience context, and message fields. Its explanatory copy states that it is delivered to the separate **Public Form Submissions** inbox and is not shared with sponsors. |
| `/terms` | The dedicated Terms route loads with a complete governance-page structure and a clear public policy destination. |
| `/foundation-updates` | The editable public Updates route loads a truthful “no public updates” state while no approved publication is available; it does not expose unpublished administrative content. |

## Automated verification

| Check | Result |
| --- | --- |
| TypeScript | `pnpm tsc --noEmit` passed. |
| Regression suite | `pnpm test` passed: 18 tests. |
| Production build | `NODE_ENV=production pnpm build` passed with the required `next build --webpack` configuration. |

The test coverage now includes the sponsor-only Foundation Conversations boundary, protected two-way sponsor threads, separated public form submissions, persistent Team headshots, controlled editorial pages, legal-page rendering, finance-control removal, and resilient operational audit rendering.
