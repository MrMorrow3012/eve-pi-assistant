import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const pageContent={innerHTML:""};
const sidebarLocation={textContent:""};
globalThis.window={};
globalThis.document={
  querySelectorAll:()=>[],
  querySelector:()=>null,
  getElementById:id=>id==="pageContent"?pageContent:sidebarLocation,
};

vm.runInThisContext(fs.readFileSync(new URL("../web/data/pi-data.js",import.meta.url),"utf8"));
vm.runInThisContext(fs.readFileSync(new URL("../web/app.js",import.meta.url),"utf8"));

assert.equal(piData.metadata.version,"0.9.0");
assert.equal(piData.metadata.counts.systems,8490);
assert.equal(matchingSystems("Atlan")[0],"Atlangeins");
assert.equal(getSystem("Jita").restricted,true);
assert.equal(getSystem("Sobaseki").planetTotal,13);
assert.equal(getSystem("Sobaseki").planetInstances.length,13);
assert.ok(getSystem("Sobaseki").planetInstances.every(planet=>planet.id&&planet.radius>0));
assert.equal(distanceBetween("Jita","Perimeter"),1);
assert.deepEqual(routeBetween("Jita","Perimeter").map(system=>system.name),["Jita","Perimeter"]);
assert.equal(routeBetween("Jita","Thera").length,0);
assert.match(pageContent.innerHTML,/CCP SDE/);
assert.match(pageContent.innerHTML,/SET YOUR HOME SYSTEM/);
assert.match(pageContent.innerHTML,/id="homeSystem"/);

state.page="location";
state.maxJumps=3;
applySystemSearch("locationSystem","Atlangeins");
assert.equal(state.locationSystem,"Atlangeins");
assert.equal(state.selectedSystem,"Atlangeins");
assert.equal(state.system,"Jita","exploring a location must not silently change the saved home");
assert.match(pageContent.innerHTML,/value="Atlangeins"/);
assert.match(pageContent.innerHTML,/REAL STARGATE RESULTS AROUND ATLANGEINS/);

state.locationSystem=null;
state.maxJumps=5;
state.page="overview";
render();

state.page="productionHelp";
render();
assert.match(pageContent.innerHTML,/What Can I Make Here/);
assert.match(pageContent.innerHTML,/CREATE RECOMMENDED PLAN/);

const product=productById.get("mechanical-parts");
assert.ok(product.volume>0);
const candidate=nearbySystems("Jita",5,true).find(system=>coverage(system,product).complete);
assert.ok(candidate,"Mechanical Parts should have a complete nearby candidate");
makeRecommendedPlan(candidate.name,product.id);
assert.equal(state.page,"colonies");
assert.equal(state.colony.generated,true);
assert.ok(state.colony.selected.length>0);
assert.match(pageContent.innerHTML,/RECOMMENDED STARTER PLAN CREATED/);
assert.match(pageContent.innerHTML,/CHECK COLONY FITTING/);

assert.equal(piData.structures.commandCenterLevels[4].power,17000);
assert.equal(piData.structures.commandCenterLevels[4].cpu,21315);
assert.equal(piData.structures.items.ecu.headPower,550);
assert.equal(piData.structures.items.ecu.headCpu,110);
const plannedPlanet=fittingSelected()[0];
const fit=fittingForPlanet(plannedPlanet,state.colony.roles[plannedPlanet.id],product);
assert.equal(fit.level.level,4);
assert.ok(fit.power>0&&fit.cpu>0);
assert.equal(typeof fit.fits,"boolean");

state.page="fitting";
render();
assert.match(pageContent.innerHTML,/Colony Fitting/);
assert.match(pageContent.innerHTML,/POWERGRID/);
assert.match(pageContent.innerHTML,/SDE STRUCTURE REFERENCE/);
assert.match(pageContent.innerHTML,/BUILD LAYOUT & ROUTES/);

const layoutPlanet=fittingSelected()[0];
const layoutRole=state.colony.roles[layoutPlanet.id];
const layout=layoutMetrics(layoutPlanet,layoutRole,product);
assert.ok(layout.pins.some(pin=>pin.key==="commandCenter"));
assert.ok(layout.links.length>0);
assert.ok(layout.totalDistance>0);
assert.ok(layout.linkPower>0);
assert.ok(routeRows(layoutPlanet,layoutRole,product,layout.fit).length>0);
assert.ok(operationBalance(fittingSelected(),product).rows.length>0);

