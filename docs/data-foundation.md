# Data Foundation and Colony Layout v0.7

The deployable website uses a generated, static data bundle. It does not require an EVE character login, ESI token, application secret, or server.

## Sources

- CCP JSONL Static Data Export: systems, IDs, regions, security status, individual planet IDs, orbital indices, radii and types, stargates, item types, schematics, inputs, outputs, quantities, and cycle times.
- CCP type and typeDogma records: command-center CPU/powergrid output and planetary structure CPU, powergrid, storage, and base-price values.
- Versioned local PI rules: the five extractable P0 resources available on each of the eight planet types.
- Explicit restriction rules: the 18 named high-traffic/storyline systems, Thera, and CCP's 100 shattered wormhole systems.
- Public ESI adapter: optional current universe lookups and route checks without OAuth.

The generated metadata records its SDE build and the number of imported records. `web/data/pi-data.js` is included directly by `web/index.html`, which keeps GitHub Pages and offline previews simple.

The layout planner uses each selected planet's SDE radius as a reference and calculates distances from the user's chosen working-zone scale. Pin coordinates and the link-power factor are local planning assumptions because neither SDE nor public ESI exposes a player's proposed colony-pin coordinates. Final link load must therefore be checked in the game client.

## Refreshing the data

1. Download CCP's latest JSONL SDE ZIP.
2. Run `python src/data/build_sde_data.py <path-to-zip>` from the repository root.
3. Review the generated metadata and run the tests.
4. Commit the generated `data/generated/` files and `web/data/pi-data.js` together.

The source archive itself is intentionally excluded from release ZIPs and Git.
