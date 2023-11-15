export interface Food {
  id: string
  name: string
  type: string
  proteinType: string
  yieldPerHa: number
  yieldEstimated: number
  proteinRatio: number
  calorieRatio: number
  carbRatio: number
  fatRatio: number
  vitamins: string
  ghgPerKg: number
  landPerKg: number
  waterPerKg: number
  eutrophyPerKg: number
  pricePerKg: number
  media: string
  sources: string
  description: string
  colorId?: string
}

export type FoodItemsGrouped = { [key: string]: Food[] }
