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

assert.equal(piData.metadata.version,"0.5.0");
assert.equal(piData.metadata.counts.systems,8490);
assert.equal(matchingSystems("Atlan")[0],"Atlangeins");
assert.equal(getSystem("Jita").restricted,true);
assert.equal(getSystem("Sobaseki").planetTotal,13);
assert.equal(distanceBetween("Jita","Perimeter"),1);
assert.match(pageContent.innerHTML,/CCP SDE/);

state.page="productionHelp";
render();
assert.match(pageContent.innerHTML,/What Can I Make Here/);
assert.match(pageContent.innerHTML,/CREATE RECOMMENDED PLAN/);

const product=productById.get("mechanical-parts");
const candidate=nearbySystems("Jita",5,true).find(system=>coverage(system,product).complete);
assert.ok(candidate,"Mechanical Parts should have a complete nearby candidate");
makeRecommendedPlan(candidate.name,product.id);
assert.equal(state.page,"colonies");
assert.equal(state.colony.generated,true);
assert.ok(state.colony.selected.length>0);
assert.match(pageContent.innerHTML,/RECOMMENDED STARTER PLAN CREATED/);

console.log("v0.5 smoke checks passed");
