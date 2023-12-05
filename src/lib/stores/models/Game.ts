import regions from "$lib/data/regions.json"
import { foodItems } from "$lib/data/foods"

export class GameSettings {
  region: Region = regions[0]
  mode: number = 0
  gap: number = 0.5 // Food gap
}

export class UserState {
  showAboutPage: boolean = false
  hasBeenWelcomed: boolean = false
  itemInspecting: Food | null = null
  itemSelectedForSwap: Food | null = null
  milestonesAchieved: string[] = []
  isGameComplete: boolean = false
}

export class YieldCoefficients {
  proteinMultiplier = 1 // accounts for improvements in protein per kg
  yieldMultiplier = 1 // accounts for improvements in yield per ha
  demandRatio = 0.5 // 0 = no animal products, 1 = only animal products
  lossRatio = 0.85 // % of nutrients retained (i.e. minus losses from waste, processing, storage, etc.)
}

export class Inventory {
  items: InventoryItem[]

  // n = default starting count of each item in inventory
  constructor(n: number = 3) {
    this.items = foodItems.map(({ id, name }) => ({ id, name, available: n })) as InventoryItem[]
  }

  get(id: FoodId): InventoryItem {
    const item = this.items.find((item) => item.id === id)
    if (item) return item
    throw new Error(`Item with id ${id} not found in inventory.`)
  }

  reset() {
    this.items.forEach((item) => (item.available = 3))
  }
}

export class NutritionalRequirements {
  carbs = 275
  protein = 70
  calories = 2250
}

export class GameState {
  year = {
    start: 2020,
    end: 2050,
    current: 2020
  }

  population = {
    start: 500,
    end: 850,
    current: 500
  }

  inventory = new Inventory()
  coefficients = new YieldCoefficients()
  nutritionalRequirements = new NutritionalRequirements()

  update(id: FoodId) {
    this.inventory.get(id).available--
    this.year.current++
    this.population.current +=
      (this.population.end - this.population.start) / (this.year.end - this.year.start)
  }

  reset() {
    this.inventory.reset()
    this.year.current = this.year.start
    this.population.current = this.population.start
  }
}