state.page="layout";
render();
assert.match(pageContent.innerHTML,/Colony Layout & Routing/);
assert.match(pageContent.innerHTML,/MATERIAL ROUTING LEDGER/);
assert.match(pageContent.innerHTML,/BEGINNER BUILD ORDER/);
assert.match(pageContent.innerHTML,/OPERATION-WIDE PRODUCTION BALANCE/);

const unverifiedLogistics=logisticsModel();
assert.equal(unverifiedLogistics.throughput.ready,false);
assert.equal(unverifiedLogistics.finalUnits,0,"local-chain output must stay unavailable until a P0 rate is supplied");
state.market.prices[product.typeId]={buy:999999,sell:999999,source:"CCP ESI"};
assert.equal(profitabilityModel().gross,null,"a market price must not create income from an unsupported production rate");
delete state.market.prices[product.typeId];
state.page="logistics";
render();
assert.match(pageContent.innerHTML,/PRODUCTION RATE VALIDATION/);
assert.match(pageContent.innerHTML,/RATE REQUIRED/);
assert.match(pageContent.innerHTML,/id="logP0Yield"/);
state.logistics.p0Yield=24000;
const logistics=logisticsModel();
assert.equal(logistics.throughput.ready,true);
assert.ok(logistics.throughput.unitsPerHour<=logistics.throughput.theoreticalUnitsPerHour);
assert.equal(logistics.throughput.bottleneck,"Basic processors");
assert.ok(logistics.throughput.unitsPerHour<logistics.throughput.theoreticalUnitsPerHour,"local Mechanical Parts must be capped below the final-factory ceiling");
assert.ok(logistics.finalUnits>0);
assert.ok(logistics.totalVolume>0);
assert.ok(logistics.totalTax>0);
assert.ok(logistics.movements.some(row=>row.kind==="FINAL EXPORT"));
assert.ok(logistics.movements.some(row=>row.kind==="FACTORY TRANSFER"));
assert.equal(logistics.path[0].name,candidate.name);
assert.equal(logistics.path.at(-1).name,"Jita");

state.page="logistics";
render();
assert.match(pageContent.innerHTML,/Logistics & POCO Planner/);
assert.match(pageContent.innerHTML,/CARGO & CUSTOMS MOVEMENTS/);
assert.match(pageContent.innerHTML,/STATIC GATE ROUTE/);
assert.match(pageContent.innerHTML,/OPTIONAL CCP ROUTE COMPARISON/);
assert.match(pageContent.innerHTML,/CHECK CCP ROUTE/);
assert.match(pageContent.innerHTML,/COLLECTION CHECKLIST/);
assert.match(pageContent.innerHTML,/BOTTLENECK-LIMITED RATE/);

const snapshot=marketSnapshot([
  {is_buy_order:true,price:9200,volume_remain:80},
  {is_buy_order:true,price:9800,volume_remain:25},
  {is_buy_order:false,price:11200,volume_remain:40},
  {is_buy_order:false,price:10800,volume_remain:60},
]);
assert.equal(snapshot.buy,9800);
assert.equal(snapshot.sell,10800);
assert.equal(snapshot.buyVolume,105);
assert.equal(snapshot.sellVolume,100);
assert.deepEqual(snapshot.buyOptions.map(level=>level.price),[9800,9200]);
assert.deepEqual(snapshot.sellOptions.map(level=>level.price),[10800,11200]);
assert.equal(compactUnits(84400),"84.4k units");

state.market.prices[product.typeId]={buy:10000,sell:11000,buyOptions:[{price:10000,volume:5000},{price:9900,volume:7500}],sellOptions:[{price:11000,volume:4000},{price:11200,volume:6000}],source:"CCP ESI"};
let profit=profitabilityModel();
assert.equal(profit.ready,true);
assert.ok(profit.gross>0);
assert.ok(profit.breakEven>0);
assert.equal(typeof profit.net,"number");
state.market.sourcing="market";
for(const item of product.inputItems)state.market.prices[item.typeId]={buy:1000,sell:1200,source:"CCP ESI"};
profit=profitabilityModel();
assert.equal(profit.ready,true);
assert.ok(profit.inputCost>0);
state.market.sourcing="local";
state.page="profit";
render();
assert.match(pageContent.innerHTML,/Market Profitability/);
assert.match(pageContent.innerHTML,/BREAK-EVEN/);
assert.match(pageContent.innerHTML,/PROFIT WATERFALL/);
assert.match(pageContent.innerHTML,/PUBLIC MARKET DATA/);
assert.match(pageContent.innerHTML,/VERIFIED OUTPUT RATE/);
assert.match(pageContent.innerHTML,/data-market-choice/);
assert.match(pageContent.innerHTML,/best 5 price levels/);
assert.doesNotMatch(pageContent.innerHTML,/data-market-price/);

