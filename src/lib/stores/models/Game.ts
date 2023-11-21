import regions from "$lib/data/regions.json"

export class GameSettings {
  region: Region = regions[0]
  mode: number = 0
}

export class UserState {
  hasBeenWelcomed: boolean = false
  itemInspecting: Food | null = null
  itemSelectedForSwap: Food | null = null
}

export class YieldCoefficients {
  proteinMultiplier = 1 // accounts for improvements in protein per kg
  yieldMultiplier = 1 // accounts for improvements in yield per ha
  demandRatio = 0.5 // 0 = no animal products, 1 = only animal products
  lossRatio = 0.9 // % of nutrients retained (i.e. minus losses from waste, processing, storage, etc.)
}

export class NutritionalRequirements {
  carbs = 275
  protein = 70
  calories = 2250
}

export class GameState {
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
