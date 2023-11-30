export const units: Unit[] = [
  {
    id: "emissions",
    name: "Greenhouse gas emissions",
    suffix: "kg CO₂eq",
    suffixFull: "kilograms of carbon dioxide-equivalents",
    description:
      "Emissions of greenhouse gases in carbon dioxide-equivalents. Non-CO2 gases are weighted by the amount of warming they cause over a 100-year timescale.",
    sources: "OWID - Impacts of Food Production, Joseph Poore and Thomas Nemecek (2018)"
  },
  {
    id: "landUse",
    name: "Land use",
    suffix: "m²",
    suffixFull: "meters squared",
    description: "Land use, in meters squared (m²), per kilogram of a given food product",
    sources: "OWID - Impacts of Food Production, Joseph Poore and Thomas Nemecek (2018)"
  },
  {
    id: "waterUse",
    name: "Freshwater use",
    suffix: "L",
    suffixFull: "liters",
    description:
      "Freshwater withdrawals, liters per kilogram of food product. Does not factor in local water scarcity.",
    sources: "OWID - Impacts of Food Production, Joseph Poore and Thomas Nemecek (2018)"
  },
  {
    id: "eutrophy",
    name: "Eutrophication",
    suffix: "g PO₄eq",
    suffixFull: "grams of phosphate equivalents",
    description:
      "Eutrophying emissions represent runoff of excess nutrients into the surrounding environment and waterways, which affect and pollute ecosystems. They are measured in grams of phosphate equivalents (PO₄eq).",
    sources: "OWID - Impacts of Food Production, Joseph Poore and Thomas Nemecek (2018)"
  },
  {
    id: "yield",
    name: "Total yield",
    suffix: "kg",
    suffixFull: "kilograms",
    description:
      "Average actual global yields from 2017-21, measured in kg per hectare. Source data contains annual splits by country, if greater detail is required.",
    sources: "OWID - Crop Yields"
  },
  {
    id: "protein",
    name: "Protein",
    suffix: "g",
    suffixFull: "grams of protein",
    description: "The amount of protein supplied from the total yield or food type.",
    sources: "USDA"
  },
  {
    id: "calories",
    name: "Calories",
    suffix: "cal",
    suffixFull: "calories",
    description: "The energy supplied in calories from the total yield or food type.",
    sources: "USDA"
  },
  {
    id: "protein-per-capita",
    name: "Protein supply",
    suffix: "g / person / day",
    suffixFull: "grams of protein per person per day",
    description: "The average amount of daily protein per person by total farm yield.",
    sources: "USDA"
  }
]

// const othersFromSpreadsheet = [
//   {
//     id: "yieldPerHa",
//     suffix: "kg/ha",
//     suffixFull: "kilograms per hectare",
//     description:
//       "Average actual global yields from 2017-21, measured in kg per hectare. Source data contains annual splits by country, if greater detail is required.",
//     sources: "OWID - Crop Yields"
//   },
//   {
//     id: "cropLandAvailable/Used",
//     suffix: "ha",
//     suffixFull: "hectares",
//     description:
//       "Arable land suitable/used for planting of crops. Includes cropland used to grow animal feed.",
//     sources: "OWID - Land Use"
//   },
//   {
//     id: "grazingLandAvailable/Used",
//     suffix: "ha",
//     suffixFull: "hectares",
//     description:
//       "Land suitable/used for global pasture used for livestock grazing. Does not include cropland used to grow animal feed.",
//     sources: "OWID - Land Use"
//   },
//   {
//     id: "waterAvailable/Used",
//     suffix: "L",
//     suffixFull: "liters",
//     description:
//       "Renewable internal freshwater available/used (via internal river flows and groundwater from rainfall) in the country. Note: 1m³ is equal to 1000 liters.",
//     sources: "OWID - Water Use"
//   },
//   {
//     id: "ghgAnnual",
//     suffix: "kg CO₂eq",
//     suffixFull: "kilograms of carbon dioxide-equivalents",
//     description:
//       "Emissions of greenhouse gases in carbon dioxide-equivalents. Non-CO2 gases are weighted by the amount of warming they cause over a 100-year timescale.",
//     sources: "OWID - Greenhouse gas emissions"
//   },
//   {
//     id: "ghgAgriculturalAnnual",
//     suffix: "kg CO₂eq",
//     suffixFull: "kilograms of carbon dioxide-equivalents",
//     description:
//       "Emissions of greenhouse gases in carbon dioxide-equivalents. Non-CO2 gases are weighted by the amount of warming they cause over a 100-year timescale.",
//     sources: "OWID - Greenhouse gas emissions"
//   }
// ]
