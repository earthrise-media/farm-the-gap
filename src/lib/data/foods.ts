import foods from "$lib/data/foods.json"
import groupBy from "lodash.groupby"

// Assign an id to each food in the format of `{food.proteinType}-{index}`, where index is the index of the food in the array of foods with the same protein type
const foodItems = (foods as Food[])
  .sort(
    (a, b) =>
      // Sort by protein type, then by type, then by name
      a.proteinType.localeCompare(b.proteinType) ||
      b.type.localeCompare(a.type) ||
      a.name.localeCompare(b.name)
  )
  .map((food: Food) => {
    const foodsWithSameProteinType = foods.filter((f) => f.proteinType === food.proteinType)
    const index = foodsWithSameProteinType.indexOf(food) + 1
    return {
      ...food,
      colorId: `${food.proteinType}-${index}`
    }
  })
  .filter((o) => o.name !== "Mushrooms")

const foodItemsGrouped = groupBy(foodItems, "proteinType")

export { foodItems, foodItemsGrouped }
