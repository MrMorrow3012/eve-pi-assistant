# Logistics & POCO Planning v0.8+

The Logistics page turns the selected colony plan into a collection schedule. It uses SDE commodity volumes, schematic quantities, the static stargate graph, and player-entered operating assumptions.

Players can set the effective POCO export rate shown in game, expected processor utilization, collection rhythm, ship cargo capacity, unused-space reserve, hauling destination, and an optional ISK allowance per jump. The page estimates final exports, intermediate factory transfers, cargo loads, static-route distance, lower-security exposure, customs cost, hauling allowance, and total recurring logistics cost.

The optional public ESI route check compares shorter, safer, or less-secure routing without character login. Static SDE routing remains the default and works offline.

POCO rates and the local PI tax-value table are planning inputs rather than live SDE values. Verify transfer charges, ship capacity, and the actual route before moving material. v0.9 carries the resulting recurring cost total into Market Profitability.

## Production rate validation

The planner distinguishes the 100% final-factory ceiling from supportable output. In **Full chain produced locally** mode, it recursively expands the selected schematic, totals the basic and advanced facility-hours plus P0 required per final unit, and caps production at the slowest installed stage. An average P0 yield per ECU per hour must be entered from the in-game extraction program; the website does not invent an extraction rate. In **Buy/import final-stage inputs** mode, those upstream stages are external and the selected final facilities determine the rate after expected uptime.
