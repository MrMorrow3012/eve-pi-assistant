# EVE PI Assistant

## Logistics & POCO Planning v0.8

The site ships with a generated public-data bundle from CCP's JSONL Static Data Export: 8,490 solar systems, region and security data, 67,693 individual planets with IDs and radii, 6,989 static stargate links, the complete P0–P4 schematic graph, commodity volumes, and verified planetary structure fitting attributes. Autocomplete covers New Eden, nearby searches use the real gate graph, and PI restrictions include the 18 named systems plus shattered wormholes.

No character login, OAuth token, backend, or application secret is required. Public ESI remains an optional supplement for current system lookups and occasional route checks.

See `docs/data-foundation.md` for the refresh process.

A dark, EVE-inspired Planetary Industry planning and decision-support tool.

## Included in v0.8
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
- Logistics & POCO Planner driven by the selected colony plan
- Player-entered effective POCO rate, production uptime, cargo capacity, reserve, and per-jump allowance
- SDE commodity volumes and calculated collection loads
- Final-product exports plus intermediate factory-transfer estimates
- Shortest static stargate route with security warnings and round-trip totals
- Optional public ESI route comparison with shorter, safer, and less-secure preferences
- Generated collection checklist for extraction, customs transfers, factory imports, and hauling
- Per-collection customs, hauling, and combined cost summary
- Public ESI browser adapter and documented SDE/ESI/SSO integration plan
- No-login Colony Planner with product goals, automated planet selection, editable roles, starter layouts, coverage, and readiness checks
- Colony Designer placeholder
- Logistics, Profit, and Risk sections
- PI Setup Wizard
- PI Guide shell

> System, individual planet, route, product, schematic, volume, CPU, and powergrid records are sourced from CCP's SDE. Layout link costs and POCO costs remain planning estimates: players must enter the rate shown by the in-game Customs Office and confirm transfer quotes before committing. Resource abundance and market prices are not yet calculated.

## Running
Open `web/index.html`, then choose **Production Help**.

The generated browser bundle works directly from GitHub Pages or a local file. Regenerate it from a future CCP SDE with `src/data/build_sde_data.py`.

See `docs/esi-integration.md` for the staged plan covering public ESI requests, SDE generation, route calculation, and caching. Character login and private ESI data are intentionally out of scope.

## Roadmap
1. Add market profitability using public regional prices or imported prices
2. Carry POCO and hauling costs into net profit per hour, day, and collection
3. Add break-even prices and product comparison
4. Improve factory allocation and allow manual processor-count adjustments
5. Add saved local plans without character login
6. Publish updates through GitHub Pages

EVE Online and related intellectual property belong to CCP Games.
