import foods from "$lib/data/foods.json"
import groupBy from "lodash.groupby"

const excludedFoods = [
  "Apples",
  "Cassava",
  "Berries/Grapes",
  "Onions/Leeks",
  "Potatoes",
  "Milk",
  "Brassicas",
  "Citrus Fruit",
  "Prawns (farmed)",
  "Bananas",
  "Tomatoes"
] // NOTE: ALREADY EXCLUDED FROM FOOD.JSON, BUT KEEPING FOR REFERENCE

const filteredFoods = foods.filter((food) => !excludedFoods.includes(food.name))

// Assign an id to each food in the format of `{food.proteinType}-{index}`, where index is the index of the food in the array of foods with the same protein type
const foodItems = filteredFoods.map((food) => {
  const foodsWithSameProteinType = filteredFoods.filter((f) => f.proteinType === food.proteinType)
  const index = foodsWithSameProteinType.indexOf(food) + 1
  return {
    ...food,
    colorId: `${food.proteinType}-${index}`
  }
})

const foodItemsGrouped = groupBy(foodItems, "proteinType")

export { foodItems, foodItemsGrouped }
