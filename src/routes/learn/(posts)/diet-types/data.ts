type DietaryEmissions = {
  label: string
  summary: string
  value: number
  error?: [number, number]
}

export const dietsByEmissions: DietaryEmissions[] = [
  {
    label: "Vegan",
    summary: "A completely plant-based diet.",
    value: 7.89,
    error: [7.79, 8.0]
  },
  {
    label: "Vegetarian",
    summary:
      "A diet of grains, vegetables, fruits, sugars, oils, eggs and dairy and around one serving of meat or seafood per month.",

    value: 5.95,
    error: [4.69, 7.2]
  },
  {
    label: "Flexitarian",
    summary:
      "A diet in which 75% of meat and dairy is replaced by cereals and pulses. (This includes at least 500g of fruit and vegetables and at least 100g of plant-based protein per day – and no more than one portion of red meat a week.)",

    value: 5.12,
    error: [5.04, 5.2]
  },
  {
    label: "Healthy diet",
    summary:
      "A diet based on global dietary guidelines, which involves eating less meat and more fruit and vegetables.",

    value: 4.64,
    error: [2.88, 6.4]
  },
  {
    label: "Pescetarian",
    summary: "A vegetarian diet that includes seafood.",
    value: 4.0
  },
  {
    label: "Fair and frugal",
    summary:
      "A diet assuming food is shared equally across the world with each person consuming 2800 calories a day. (This involves a relatively low level of animal products.)",

    value: 4.0,
    error: [0.67, 7.33]
  },
  {
    label: "Climate carnivore",
    summary: "A diet where 75% of red meat is replaced with other meat.",
    value: 3.39
  },
  {
    label: "Mediterranean",
    summary:
      "A diet of vegetables, fruits, grains, sugars, oils, eggs, dairy, seafood and moderate amounts of poultry, pork, lamb and beef.",
    value: 3.01
  }
]
