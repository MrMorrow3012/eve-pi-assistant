# ESI integration plan

The EVE Swagger Interface (ESI) is the official REST API for EVE third-party applications. The application should combine ESI with the Static Data Export (SDE), because neither source alone covers the full planning workflow.

## Public data — no character login

The GitHub Pages client can use public ESI operations for:

- resolving a typed system name to its EVE ID;
- retrieving system metadata and planet IDs;
- retrieving individual planet metadata; and
- calculating an occasional route between a home and candidate system.

`web/esi.js` provides the browser adapter. It sends `X-Compatibility-Date` and `X-User-Agent` headers and keeps a small in-memory cache. The local prototype does not call it until the generated records contain verified CCP IDs.

For a large “all systems within N jumps” search, generate the stargate graph from the SDE and run breadth-first search locally. Calling ESI once for every candidate route would be unnecessarily slow and waste CCP resources.

## Static data

Use the SDE generation pipeline for:

- the complete system, planet, and stargate graph;
- planet-type resource relationships;
- P0–P4 product types; and
- schematics, inputs, outputs, quantities, and cycle times.

Generated browser data should retain CCP IDs so a selected record can be refreshed or supplemented through ESI.

## Character-private data — EVE login required

Existing colonies and other private character information require EVE SSO and the exact scopes listed for the relevant operation in CCP's current API Explorer. Authorization Code with PKCE is the appropriate OAuth pattern for a browser-based client that cannot safely contain a client secret.

Do not commit client secrets, access tokens, or refresh tokens to GitHub. Before enabling login, register the application and callback URL in the EVE Developers Portal, verify `state`, validate returned JWTs, request only necessary scopes, and decide whether tokens will be session-only or managed by a small backend.

## Operational rules

- Use unversioned ESI paths with a reviewed `X-Compatibility-Date`.
- Recheck the API Explorer before raising the compatibility date.
- Respect `Expires`, `ETag`, rate-limit, and error-limit response headers.
- Do not poll before CCP's cache expiry.
- Keep PI restrictions data-driven; ESI returning planets does not mean colonies are permitted.
- Treat live POCO taxes and character colonies separately from static universe data.

## Planned sequence

1. Generate verified universe and PI datasets from the SDE.
2. Enable public name resolution and selected-system refresh through ESI.
3. Add local breadth-first jump search using the generated stargate graph.
4. Add route preference and hauling analysis using `POST /route` when appropriate.
5. Register the EVE application and add optional SSO/PKCE character import.
