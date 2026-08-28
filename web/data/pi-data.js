/*
 * Browser-ready prototype subset. Replace or generate this file from CCP SDE/ESI
 * inputs later. Fields intentionally mirror the canonical JSON files in /data.
 */
window.PI_DATA = {
  metadata:{version:"prototype-0.2",source:"curated local placeholders",updated:"2026-08-28",live:false},
  restrictedSystems:["Amarr","Arnon","Aunia","Auvergne","Balginia","Dodixie","Fricoure","Ichoriya","Irjunen","Isaziwa","Isinokka","Jita","Lustrevik","Motsu","Oursulaert","Rens","Sankkasen","Umokka"],
  planets:[
    {id:"barren",name:"Barren",symbol:"BR",color:"#b98b61",resources:["Aqueous Liquids","Base Metals","Carbon Compounds","Micro Organisms","Noble Metals"]},
    {id:"gas",name:"Gas",symbol:"GA",color:"#a8ad99",resources:["Aqueous Liquids","Base Metals","Ionic Solutions","Noble Gas","Reactive Gas"]},
    {id:"ice",name:"Ice",symbol:"IC",color:"#87c6d6",resources:["Aqueous Liquids","Heavy Metals","Micro Organisms","Noble Gas","Planktic Colonies"]},
    {id:"lava",name:"Lava",symbol:"LA",color:"#dd674a",resources:["Base Metals","Felsic Magma","Heavy Metals","Non-CS Crystals","Suspended Plasma"]},
    {id:"oceanic",name:"Oceanic",symbol:"OC",color:"#458cc5",resources:["Aqueous Liquids","Carbon Compounds","Complex Organisms","Micro Organisms","Planktic Colonies"]},
    {id:"plasma",name:"Plasma",symbol:"PL",color:"#9d72d8",resources:["Base Metals","Heavy Metals","Noble Metals","Non-CS Crystals","Suspended Plasma"]},
    {id:"storm",name:"Storm",symbol:"ST",color:"#6b8fae",resources:["Aqueous Liquids","Base Metals","Ionic Solutions","Noble Gas","Suspended Plasma"]},
    {id:"temperate",name:"Temperate",symbol:"TE",color:"#62a873",resources:["Aqueous Liquids","Autotrophs","Carbon Compounds","Complex Organisms","Micro Organisms"]}
  ],
  products:[
    {id:"base-metals",tier:0,name:"Base Metals",planets:["barren","gas","lava","plasma","storm"],inputs:[]},
    {id:"noble-metals",tier:0,name:"Noble Metals",planets:["barren","gas","plasma"],inputs:[]},
    {id:"reactive-metals",tier:1,name:"Reactive Metals",planets:["barren","gas","lava","plasma","storm"],inputs:["Base Metals"]},
    {id:"precious-metals",tier:1,name:"Precious Metals",planets:["barren","gas","plasma"],inputs:["Noble Metals"]},
    {id:"water",tier:1,name:"Water",planets:["barren","gas","ice","oceanic","storm","temperate"],inputs:["Aqueous Liquids"]},
    {id:"mechanical-parts",tier:2,name:"Mechanical Parts",planets:["barren","plasma"],inputs:["Reactive Metals","Precious Metals"]},
    {id:"consumer-electronics",tier:2,name:"Consumer Electronics",planets:["barren","lava","temperate"],inputs:["Toxic Metals","Chiral Structures"]},
    {id:"robotics",tier:3,name:"Robotics",planets:["barren","plasma"],inputs:["Mechanical Parts","Consumer Electronics"]},
    {id:"integrity-response-drones",tier:4,name:"Integrity Response Drones",planets:[],inputs:["Gel-Matrix Biopaste","Hazmat Detection Systems","Planetary Vehicles"]},
    {id:"self-harmonizing-power-core",tier:4,name:"Self-Harmonizing Power Core",planets:[],inputs:["Camera Drones","Hermetic Membranes","Nuclear Reactors"]}
  ],
  systems:[
    {name:"Jita",region:"The Forge",security:0.9,jumps:{Jita:0,Perimeter:1,NewCaldari:1,Urlen:2,Maurasi:2,Sobaseki:3},planets:{barren:4,gas:2,storm:1},restricted:true},
    {name:"Perimeter",region:"The Forge",security:1.0,jumps:{Jita:1,Perimeter:0,NewCaldari:2,Urlen:3,Maurasi:3,Sobaseki:4},planets:{barren:3,gas:2,temperate:1},restricted:false},
    {name:"New Caldari",region:"The Forge",security:1.0,jumps:{Jita:1,Perimeter:2,NewCaldari:0,Urlen:3,Maurasi:2,Sobaseki:4},planets:{barren:2,gas:3,storm:1},restricted:false},
    {name:"Urlen",region:"The Forge",security:1.0,jumps:{Jita:2,Perimeter:3,NewCaldari:3,Urlen:0,Maurasi:2,Sobaseki:2},planets:{barren:2,gas:2,temperate:2,storm:1},restricted:false},
    {name:"Maurasi",region:"The Forge",security:0.9,jumps:{Jita:2,Perimeter:3,NewCaldari:2,Urlen:2,Maurasi:0,Sobaseki:3},planets:{barren:3,gas:2,lava:1,temperate:1},restricted:false},
    {name:"Sobaseki",region:"The Forge",security:0.8,jumps:{Jita:3,Perimeter:4,NewCaldari:4,Urlen:2,Maurasi:3,Sobaseki:0},planets:{barren:2,gas:2,ice:1,lava:1,storm:1,temperate:1},restricted:false}
  ]
};
