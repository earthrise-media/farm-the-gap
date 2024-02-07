import regions from "$lib/data/regions.json"
import { foodItems } from "$lib/data/foods"

export class GameSettings {
  region: Region = regions[0]
  mode: number = 0
  gap: number = 0.5 // Food gap
  undoLimit: number = 3 // # of undos allowed
  populationStart: number = 8 * 1000 * 1000 * 1000 // World population
}

export class UserState {
  showAboutPage: boolean = false
  hasBeenWelcomed: boolean = false
  itemInspecting: Food | null = null
  itemHighlighted: Food | null = null
  itemSelectedForSwap: Food | null = null
  isGameComplete: boolean = false
  toastIdsShown: (string | number)[] = []
  gameMetricHovering: keyof Food | null = null
  shareText: string = ""
}

export class YieldCoefficients {
  proteinMultiplier = 1 // accounts for improvements in protein per kg
  yieldMultiplier = 1 // accounts for improvements in yield per ha
  demandRatio = 0.5 // 0 = no animal products, 1 = only animal products
  lossRatio = 0.85 // % of nutrients retained (i.e. minus losses from waste, processing, storage, etc.)
  landRatio = 24 * 1000 * 1000 // amount of real world land (ha) each square represents
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
  startCount: number = 4

  // n = default starting count of each item in inventory
  constructor() {
    this.items = foodItems.map(({ id, name }) => ({
      id,
      name,
      available: this.startCount
    })) as InventoryItem[]
  }

  get(id: FoodId): InventoryItem {
    const item = this.items.find((item) => item.id === id)
    if (item) return item
    throw new Error(`Item with id ${id} not found in inventory.`)
  }

  reset() {
    this.items.forEach((item) => (item.available = this.startCount))
  }
}

export class NutritionalRequirements {
  carbs = 275
  protein = 68
  calories = 2250
}

export class GameState {
  year = {
    start: 2024,
    end: 2054,
    current: 2024
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
  }

  undo(): GameMove | undefined {
    if (this.moveHistory.length === 0 || this.undosRemaining === 0) return undefined

    const move = this.moveHistory.pop()

    if (move) {
      this.inventory.get(move.foodAdded.id).available++
      this.year.current--
      this.undosRemaining--
    }

    return move
  }

  reset() {
    this.inventory.reset()
    this.year.current = this.year.start
    this.undosRemaining = new GameSettings().undoLimit
  }
}
