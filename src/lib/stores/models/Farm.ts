import { GameSettings } from "./Game"

import { units } from "$lib/data/units"
import { foodItems as foods } from "$lib/data/foods"

export class Farm {
  initialState: FarmState
  grid: FarmGrid
  rows = 10
  cols = 10

  constructor(settings: GameSettings = new GameSettings()) {
    // Create a grid with separate arrays for each row
    this.grid = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(0))

    let x = 0
    let y = 0

    if (settings) {
      // Add any logic here for different game modes or regional selection
    }

    foods.forEach((item) => {
      let count = item.landAllocation

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

    this.initialState = this.getInitialState()
  }

  get yield() {
    const fn = (item: Food) => item.yieldPerHa
    const unit: Unit = units.find((o) => o.id === "yield") ?? units[0]
    return this.getFarmMetric(fn, unit)
  }

  get landUse() {
    const fn = (item: Food) => item.yieldPerHa * item.landPerKg
    const unit: Unit = units.find((o) => o.id === "landUse") ?? units[0]
    return this.getFarmMetric(fn, unit)
  }

  get waterUse() {
    const fn = (item: Food) => item.yieldPerHa * item.waterPerKg
    const unit: Unit = units.find((o) => o.id === "waterUse") ?? units[0]
    return this.getFarmMetric(fn, unit)
  }

  get emissions() {
    const fn = (item: Food) => item.yieldPerHa * item.ghgPerKg
    const unit: Unit = units.find((o) => o.id === "emissions") ?? units[0]
    return this.getFarmMetric(fn, unit)
  }

  get eutrophy() {
    const fn = (item: Food) => item.yieldPerHa * item.eutrophyPerKg
    const unit: Unit = units.find((o) => o.id === "eutrophy") ?? units[0]
    return this.getFarmMetric(fn, unit)
  }

  get protein() {
    const fn = (item: Food) => item.yieldPerHa * item.proteinRatio
    const unit: Unit = units.find((o) => o.id === "protein") ?? units[0]
    return this.getFarmMetric(fn, unit)
  }

  get calories() {
    const fn = (item: Food) => item.yieldPerHa * item.calorieRatio
    const unit: Unit = units.find((o) => o.id === "calories") ?? units[0]
    return this.getFarmMetric(fn, unit)
  }

  reset() {
    this.grid = JSON.parse(JSON.stringify(this.initialState.grid))
  }

  getInitialState() {
    const grid = this.grid
    const _yield = this.yield

    const landUse = this.landUse
    const waterUse = this.waterUse
    const eutrophy = this.eutrophy
    const emissions = this.emissions

    const protein = this.protein
    const calories = this.calories

    return JSON.parse(
      JSON.stringify({
        grid,
        yield: _yield,
        landUse,
        waterUse,
        eutrophy,
        emissions,
        protein,
        calories
      })
    )
  }

  getFarmMetric(fn: (item: Food) => number, unit: Unit): FarmMetric {
    const total = this.getTotalSum(fn)
    const byFood = this.getSumByFoodType(fn, unit)
    return { total, byFood }
  }

  plantCrop(x: number, y: number, foodItem: Food) {
    this.grid[y][x] = JSON.parse(JSON.stringify(foodItem))
  }

  getTotalSum(fn: (item: Food) => number): number {
    return +this.grid
      .flat()
      .reduce((acc, item) => acc + (item ? fn(item) : 0), 0)
      .toFixed(0)
  }

  getSumByFoodType(fn: (item: Food) => number, unit: Unit): FarmMetricFoodList[] {
    const initial: FarmMetricFoodList[] = []
    const foods = this.grid
      .flat()
      .reduce((acc, item) => {
        const index = acc.findIndex((o) => o.food?.id === item.id)
        if (index >= 0) {
          acc[index].value += fn(item)
          acc[index].count++
        } else acc.push({ value: fn(item), count: 1, food: item, unit })
        return acc
      }, initial)
      .sort((a, b) => b.value - a.value)

    return foods
  }
}
