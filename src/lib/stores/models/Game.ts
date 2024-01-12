import regions from "$lib/data/regions.json"
import { foodItems } from "$lib/data/foods"

export class GameSettings {
  region: Region = regions[0]
  mode: number = 0
  gap: number = 0.5 // Food gap
  undoLimit: number = 3 // # of undos allowed
}

export class UserState {
  showAboutPage: boolean = false
  hasBeenWelcomed: boolean = false
  itemInspecting: Food | null = null
  itemHighlighted: Food | null = null
  itemSelectedForSwap: Food | null = null
  isGameComplete: boolean = false
  toastIdsShown: (string | number)[] = []
}

export class YieldCoefficients {
  proteinMultiplier = 1 // accounts for improvements in protein per kg
  yieldMultiplier = 1 // accounts for improvements in yield per ha
  demandRatio = 0.5 // 0 = no animal products, 1 = only animal products
  lossRatio = 0.85 // % of nutrients retained (i.e. minus losses from waste, processing, storage, etc.)
  landRatio = 24000000 // amount of real world land (ha) each square represents
}

export class GameMove {
  timestamp: number = Date.now()
  foodAdded: Food
  foodRemoved: Food
  x: number
  y: number

  constructor(foodAdded: Food, foodRemoved: Food, x: number, y: number) {
    this.foodAdded = foodAdded
    this.foodRemoved = foodRemoved
    this.x = x
    this.y = y
  }
}

export class GameSnapshot {
  year: number
  calorieProductionChange: number
  proteinPerPersonPerDay: number
  emissionsChange: number
  waterUseChange: number
  eutrophyChange: number
  hasSucceeded: boolean
  hasFailed: boolean

  constructor(
    year: number,
    calorieProductionChange: number,
    proteinPerPersonPerDay: number,
    emissionsChange: number,
    waterUseChange: number,
    eutrophyChange: number,
    hasSucceeded: boolean,
    hasFailed: boolean
  ) {
    this.year = year
    this.calorieProductionChange = calorieProductionChange
    this.proteinPerPersonPerDay = proteinPerPersonPerDay
    this.emissionsChange = emissionsChange
    this.waterUseChange = waterUseChange
    this.eutrophyChange = eutrophyChange
    this.hasSucceeded = hasSucceeded
    this.hasFailed = hasFailed
  }
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
  calories = 2000
}

export class GameState {
  year = {
    start: 2020,
    end: 2050,
    current: 2020
  }

  population = {
    start: 7850000000,
    current: 7850000000,
    end: 1.5 * 7850000000,
    growth: ~~((1.5 * 7850000000 - 7850000000) / (this.year.end - this.year.start))
  }

  undosRemaining = new GameSettings().undoLimit
  moveHistory: GameMove[] = []
  inventory = new Inventory()
  coefficients = new YieldCoefficients()
  nutritionalRequirements = new NutritionalRequirements()

  update(foodAdded: Food, foodRemoved: Food, x: number, y: number) {
    this.inventory.get(foodAdded.id).available--
    this.year.current++
    this.moveHistory.push(new GameMove(foodAdded, foodRemoved, x, y))
    this.population.current += this.population.growth
  }

  undo(): GameMove | undefined {
    if (this.moveHistory.length === 0 || this.undosRemaining === 0) return undefined

    const move = this.moveHistory.pop()

    if (move) {
      this.inventory.get(move.foodAdded.id).available++
      this.year.current--
      this.population.current -= this.population.growth
      this.undosRemaining--
    }

    return move
  }

  reset() {
    this.inventory.reset()
    this.year.current = this.year.start
    this.population.current = this.population.start
    this.undosRemaining = new GameSettings().undoLimit
  }
}
