import { get, writable, derived } from "svelte/store"

import type { Food, FoodItemsGrouped } from "$lib/data/foods.d.ts"

import { foodItems as foods } from "$lib/data/foods"
import { units } from "$lib/data/units"
import regions from "$lib/data/regions.json"
import landUseByFood from "$lib/data/land-use-by-food.json"

type Region = (typeof regions)[0]

class GameSettings {
  region: Region = regions[0]
  mode: number = 0
}

class UserState {
  isInspecting = false
  itemSelectedForSwap: Food | null = null
}

class YieldCoefficients {
  proteinMultiplier = 1 // accounts for improvements in protein per kg
  yieldMultiplier = 1 // accounts for improvements in yield per ha
  demandRatio = 0.5 // 0 = no animal products, 1 = only animal products
  lossRatio = 0.9 // % of nutrients retained (i.e. minus losses from waste, processing, storage, etc.)
}

class NutritionalRequirements {
  carbs = 275
  protein = 70
  calories = 2250
}

class GameState {
  year = {
    start: 2020,
    end: 2070,
    current: 2020
  }

  population = {
    start: 500,
    end: 850,
    current: 500
  }

  coefficients = new YieldCoefficients()
  nutritionalRequirements = new NutritionalRequirements()

  update() {
    this.year.current++
    this.population.current +=
      (this.population.end - this.population.start) / (this.year.end - this.year.start)
  }

  reset() {
    this.year.current = this.year.start
    this.population.current = this.population.start
  }
}

class FarmGrid {
  _initialGrid: Food[][] = []
  grid: Food[][] = []
  items: string[] = []
  rows = 10
  cols = 10

  constructor(settings: GameSettings | null) {
    this.initialise(settings)
  }

  initialise(settings: GameSettings | null) {
    // Create a grid with separate arrays for each row
    this.grid = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(0))

    if (!settings) return

    const regionalLandUse = landUseByFood.find(({ rId }) => rId === settings?.region?.id)

    if (regionalLandUse) {
      let x = 0
      let y = 0

      foods.forEach((item) => {
        let count = Math.round(100 * regionalLandUse[item.id])

        while (count > 0 && y < this.cols) {
          this.plantCrop(x, y, item)
          x++
          count--
          if (x === this.rows) {
            x = 0
            y++
          }
        }
      })
    }

    this._initialGrid = JSON.parse(JSON.stringify(this.grid))
  }

  get initialGrid() {
    return JSON.parse(JSON.stringify(this._initialGrid))
  }

  get yield() {
    const fn = (item: Food) => item.yieldPerHa
    const total = this.getTotalSum(fn)
    const byFood = this.getSumByFoodType(fn)
    return { total, byFood }
  }

  get landUse() {
    const fn = (item: Food) => item.yieldPerHa * item.landPerKg
    const total = this.getTotalSum(fn)
    const byFood = this.getSumByFoodType(fn)
    return { total, byFood }
  }

  get waterUse() {
    const fn = (item: Food) => item.yieldPerHa * item.waterPerKg
    const total = this.getTotalSum(fn)
    const byFood = this.getSumByFoodType(fn)
    return { total, byFood }
  }

  get emissions() {
    const fn = (item: Food) => item.yieldPerHa * item.ghgPerKg
    const total = this.getTotalSum(fn)
    const byFood = this.getSumByFoodType(fn)
    return { total, byFood }
  }

  get eutrophy() {
    const fn = (item: Food) => item.yieldPerHa * item.eutrophyPerKg
    const total = this.getTotalSum(fn)
    const byFood = this.getSumByFoodType(fn)
    return { total, byFood }
  }

  get protein() {
    const fn = (item: Food) => item.yieldPerHa * item.proteinRatio
    const total = this.getTotalSum(fn)
    const byFood = this.getSumByFoodType(fn)
    return { total, byFood }
  }

  get calories() {
    const fn = (item: Food) => item.yieldPerHa * item.calorieRatio
    const total = this.getTotalSum(fn)
    const byFood = this.getSumByFoodType(fn)
    return { total, byFood }
  }

  plantCrop(x: number, y: number, foodItem: Food) {
    this.grid[y][x] = JSON.parse(JSON.stringify(foodItem))
  }

  getTotalSum(fn: (item: Food) => number) {
    return this.grid
      .flat()
      .reduce((acc, item) => acc + (item ? fn(item) : 0), 0)
      .toFixed(0)
  }

  getSumByFoodType(fn: (item: Food) => number) {
    const foods = this.grid.flat().reduce((acc, item) => {
      if (item) acc[item.id] = acc[item.id] !== undefined ? acc[item.id] + fn(item) : 0
      return acc
    }, {})

    Object.keys(foods).forEach((key) => (foods[key] = foods[key].toFixed(0))) // round to 0 decimal places

    return foods
  }
}

class EnvironmentalImpact {
  id = ""
  name = ""
  description = ""
  initialTotal = 0
  currentTotal = 0
  byFood = {}
  minimize = true

  constructor(farmGrid: FarmGrid, unit: Unit) {
    Object.assign(this, unit)

    if (this.id && farmGrid) {
      if (this.id === "ghgPerKg") this.currentTotal = farmGrid.emissions.total
      else if (this.id === "landPerKg") this.currentTotal = farmGrid.landUse.total
      else if (this.id === "waterPerKg") this.currentTotal = farmGrid.waterUse.total
      else if (this.id === "eutrophyPerKg") this.currentTotal = farmGrid.eutrophy.total

      this.initialTotal = JSON.parse(JSON.stringify(this.currentTotal))
      this.byFood = farmGrid
    }
  }
}

export const gameSettings = writable(new GameSettings())
export const userState = writable(new UserState())
export const gameState = writable(new GameState())
export const farmGrid = writable(new FarmGrid(get(gameSettings)))

export const successMetrics = derived([farmGrid, gameState], ([$farmGrid, $gameState]) => {
  const nutrientConversion =
    $gameState.coefficients.yieldMultiplier * $gameState.coefficients.lossRatio

  const caloriesPerPersonPerDay = (
    ($farmGrid.calories.total * nutrientConversion) /
    ($gameState.population.current * 365)
  ).toFixed(0)

  const proteinPerPersonPerDay = (
    ($farmGrid.protein.total * $gameState.coefficients.proteinMultiplier * nutrientConversion) /
    ($gameState.population.current * 365)
  ).toFixed(0)

  const hectaresPerPerson = (
    ($farmGrid.rows * $farmGrid.cols) /
    $gameState.population.current
  ).toFixed(2)

  const peopleAdequateCalories = +(
    (nutrientConversion * $farmGrid.calories.total) /
    (365 * $gameState.nutritionalRequirements.calories)
  ).toFixed(0)

  return {
    hectaresPerPerson,
    proteinPerPersonPerDay,
    caloriesPerPersonPerDay,
    peopleAdequateCalories
  }
})

// TODO
// Add in initial and current environmental impact stores
// Add in initial and current nutritional output stores
