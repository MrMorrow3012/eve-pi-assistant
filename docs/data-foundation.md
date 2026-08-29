# Data Foundation and Market Profitability v0.9

The deployable website uses a generated, static data bundle. It does not require an EVE character login, ESI token, application secret, or server.

## Sources

- CCP JSONL Static Data Export: systems, IDs, regions, security status, individual planet IDs, orbital indices, radii and types, stargates, item types, commodity volumes, schematics, inputs, outputs, quantities, and cycle times.
- CCP type and typeDogma records: command-center CPU/powergrid output and planetary structure CPU, powergrid, storage, and base-price values.
- Versioned local PI rules: the five extractable P0 resources available on each of the eight planet types.
- Explicit restriction rules: the 18 named high-traffic/storyline systems, Thera, and CCP's 100 shattered wormhole systems.
- Public ESI adapter: optional current universe lookups, route checks, and type-filtered regional market orders without OAuth.

The generated metadata records its SDE build and the number of imported records. `web/data/pi-data.js` is included directly by `web/index.html`, which keeps GitHub Pages and offline previews simple.

The layout planner uses each selected planet's SDE radius as a reference and calculates distances from the user's chosen working-zone scale. Pin coordinates and the link-power factor are local planning assumptions because neither SDE nor public ESI exposes a player's proposed colony-pin coordinates. Final link load must therefore be checked in the game client.

The logistics planner combines SDE commodity volume and static gate data with player-entered POCO, utilization, cargo, and hauling assumptions. The tax-value table is maintained as a visible local planning rule rather than presented as SDE or ESI data. The current in-game transfer quote remains authoritative.

The profitability planner requests current orders only for the selected output and its direct inputs, or for one explicitly requested product tier. It groups orders by price, exposes the five best buy and sell levels with their remaining volume, and caches them for five minutes. Current prices are intentionally not generated into `pi-data.js`: the SDE supplies stable product identities and schematics, while public ESI supplies the time-sensitive price layer.

Profit outputs carry forward the selected plan's processor count, collection rhythm, utilization, POCO estimate, cargo route, and hauling allowance. They remain decision-support estimates because resource abundance, order depth and execution, installation costs, and the player's real in-game tax skills are not available from the static dataset.

## Refreshing the data

1. Download CCP's latest JSONL SDE ZIP.
2. Run `python src/data/build_sde_data.py <path-to-zip>` from the repository root.
3. Review the generated metadata and run the tests.
4. Commit the generated `data/generated/` files and `web/data/pi-data.js` together.

The source archive itself is intentionally excluded from release ZIPs and Git.