for(const tier of [1,2,3,4]){
  let representative=null;
  for(const tierProduct of piData.products.filter(item=>item.tier===tier)){
    const system=piData.systems.find(item=>coverage(item,tierProduct).complete);
    if(system){representative={tierProduct,system};break}
  }
  assert.ok(representative,`P${tier} should have a complete system`);
  makeRecommendedPlan(representative.system.name,representative.tierProduct.id);
  const planets=fittingSelected();
  assert.ok(planets.length>0,`P${tier} plan should select planets`);
  assert.ok(representative.tierProduct.volume>0,`P${tier} product should have SDE volume`);
  const first=planets[0],firstRole=state.colony.roles[first.id];
  assert.ok(layoutMetrics(first,firstRole,representative.tierProduct).links.length>0);
  const tierLogistics=logisticsModel();
  assert.equal(tierLogistics.throughput.ready,true,`P${tier} should produce a supported rate after the P0 assumption is supplied`);
  assert.ok(tierLogistics.throughput.unitsPerHour<=tierLogistics.throughput.theoreticalUnitsPerHour,`P${tier} sustainable output cannot exceed its factory ceiling`);
  assert.ok(tierLogistics.totalVolume>0,`P${tier} should create cargo volume`);
  assert.equal(tierLogistics.movements.length,tier===1?1:1+representative.tierProduct.inputItems.length);
  state.market.prices[representative.tierProduct.typeId]={buy:10000*tier,sell:11000*tier,source:"CCP ESI"};
  const tierProfit=profitabilityModel();
  assert.equal(tierProfit.ready,true,`P${tier} should calculate profit with a seeded ESI output price`);
  assert.ok(tierProfit.breakEven>=0,`P${tier} should calculate break-even price`);
  state.page="layout";
  render();
  assert.match(pageContent.innerHTML,/MATERIAL ROUTING LEDGER/);
}

const terminalProduct=productById.get(state.colony.product);
assert.equal(terminalProduct.tier,4,"terminal-output regression should exercise a P4 chain");
state.market.sourcing="local";
state.market.saleMode="instant";
state.market.prices[terminalProduct.typeId]={buy:12345,sell:13000,source:"CCP ESI"};
for(const intermediate of chainProducts(terminalProduct).slice(1)){
  state.market.prices[intermediate.typeId]={buy:999999999,sell:999999999,source:"CCP ESI"};
}
const terminalProfit=profitabilityModel();
assert.equal(terminalProfit.saleOutputs.length,1);
assert.equal(terminalProfit.saleOutputs[0].product.typeId,terminalProduct.typeId);
assert.equal(terminalProfit.gross,terminalProfit.logistics.finalUnits*12345,"P0-P3 market values must never be added to P4 revenue");
assert.deepEqual(selectedMarketProducts().map(item=>item.typeId),[terminalProduct.typeId],"locally produced intermediate tiers should not appear as sale lines");
state.page="profit";
render();
assert.match(pageContent.innerHTML,/FINAL OUTPUT RULE/);
assert.match(pageContent.innerHTML,/FINAL SALE OUTPUT/);
assert.doesNotMatch(pageContent.innerHTML,/PURCHASED INPUT · COST ONLY/);
assert.ok(terminalProfit.logistics.throughput.unitsPerHour<terminalProfit.logistics.throughput.theoreticalUnitsPerHour,"a full local P4 chain must be capped by its upstream production");
state.market.sourcing="market";
state.logistics.p0Yield=0;
const suppliedFactory=logisticsModel();
assert.equal(suppliedFactory.throughput.ready,true,"externally supplied final-stage inputs do not require a P0 estimate");
assert.equal(suppliedFactory.throughput.unitsPerHour,suppliedFactory.throughput.theoreticalUnitsPerHour*state.logistics.utilization/100);

let routeRequest=null;
globalThis.fetch=async(url,options)=>{
  routeRequest={url,options};
  return {ok:true,json:async()=>({route:[30000138,30000142]})};
};
vm.runInThisContext(fs.readFileSync(new URL("../web/esi.js",import.meta.url),"utf8"));
assert.deepEqual(await window.EVE_ESI.calculateRoute(30000138,30000142,"Shorter"),[30000138,30000142]);
assert.equal(routeRequest.options.method,"POST");
assert.deepEqual(JSON.parse(routeRequest.options.body),{preference:"Shorter",security_penalty:50});

console.log("v0.9.6 smoke checks passed");
