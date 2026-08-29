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

const logistics=logisticsModel();
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

let routeRequest=null;
globalThis.fetch=async(url,options)=>{
  routeRequest={url,options};
  return {ok:true,json:async()=>({route:[30000138,30000142]})};
};
vm.runInThisContext(fs.readFileSync(new URL("../web/esi.js",import.meta.url),"utf8"));
assert.deepEqual(await window.EVE_ESI.calculateRoute(30000138,30000142,"Shorter"),[30000138,30000142]);
assert.equal(routeRequest.options.method,"POST");
assert.deepEqual(JSON.parse(routeRequest.options.body),{preference:"Shorter",security_penalty:50});

console.log("v0.9 smoke checks passed");
