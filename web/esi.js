/* Optional public ESI adapter. Core planning uses generated SDE records so the
 * site remains fast and useful offline. No character-private endpoints. */
window.EVE_ESI = (()=>{
  const baseUrl="https://esi.evetech.net";
  const compatibilityDate="2026-08-28";
  const cache=new Map();
  const cacheTtl=5*60*1000;
  const headers={
    "Accept":"application/json",
    "X-Compatibility-Date":compatibilityDate,
    "X-User-Agent":"EVE-PI-Assistant/0.9 (+https://github.com/mrmorrow3012/eve-pi-assistant)"
  };

  async function request(path,options={}){
    const cacheKey=`${options.method||"GET"}:${path}:${options.body||""}`;
    const cached=cache.get(cacheKey);
    if(cached&&Date.now()-cached.savedAt<cacheTtl)return cached.data;
    const response=await fetch(`${baseUrl}${path}`,{...options,headers:{...headers,...options.headers}});
    if(!response.ok)throw new Error(`ESI request failed (${response.status})`);
    const data=await response.json();
    if((options.method||"GET")==="GET")cache.set(cacheKey,{data,savedAt:Date.now()});
    return data;
  }

  return {
    compatibilityDate,
    getSystem:systemId=>request(`/universe/systems/${systemId}`),
    getPlanet:planetId=>request(`/universe/planets/${planetId}`),
    getMarketOrders:(regionId,typeId)=>request(`/markets/${regionId}/orders/?order_type=all&type_id=${typeId}`),
    getMarketHistory:(regionId,typeId)=>request(`/markets/${regionId}/history/?type_id=${typeId}`),
    resolveNames:names=>request("/universe/ids",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(names)}),
    calculateRoute:async(origin,destination,preference="Shorter")=>{
      const data=await request(`/route/${origin}/${destination}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({preference,security_penalty:50})});
      const route=Array.isArray(data)?data:data?.route;
      if(!Array.isArray(route))throw new Error("CCP returned an unexpected route response");
      return route;
    },
    clearCache:()=>cache.clear()
  };
})();
