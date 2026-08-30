# EVE PI Assistant

## Market Profitability v0.9

The site ships with a generated public-data bundle from CCP's JSONL Static Data Export: 8,490 solar systems, region and security data, 67,693 individual planets with IDs and radii, 6,989 static stargate links, the complete P0–P4 schematic graph, commodity volumes, and verified planetary structure fitting attributes. Autocomplete covers New Eden, nearby searches use the real gate graph, and PI restrictions include the 18 named systems plus shattered wormholes.

No character login, OAuth token, backend, or application secret is required. Public ESI supplies optional regional market orders and route checks.

See `docs/data-foundation.md` for the refresh process.

A dark, EVE-inspired Planetary Industry planning and decision-support tool.

## Included in v0.9
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
- Overview home-system selector that establishes the planning and hauling anchor
- Location autocomplete selections immediately recenter real nearby-system results while preserving the full Analyze System action
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
- Market Profitability page driven by the selected colony and logistics plan
- Public regional ESI best-buy and best-sell prices, requested only for selected products
- Five-minute browser cache and batched same-tier requests to respect ESI limits
- Readable selectors for the five best regional buy and sell price levels, including available volume
- Instant-sale and listed-sale modes with editable broker fee and sales tax
- Locally produced or market-purchased direct-input costing
- Gross revenue, recurring costs, net per collection/day/hour/unit, margin, and break-even price
- Profit waterfall, missing-price guidance, and P1–P4 same-tier product ranking
- Public ESI browser adapter and documented SDE/ESI/SSO integration plan
- No-login Colony Planner with product goals, automated planet selection, editable roles, starter layouts, coverage, and readiness checks
- Colony Designer placeholder
- Logistics, Profit, and Risk sections
- PI Setup Wizard
- PI Guide shell

> System, individual planet, route, product, schematic, volume, CPU, and powergrid records are sourced from CCP's SDE. Current regional order prices come from public ESI. Layout link costs, POCO costs, extraction yield, order execution, and hauling assumptions remain estimates that must be checked in game.

## Running
Open `web/index.html`, then choose **Production Help**.

The generated browser bundle works directly from GitHub Pages or a local file. Regenerate it from a future CCP SDE with `src/data/build_sde_data.py`.

See `docs/esi-integration.md` for the public ESI boundary, regional price requests, route calculation, and caching. Character login and private ESI data are intentionally out of scope.

## Roadmap
1. Add risk and effort scoring using security, route exposure, collection rhythm, and user preferences
2. Improve factory allocation and allow manual processor-count adjustments
3. Add saved local plans plus JSON export/import without character login
4. Add optional public activity context without collecting character data
5. Publish updates through GitHub Pages

EVE Online and related intellectual property belong to CCP Games.
