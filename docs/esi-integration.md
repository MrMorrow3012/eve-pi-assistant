# ESI integration plan

The EVE Swagger Interface (ESI) is the official REST API for EVE third-party applications. The application should combine ESI with the Static Data Export (SDE), because neither source alone covers the full planning workflow.

## Public data — no character login

The GitHub Pages client can use public ESI operations for:

- resolving a typed system name to its EVE ID;
- retrieving system metadata and planet IDs;
- retrieving individual planet metadata; and
- calculating an occasional route between a home and candidate system.

`web/esi.js` provides the browser adapter. It sends `X-Compatibility-Date` and `X-User-Agent` headers and keeps a small in-memory cache. v0.8 uses it only when the player explicitly requests a public route comparison; the static SDE route remains the default.

For a large “all systems within N jumps” search, generate the stargate graph from the SDE and run breadth-first search locally. Calling ESI once for every candidate route would be unnecessarily slow and waste CCP resources.

## Static data

Use the SDE generation pipeline for:

- the complete system, planet, and stargate graph;
- planet-type resource relationships;
- P0–P4 product types; and
- schematics, inputs, outputs, quantities, and cycle times.

Generated browser data should retain CCP IDs so a selected record can be refreshed or supplemented through ESI.

## Character-private data — intentionally out of scope

The current product decision is to operate without character login. Existing colonies and other private character information will not be requested. This avoids asking players to authorize a planning tool and keeps the GitHub Pages application useful without an account connection.

Do not add client secrets, access tokens, refresh tokens, or authenticated ESI scopes to this repository. If login is reconsidered in the future, it must be a separate, explicit security-design milestone rather than a requirement for the planner.

## Operational rules

- Use unversioned ESI paths with a reviewed `X-Compatibility-Date`.
- Recheck the API Explorer before raising the compatibility date.
- Respect `Expires`, `ETag`, rate-limit, and error-limit response headers.
- Do not poll before CCP's cache expiry.
- Keep PI restrictions data-driven; ESI returning planets does not mean colonies are permitted.
- Treat live POCO taxes and character colonies separately from static universe data.

## Planned sequence

1. Generate verified universe and PI datasets from the SDE. **Complete**
2. Add local breadth-first jump search using the generated stargate graph. **Complete**
3. Add optional route preference and hauling comparison using `POST /route/{origin}/{destination}`. **Complete**
4. Add public market-price retrieval with cache-aware behavior.
5. Continue improving the unauthenticated workflow; character import remains out of scope.
