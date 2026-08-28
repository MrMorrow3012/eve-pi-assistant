# EVE PI Assistant

A dark, EVE-inspired Planetary Industry planning and decision-support tool.

## Prototype 0.3
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
- System Analysis with eligibility, planet composition, production coverage, system fit, and next-step handoff
- Public ESI browser adapter and documented SDE/ESI/SSO integration plan
- Colony Designer placeholder
- Logistics, Profit, and Risk sections
- PI Setup Wizard
- PI Guide shell

> Current values are illustrative prototype data only.

## Running
Open `web/index.html`, then choose **Production Browser**.

The browser uses structured local sample data so it works directly from GitHub Pages. Nearby-system routes, planet composition, product coverage, and fit scores are illustrative placeholders—not live deployment recommendations. The schemas in `data/` and the browser dataset in `web/data/` are ready to be replaced by an SDE/ESI generation pipeline.

See `docs/esi-integration.md` for the staged plan covering public ESI requests, SDE generation, route calculation, caching, and optional EVE SSO character import.

## Roadmap
1. Verify PI mechanics
2. Load SDE-derived PI data
3. Build production-chain calculations
4. Add colony fitting/layout assistance
5. Add market profitability
6. Add POCO, hauling, and risk analysis
7. Integrate ESI / SSO where appropriate
8. Publish through GitHub Pages

EVE Online and related intellectual property belong to CCP Games.
