# EVE PI Assistant

## Colony Layout & Routing v0.7

The site ships with a generated public-data bundle from CCP's JSONL Static Data Export: 8,490 solar systems, region and security data, 67,693 individual planets with IDs and radii, 6,989 static stargate links, the complete P0–P4 schematic graph, and verified planetary structure fitting attributes. Autocomplete covers New Eden, nearby searches use the real gate graph, and PI restrictions include the 18 named systems plus shattered wormholes.

No character login, OAuth token, backend, or application secret is required. Public ESI remains an optional supplement for current system lookups and occasional route checks.

See `docs/data-foundation.md` for the refresh process.

A dark, EVE-inspired Planetary Industry planning and decision-support tool.

## Included in v0.7
- Dark EVE-style UI
- Persistent navigation
- Operations dashboard
- System Explorer
- Planet Explorer
- Resource Analysis
- Production Planner
- Production Browser / Planet Finder
- Clickable planet types and P0-P4 browsing
- Home-system and max-jumps controls
- Nearby-system comparison and restricted-system handling
- Complete New Eden system autocomplete, including Atlangeins
- Real SDE stargate routing and planet composition
- System Analysis with eligibility and complete local production coverage
- Production Help for home-only or within-jumps feasibility
- Automatic recommended starter plans from a selected product target
- Colony Fitting page with Command Center Upgrades levels 0–5
- Real CPU and powergrid calculations for ECUs, extractor heads, processors, launchpads, and storage
- Adjustable extractor heads, link-budget reserve, planning density, and colony limit
- Per-planet fit warnings, SDE structure costs, and theoretical processor throughput
- Automatic visual layouts for extraction, hybrid, and factory colonies
- Draggable command centers, launchpads, storage, ECUs, and processors
- Distance-aware physical links using an adjustable working-zone scale
- Material-routing ledgers explaining links versus routes
- Beginner build instructions generated for each selected planet
- Operation-wide input demand, modeled supply, and bottleneck detection
- Public ESI browser adapter and documented SDE/ESI/SSO integration plan
- No-login Colony Planner with product goals, automated planet selection, editable roles, starter layouts, coverage, and readiness checks
- Colony Designer placeholder
- Logistics, Profit, and Risk sections
- PI Setup Wizard
- PI Guide shell

> System, individual planet, route, product, schematic, CPU, and powergrid records are sourced from CCP's SDE. The layout screen estimates link length from user placement and an adjustable working-zone scale. Its 0.15 MW/km factor is a planning aid, not a substitute for the final in-game link readout. Resource abundance, POCO taxes, and market prices are not yet calculated.

## Running
Open `web/index.html`, then choose **Production Help**.

The generated browser bundle works directly from GitHub Pages or a local file. Regenerate it from a future CCP SDE with `src/data/build_sde_data.py`.

See `docs/esi-integration.md` for the staged plan covering public ESI requests, SDE generation, route calculation, and caching. Character login and private ESI data are intentionally out of scope.

## Roadmap
1. Add user-entered POCO tax, hauling volume, and export-frequency assumptions
2. Add route preferences and public ESI route comparison where appropriate
3. Add market profitability using public endpoints or imported prices
4. Improve factory allocation and allow manual processor-count adjustments
5. Add saved local plans without character login
6. Publish updates through GitHub Pages

EVE Online and related intellectual property belong to CCP Games.
