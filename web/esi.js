/* Optional public ESI adapter. Core planning uses generated SDE records so the
 * site remains fast and useful offline. No character-private endpoints. */
window.EVE_ESI = (()=>{
  const baseUrl="https://esi.evetech.net";
  const compatibilityDate="2026-08-28";
  const cache=new Map();
  const headers={
    "Accept":"application/json",
    "X-Compatibility-Date":compatibilityDate,
    "X-User-Agent":"EVE-PI-Assistant/0.6 (+https://github.com/mrmorrow3012/eve-pi-assistant)"
  };

  async function request(path,options={}){
    const cacheKey=`${options.method||"GET"}:${path}:${options.body||""}`;
    if(cache.has(cacheKey))return cache.get(cacheKey);
    const response=await fetch(`${baseUrl}${path}`,{...options,headers:{...headers,...options.headers}});
    if(!response.ok)throw new Error(`ESI request failed (${response.status})`);
    const data=await response.json();
    if((options.method||"GET")==="GET")cache.set(cacheKey,data);
    return data;
  }

  return {
    compatibilityDate,
    getSystem:systemId=>request(`/universe/systems/${systemId}`),
    getPlanet:planetId=>request(`/universe/planets/${planetId}`),
    resolveNames:names=>request("/universe/ids",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(names)}),
    calculateRoute:(origin,destination,preference="shorter")=>request("/route",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({origin,destination,preference})}),
    clearCache:()=>cache.clear()
  };
})();
