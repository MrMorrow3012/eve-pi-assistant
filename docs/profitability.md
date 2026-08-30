# Market Profitability v0.9

The Profit page starts with a completed colony plan and carries forward its final-processor count, output quantity, collection rhythm, expected utilization, POCO estimate, cargo capacity, stargate route, and per-jump hauling allowance.

## Price sources

- **Public ESI:** the player chooses a market region and explicitly loads the selected chain or its product tier. Requests are filtered to one item type at a time and cached for five minutes.
- **Price level selection:** each product shows the five highest regional buy levels and five lowest regional sell levels, with the remaining order volume at each price. The best level is selected automatically, and the player can choose another real order level from the dropdown.

An instant sale uses the highest regional buy order. A listed sale uses the lowest regional sell order and applies both the entered broker fee and sales tax. ESI prices are regional references; they do not guarantee that enough volume exists at one station or that the order will still be available when the player arrives.

## Input sourcing

**Produced by this colony chain** treats direct input purchase cost as zero because those inputs are produced by the planned colonies. Their modeled customs transfers remain in the Logistics total.

**Buy direct inputs at sell price** multiplies each schematic input quantity by the selected product's collection output and the input's lowest regional sell order. Missing input prices prevent a final net result rather than silently becoming zero.

## Calculations

For one collection period:

```text
gross revenue = selected final-product units × selected final-product price
market fees = gross revenue × (sales tax + listed-sale broker fee)
net profit = gross revenue - direct input purchases - market fees - logistics total
break-even unit price = (input purchases + logistics total)
                        / (final units × (1 - effective market fee rate))
```

Only the selected end product is saleable revenue. For a P4 plan, P0, P1, P2, and P3 quantities are production stages consumed on the way to the P4 output; their market values are never added to gross revenue. If the player chooses to buy final-stage inputs, those prices appear only as costs.

Net per day and hour divide the collection result by the selected maintenance rhythm. The same-tier comparison holds the current plan's final-processor count constant and compares locally produced outputs using final export tax and final-product hauling only.

## Boundaries

The estimate does not know real ECU yield, resource depletion, order depth at a single station, installation or command-center setup costs, player travel time, live gate conditions, or the final in-game Customs Office quote. It is a planning comparison, not a guaranteed income forecast.
