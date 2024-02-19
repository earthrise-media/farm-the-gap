export type TimeseriesData = { year: number; v: number }

export const landPerUnitCrop: TimeseriesData[] = [
  { year: 1961, v: 1 },
  { year: 1962, v: 0.9682853 },
  { year: 1963, v: 0.95070416 },
  { year: 1964, v: 0.9132061 },
  { year: 1965, v: 0.9062892 },
  { year: 1966, v: 0.873958 },
  { year: 1967, v: 0.84447247 },
  { year: 1968, v: 0.82726955 },
  { year: 1969, v: 0.83606195 },
  { year: 1970, v: 0.802121 },
  { year: 1971, v: 0.77679247 },
  { year: 1972, v: 0.7934283 },
  { year: 1973, v: 0.7344187 },
  { year: 1974, v: 0.740913 },
  { year: 1975, v: 0.7277065 },
  { year: 1976, v: 0.71495765 },
  { year: 1977, v: 0.6981448 },
  { year: 1978, v: 0.6647877 },
  { year: 1979, v: 0.66162694 },
  { year: 1980, v: 0.67072684 },
  { year: 1981, v: 0.6419906 },
  { year: 1982, v: 0.62010205 },
  { year: 1983, v: 0.630063 },
  { year: 1984, v: 0.5990099 },
  { year: 1985, v: 0.59779644 },
  { year: 1986, v: 0.5936485 },
  { year: 1987, v: 0.589321 },
  { year: 1988, v: 0.5884104 },
  { year: 1989, v: 0.56148976 },
  { year: 1990, v: 0.5478828 },
  { year: 1991, v: 0.5438137 },
  { year: 1992, v: 0.5249928 },
  { year: 1993, v: 0.52316594 },
  { year: 1994, v: 0.5082512 },
  { year: 1995, v: 0.501697 },
  { year: 1996, v: 0.47350883 },
  { year: 1997, v: 0.4656658 },
  { year: 1998, v: 0.46051568 },
  { year: 1999, v: 0.44589993 },
  { year: 2000, v: 0.43413937 },
  { year: 2001, v: 0.42716244 },
  { year: 2002, v: 0.4226383 },
  { year: 2003, v: 0.41346398 },
  { year: 2004, v: 0.3907418 },
  { year: 2005, v: 0.38532808 },
  { year: 2006, v: 0.37677768 },
  { year: 2007, v: 0.36602485 },
  { year: 2008, v: 0.34986505 },
  { year: 2009, v: 0.3493918 },
  { year: 2010, v: 0.3402539 },
  { year: 2011, v: 0.32642615 },
  { year: 2012, v: 0.32667488 },
  { year: 2013, v: 0.31247377 },
  { year: 2014, v: 0.30631664 },
  { year: 2015, v: 0.3027444 },
  { year: 2016, v: 0.29877293 },
  { year: 2017, v: 0.29131758 },
  { year: 2018, v: 0.2890248 },
  { year: 2019, v: 0.28523624 },
  { year: 2020, v: 0.2816289 }
]

export const productionStrategies = [
  {
    title: "Improving crop yields",
    summary:
      "Precision agriculture, new seed varieties, optimized fertilizer use, all aim to produce more in the same space.",
    potential: "Moderate to significant gains possible, but limits exist to what land can handle"
  },
  {
    title: "Livestock & Aquaculture Efficiency",
    summary:
      "Advances in breeding, feed optimization, and disease control increase production levels per animal.",
    potential:
      "Moderate: Improvement achievable, but won't negate the core resource needs of livestock"
  },
  {
    title: "Expanding into Marginal Lands",
    summary: "Using underutilized areas with care.",
    potential:
      "Potential is limited, as these 'marginal' lands often hold ecosystems despite lacking current crop suitability."
  }
]

export const consumptionStrategies = [
  {
    title: "Reducing Biofuel Reliance",
    summary: "Competition between food and fuel for land drives food prices up.",
    potential: "Significant on specific crops (corn), less so globally"
  },
  {
    title: "Population Stabilization",
    summary:
      "Slowing population growth is key long-term, but impact in coming decades limited by current demographics.",
    potential: ""
  },
  {
    title: "Food Waste Reduction",
    summary:
      "Shockingly large volumes lost across the chain. Infrastructure, consumer shifts vital.",
    potential: "Significant"
  },
  {
    title: "Dietary Shifts",
    summary: "Less meat/dairy consumption frees up land, eases pressure.",
    potential: "Massive, but social change is complex",
    highlight: true
  }
]

export type Strategy = {
  title: string
  summary: string
  potential: string
  highlight?: boolean
}
