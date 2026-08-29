#!/usr/bin/env python3
"""Build a browser-safe EVE PI data bundle from CCP's official JSONL SDE.

Generated files are static so GitHub Pages works without a server, character
login, OAuth token, or application secret.
"""

from __future__ import annotations

import argparse
import json
import re
import zipfile
from collections import defaultdict
from datetime import date
from pathlib import Path


PLANET_TYPE_IDS = {
    2016: ("barren", "Barren", "#b98b61"),
    13: ("gas", "Gas", "#a8ad99"),
    12: ("ice", "Ice", "#87c6d6"),
    2014: ("lava", "Lava", "#dd674a"),
    2015: ("oceanic", "Oceanic", "#458cc5"),
    2063: ("plasma", "Plasma", "#9d72d8"),
    2017: ("storm", "Storm", "#6b8fae"),
    11: ("temperate", "Temperate", "#62a873"),
}

STRUCTURE_TYPE_IDS = {
    "commandCenter": 2524,
    "ecu": 2848,
    "basic": 2473,
    "advanced": 2474,
    "highTech": 2475,
    "launchpad": 2544,
    "storage": 2541,
}

COMMAND_CENTER_LEVEL_TYPE_IDS = [2524, 2129, 2130, 2131, 2132, 2133]

# This fixed gameplay relationship is not represented as a direct SDE table.
PLANET_RESOURCES = {
    "barren": ["Aqueous Liquids", "Base Metals", "Carbon Compounds", "Micro Organisms", "Noble Metals"],
    "gas": ["Aqueous Liquids", "Base Metals", "Ionic Solutions", "Noble Gas", "Reactive Gas"],
    "ice": ["Aqueous Liquids", "Heavy Metals", "Micro Organisms", "Noble Gas", "Planktic Colonies"],
    "lava": ["Base Metals", "Felsic Magma", "Heavy Metals", "Non-CS Crystals", "Suspended Plasma"],
    "oceanic": ["Aqueous Liquids", "Carbon Compounds", "Complex Organisms", "Micro Organisms", "Planktic Colonies"],
    "plasma": ["Base Metals", "Heavy Metals", "Noble Metals", "Non-CS Crystals", "Suspended Plasma"],
    "storm": ["Aqueous Liquids", "Base Metals", "Ionic Solutions", "Noble Gas", "Suspended Plasma"],
    "temperate": ["Aqueous Liquids", "Autotrophs", "Carbon Compounds", "Complex Organisms", "Micro Organisms"],
}

NAMED_RESTRICTED_SYSTEMS = {
    "Amarr", "Arnon", "Aunia", "Auvergne", "Balginia", "Dodixie", "Fricoure",
    "Ichoriya", "Irjunen", "Isaziwa", "Isinokka", "Jita", "Lustrevik", "Motsu",
    "Oursulaert", "Rens", "Sankkasen", "Umokka",
}

# 75 standard and 25 small-ship shattered systems occupy this contiguous block;
# Thera is also shattered and PI-ineligible.
SHATTERED_SYSTEM_IDS = {31000005, *range(31002505, 31002605)}


def english(value):
    return value.get("en", next(iter(value.values()), "")) if isinstance(value, dict) else value


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def rows(archive: zipfile.ZipFile, name: str):
    with archive.open(name) as source:
        for raw in source:
            if raw.strip():
                yield json.loads(raw)


