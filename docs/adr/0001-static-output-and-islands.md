# ADR 0001: Static output with islands, and no client router framework

- **Status:** accepted
- **Date:** 2026-11-04

## Context

The site is mostly content: a home page, a list of case studies and one page per case. The only interaction at the time of this decision was the language switcher, which is a plain link. Later demos may add islands. The performance budget is LCP under 2.5 s at p75 on real devices, with the aim of very little JavaScript per page.

## Decision

- Build with `output: 'static'`. No server runtime is needed to render content.
- Render everything as `.astro` components with zero JavaScript by default.
- Hydrate an island only when the interaction justifies it, and record the hydration directive (`client:visible`, `client:idle`) in the pull request.
- Use `ClientRouter` for navigations between pages, not a client-side SPA framework.

## Trade-offs

- Pages are generated at build time, so content changes need a rebuild. For a portfolio that changes weekly, this is acceptable.
- Interactive features that need shared state across the whole app would push the project toward a framework. That is a conscious limit, to be revisited with a new ADR.
- Server islands (`server:defer`) are available for dynamic parts, at the cost of one request per block.

## Consequences

- JavaScript sent per page stays close to the bundles the islands need. `lighthouserc.json` enforces a script-size budget in CI.
- Adding a new island is a conscious change, not a default. The reviewer checks its hydration directive.

## Rollback

Each feature ships behind its own component. Reverting means removing the component and its route, with no data migration.

## Accessibility and testing

Skip link, visible focus, reduced-motion support and language attributes per page. The Lighthouse CI assertions require an accessibility score of 1 on the main routes.
