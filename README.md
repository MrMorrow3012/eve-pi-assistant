# EVE PI Assistant

## Data Foundation v0.5

The site now ships with a generated public-data bundle from CCP's JSONL Static Data Export: 8,490 solar systems, region and security data, 67,693 planets, 6,989 static stargate links, and the complete P0–P4 schematic graph. Autocomplete covers New Eden, nearby searches use the real gate graph, and PI restrictions include the 18 named systems plus shattered wormholes.

No character login, OAuth token, backend, or application secret is required. Public ESI remains an optional supplement for current system lookups and occasional route checks.

See `docs/data-foundation.md` for the refresh process.

A dark, EVE-inspired Planetary Industry planning and decision-support tool.

## Included in v0.5
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
- Public ESI browser adapter and documented SDE/ESI/SSO integration plan
- No-login Colony Planner with product goals, automated planet selection, editable roles, starter layouts, coverage, and readiness checks
- Colony Designer placeholder
- Logistics, Profit, and Risk sections
- PI Setup Wizard
- PI Guide shell

> System, planet, route, product, and schematic records are sourced from CCP's SDE. Resource abundance, POCO taxes, market prices, and the final CPU/powergrid fit are not yet calculated.

## Running
Open `web/index.html`, then choose **Production Help**.

The generated browser bundle works directly from GitHub Pages or a local file. Regenerate it from a future CCP SDE with `src/data/build_sde_data.py`.

See `docs/esi-integration.md` for the staged plan covering public ESI requests, SDE generation, route calculation, and caching. Character login and private ESI data are intentionally out of scope.

## Roadmap
1. Validate structure CPU/powergrid and link costs
2. Improve the colony layout recommendation engine
3. Add user-entered POCO tax and hauling assumptions
4. Add market profitability using public endpoints or imported prices
5. Add market profitability
6. Add POCO, hauling, and risk analysis
7. Supplement selected lookups with public ESI where appropriate
8. Publish through GitHub Pages

EVE Online and related intellectual property belong to CCP Games.