def compact_json(value) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("sde_zip", type=Path)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--build", default="3464040")
    args = parser.parse_args()

    root = args.root.resolve()
    web_data = root / "web" / "data"
    generated = root / "data" / "generated"
    web_data.mkdir(parents=True, exist_ok=True)
    generated.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(args.sde_zip) as archive:
        regions = {row["_key"]: english(row.get("name", {})) for row in rows(archive, "mapRegions.jsonl")}

        systems_by_id = {}
        for row in rows(archive, "mapSolarSystems.jsonl"):
            system_id = row["_key"]
            systems_by_id[system_id] = {
                "id": system_id,
                "name": english(row["name"]),
                "regionId": row["regionID"],
                "region": regions.get(row["regionID"], "Unknown"),
                "security": round(float(row.get("securityStatus", -1)), 4),
                "planets": {},
                "planetInstances": [],
                "neighbors": set(),
            }

        for row in rows(archive, "mapPlanets.jsonl"):
            planet = PLANET_TYPE_IDS.get(row.get("typeID"))
            system = systems_by_id.get(row.get("solarSystemID"))
            if planet and system:
                planet_slug = planet[0]
                system["planets"][planet_slug] = system["planets"].get(planet_slug, 0) + 1
                system["planetInstances"].append({
                    "id": row["_key"],
                    "typeId": planet_slug,
                    "index": row.get("celestialIndex"),
                    "radius": int(row.get("radius", 0)),
                })

        for row in rows(archive, "mapStargates.jsonl"):
            origin = row.get("solarSystemID")
            destination = row.get("destination", {}).get("solarSystemID")
            if origin in systems_by_id and destination in systems_by_id:
                systems_by_id[origin]["neighbors"].add(destination)
                systems_by_id[destination]["neighbors"].add(origin)

        schematics = list(rows(archive, "planetSchematics.jsonl"))
        material_ids = {entry["_key"] for schematic in schematics for entry in schematic.get("types", [])}
        wanted_type_ids = material_ids | set(PLANET_TYPE_IDS) | set(STRUCTURE_TYPE_IDS.values()) | set(COMMAND_CENTER_LEVEL_TYPE_IDS)
        type_names = {}
        type_details = {}
        for row in rows(archive, "types.jsonl"):
            type_id = row["_key"]
            if type_id in wanted_type_ids:
                type_names[type_id] = english(row.get("name", {}))
                type_details[type_id] = {
                    "typeId": type_id,
                    "name": english(row.get("name", {})),
                    "basePrice": row.get("basePrice", 0),
                    "capacity": row.get("capacity", 0),
                    "volume": row.get("volume", 0),
                }

        dogma_by_type = {}
        fitting_type_ids = set(STRUCTURE_TYPE_IDS.values()) | set(COMMAND_CENTER_LEVEL_TYPE_IDS)
        for row in rows(archive, "typeDogma.jsonl"):
            if row["_key"] in fitting_type_ids:
                dogma_by_type[row["_key"]] = {
                    attribute["attributeID"]: attribute["value"]
                    for attribute in row.get("dogmaAttributes", [])
                }

    recipes = {}
    for schematic in schematics:
        inputs = [entry for entry in schematic["types"] if entry.get("isInput")]
        outputs = [entry for entry in schematic["types"] if not entry.get("isInput")]
        for output in outputs:
            recipes[output["_key"]] = {
                "schematicId": schematic["_key"],
                "cycleTime": schematic["cycleTime"],
                "quantity": output["quantity"],
                "inputs": [{"typeId": item["_key"], "quantity": item["quantity"]} for item in inputs],
            }

    tier_cache = {}

    def tier(type_id: int) -> int:
        if type_id in tier_cache:
            return tier_cache[type_id]
        recipe = recipes.get(type_id)
        value = 0 if not recipe else 1 + max(tier(item["typeId"]) for item in recipe["inputs"])
        tier_cache[type_id] = value
        return value

    raw_cache = {}

    def raw_inputs(type_id: int) -> set[int]:
        if type_id in raw_cache:
            return raw_cache[type_id]
        recipe = recipes.get(type_id)
        result = {type_id} if not recipe else set().union(*(raw_inputs(item["typeId"]) for item in recipe["inputs"]))
        raw_cache[type_id] = result
        return result

    name_to_type_id = {name: type_id for type_id, name in type_names.items()}
    resources_by_planet = {
        planet_slug: {name_to_type_id[name] for name in names if name in name_to_type_id}
        for planet_slug, names in PLANET_RESOURCES.items()
    }

    products = []
    for type_id in sorted(material_ids, key=lambda item: (tier(item), type_names.get(item, ""))):
        name = type_names.get(type_id, f"Type {type_id}")
        recipe = recipes.get(type_id)
        required_raw = raw_inputs(type_id)
        possible_planets = [planet_slug for planet_slug, resources in resources_by_planet.items() if required_raw.issubset(resources)]
        products.append({
            "id": slugify(name),
            "typeId": type_id,
            "tier": tier(type_id),
            "name": name,
            "volume": type_details[type_id].get("volume", 0),
            "planets": possible_planets,
            "inputs": [type_names.get(item["typeId"], f"Type {item['typeId']}") for item in recipe["inputs"]] if recipe else [],
            "inputItems": recipe["inputs"] if recipe else [],
            "rawInputs": [type_names[item] for item in sorted(required_raw, key=lambda raw_id: type_names.get(raw_id, ""))],
            "outputQuantity": recipe["quantity"] if recipe else None,
            "cycleTime": recipe["cycleTime"] if recipe else None,
            "schematicId": recipe["schematicId"] if recipe else None,
        })

    planets = [
        {"id": slug, "typeId": type_id, "name": name, "symbol": name[:2].upper(), "color": color, "resources": PLANET_RESOURCES[slug]}
        for type_id, (slug, name, color) in PLANET_TYPE_IDS.items()
    ]

    structures = {
        "source": "CCP SDE types.jsonl and typeDogma.jsonl",
        "attributes": {
            "powerOutput": 11,
            "cpuOutput": 48,
            "powerUse": 15,
            "cpuUse": 49,
            "ecuHeadCpuUse": 1690,
            "ecuHeadPowerUse": 1691,
        },
        "commandCenterLevels": [
            {
                "level": level,
                "label": ["Basic", "Limited", "Standard", "Improved", "Advanced", "Elite"][level],
                "typeId": type_id,
                "power": int(dogma_by_type[type_id][11]),
                "cpu": int(dogma_by_type[type_id][48]),
            }
            for level, type_id in enumerate(COMMAND_CENTER_LEVEL_TYPE_IDS)
        ],
        "items": {},
    }
    for key, type_id in STRUCTURE_TYPE_IDS.items():
        if key == "commandCenter":
            continue
        details = type_details[type_id]
        dogma = dogma_by_type[type_id]
        structures["items"][key] = {
            **details,
            "power": int(dogma.get(15, 0)),
            "cpu": int(dogma.get(49, 0)),
        }
        if key == "ecu":
            structures["items"][key]["headPower"] = int(dogma.get(1691, 0))
            structures["items"][key]["headCpu"] = int(dogma.get(1690, 0))

    systems = []
    restricted_names = set()
    for system in sorted(systems_by_id.values(), key=lambda item: item["name"].casefold()):
        named_restriction = system["name"] in NAMED_RESTRICTED_SYSTEMS
        shattered = system["id"] in SHATTERED_SYSTEM_IDS
        restricted = named_restriction or shattered
        if restricted:
            restricted_names.add(system["name"])
        systems.append({
            **{key: value for key, value in system.items() if key != "neighbors"},
            "planetTotal": sum(system["planets"].values()),
            "planetInstances": sorted(system["planetInstances"], key=lambda planet: planet["index"] or 0),
            "neighbors": sorted(system["neighbors"]),
            "restricted": restricted,
            "restrictionReason": "Shattered wormhole system" if shattered else ("High-traffic or storyline restriction" if named_restriction else None),
        })

    metadata = {
        "version": "0.9.0",
        "source": "CCP EVE Online Static Data Export (JSONL)",
        "sourceUrl": "https://developers.eveonline.com/static-data/eve-online-static-data-latest-jsonl.zip",
        "sdeBuild": str(args.build),
        "generated": date.today().isoformat(),
        "live": True,
        "characterLoginRequired": False,
        "counts": {
            "systems": len(systems),
            "regions": len(regions),
            "planets": sum(system["planetTotal"] for system in systems),
            "stargateLinks": sum(len(system["neighbors"]) for system in systems) // 2,
            "products": len(products),
            "schematics": len(schematics),
            "restrictedSystems": len(restricted_names),
            "structureArchetypes": len(structures["items"]),
        },
        "notes": [
            "System, region, security, planet, stargate, item and schematic records come from CCP's SDE.",
            "Individual planet IDs, orbital indices and radii support the colony layout distance model.",
            "PI commodity volumes support cargo and hauling calculations.",
            "Command-center outputs and planetary structure CPU, powergrid, capacity and base-price records come from CCP typeDogma and type data.",
            "Planet-to-resource availability is versioned locally because the SDE does not expose it as a direct table.",
            "Named restrictions and shattered-system IDs are explicit and data-driven.",
            "Current regional market orders are requested from public ESI at runtime and are not baked into the SDE bundle.",
        ],
    }

    bundle = {
        "metadata": metadata,
        "systemIndex": [system["name"] for system in systems],
        "restrictedSystems": sorted(restricted_names),
        "planets": planets,
        "products": products,
        "structures": structures,
        "systems": systems,
    }

    (web_data / "pi-data.js").write_text(
        "/* Generated by src/data/build_sde_data.py; do not edit by hand. */\nwindow.PI_DATA=" + compact_json(bundle) + ";\n",
        encoding="utf-8",
    )
    (generated / "metadata.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (generated / "systems.json").write_text(json.dumps(systems, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    (generated / "pi-products.json").write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (generated / "structures.json").write_text(json.dumps(structures, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (root / "data" / "structures.json").write_text(json.dumps(structures, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(metadata["counts"], indent=2))


if __name__ == "__main__":
    main()
