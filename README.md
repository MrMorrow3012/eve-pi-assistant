# EVE PI Assistant

A beginner-friendly Planetary Industry planning, profitability, and decision-support tool for EVE Online.

> **Project status:** Research / Prototype

## Vision

EVE PI Assistant should answer more than "What can I manufacture?"

It should help a player determine:

> **Where should I operate, what should I extract or manufacture, how should I build my colonies, how much will I make, how much effort will it require, and what risks am I accepting?**

The project is designed for both brand-new and experienced PI players.

## Core Goals

- Teach Planetary Industry from first principles.
- Guide a new player from a station to a functioning PI operation.
- Help experienced players optimize existing operations.
- Evaluate systems and planets rather than treating all locations equally.
- Account for security space, resource richness, POCO taxation, logistics, market conditions, risk, and player effort.
- Recommend practical setups instead of only maximizing theoretical ISK.
- Explain *why* a recommendation was made.
- Use EVE data sources wherever possible instead of manually hard-coding information.
- Keep mechanics, market data, assumptions, and recommendations clearly separated.

## Supported Player Goals

- Beginner / first PI operation
- Maximum profit
- Good profit with low maintenance
- Passive or low-attention PI
- Minimal hauling
- Factory-focused production
- Extraction-focused production
- High-sec operations
- Low-sec operations
- Null-sec operations
- Wormhole operations
- Multi-character PI
- P3/P4 specialization
- Producing a specific commodity
- Optimizing an existing PI network

## Planned Player Flow

1. **Start** — choose a goal and preferred play style.
2. **Location** — enter a system or authenticate through EVE SSO.
3. **System Analysis** — identify planets, security, logistics, POCO information, and other relevant factors.
4. **Planet Analysis** — evaluate planet type and available resource potential.
5. **Production Planning** — determine viable P1/P2/P3/P4 chains.
6. **Optimization** — compare profit, effort, hauling, taxes, and risk.
7. **Colony Design** — recommend structures, links, extractor placement, storage, and routing.
8. **Operations** — explain extraction cycles, maintenance, export, hauling, and selling.
9. **Review** — show expected production, costs, profit, effort, and risk.

## Data Architecture

The project will use multiple sources rather than assuming one API contains everything.

### ESI

Used where appropriate for dynamic or character-specific information, including universe/system information, character skills, character PI data, assets, customs-office information where available and authorized, and market information where appropriate.

### SDE

Used as the foundation for relatively static game data such as types, planet types, resources, schematics, PI products, structures, skills, and other game definitions.

### External / Market Sources

Used where appropriate for current economic information.

### In-game / Player Validation

Used to verify actual UI workflow, current terminology, practical colony setup, player effort, usability, and information visible in-game but not easily available through public APIs.

## Data Classification

Every important piece of information should eventually be classified as:

- **Confirmed mechanic** — verified against reliable current sources.
- **Dynamic data** — changes with the game, market, or location.
- **Player preference** — subjective choice.
- **Economic assumption** — an assumption used by a calculation.
- **Calculated recommendation** — produced by the application.
- **Needs testing** — not yet experimentally verified.

## Risk and Effort

The planner should not blindly recommend the highest theoretical ISK/day.

It should consider resource yield, product value, POCO taxes, market costs, hauling distance, security space, logistics complexity, maintenance, extractor reset frequency, player time, loss/risk exposure, and the player's tolerance for complexity.

The goal is **practical profit**, not merely spreadsheet profit.

## Repository Structure

```text
eve-pi-assistant/
├── README.md
├── docs/
│   ├── beginner-guide.md
│   ├── pi-mechanics.md
│   ├── profitability.md
│   ├── logistics.md
│   └── risk.md
├── data/
│   ├── systems.json
│   ├── planets.json
│   ├── resources.json
│   ├── products.json
│   ├── schematics.json
│   ├── structures.json
│   └── skills.json
├── src/
│   ├── data/
│   ├── pi/
│   ├── economy/
│   ├── logistics/
│   ├── optimizer/
│   └── ui/
├── web/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── tests/
    ├── production/
    ├── extraction/
    └── optimizer/
```

## Development Roadmap

### Phase 0 — Research
- Map the complete PI player journey.
- Identify current PI mechanics.
- Compare ESI, SDE, in-game, and external data.
- Study existing PI tools.
- Document limitations and uncertainties.

### Phase 1 — Knowledge Base
- Build verified PI documentation.
- Create the beginner guide.
- Build the initial structured PI data model.
- Document production chains and colony mechanics.

### Phase 2 — Prototype
- Static HTML/CSS/JavaScript.
- Beginner mode.
- System explorer.
- Planet explorer.
- Basic production-chain viewer.
- Initial recommendation logic.

### Phase 3 — PI Planner
- Production calculator.
- Colony fitting.
- Extraction planning.
- Resource balancing.
- Profitability calculations.
- Logistics calculations.

### Phase 4 — EVE Integration
- ESI integration.
- EVE SSO.
- Character skills.
- Character PI data.
- Dynamic universe information.
- Market data integration.
- Customs-office information where available.

### Phase 5 — Optimization
- Player profiles.
- Risk-adjusted profitability.
- Maintenance/effort scoring.
- Hauling optimization.
- Multi-character optimization.
- P3/P4 optimization.

### Phase 6 — Colony Designer
- Visual planet layout.
- Building placement.
- Link optimization.
- Routing visualization.
- Resource hotspot guidance.
- Export/import planning.

## Existing Projects and References

This project will study and credit existing EVE PI resources rather than replace them unnecessarily.

- EVE University — Planetary Industry
- EVE University — Planetary Industry at the NSC (archived)
- EVEHelper
- EVE-WebTools Planetary Industry
- PIM
- PIBLe
- CCP ESI documentation
- CCP Static Data Export documentation

## Design Principle

> **Teach the player while helping the player.**

The application should not simply output:

> "Build this."

It should explain:

> "Build this because your location, resources, production goal, taxes, logistics, risk tolerance, and desired maintenance level make it the best fit."

## Disclaimer

EVE Online and its related intellectual property are the property of CCP Games. This project is an independent third-party project and is not affiliated with or endorsed by CCP Games.

Economic values are estimates and can change with market conditions, game updates, taxes, player behavior, and other factors.
