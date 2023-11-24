import foods from "$lib/data/foods.json"
import groupBy from "lodash.groupby"

// Assign an id to each food in the format of `{food.proteinType}-{index}`, where index is the index of the food in the array of foods with the same protein type
const foodItems = foods
  .sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
  .map((food) => {
    const foodsWithSameProteinType = foods.filter((f) => f.proteinType === food.proteinType)
    const index = foodsWithSameProteinType.indexOf(food) + 1
    return {
      ...food,
      colorId: `${food.proteinType}-${index}`
    }
  })

const foodItemsGrouped = groupBy(foodItems, "proteinType")

export { foodItems, foodItemsGrouped }
