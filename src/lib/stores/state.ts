import { get, writable, derived } from "svelte/store"

import { GameSettings, UserState, GameState } from "./models/Game"
import { Farm } from "./models/Farm"

export const gameSettings = writable(new GameSettings())
export const userState = writable(new UserState())
export const gameState = writable(new GameState())
export const farm = writable(new Farm(get(gameSettings)))

export const successMetrics = derived([farm, gameState], ([$farm, $gameState]) => {
  const nutrientConversion =
    +$gameState.coefficients.yieldMultiplier * $gameState.coefficients.lossRatio

  const caloriesPerPersonPerDay = +(
    ($farm.calories.total * nutrientConversion) /
    ($gameState.population.current * 365)
  ).toFixed(0)

  const proteinPerPersonPerDay = +(
    ($farm.protein.total * $gameState.coefficients.proteinMultiplier * nutrientConversion) /
    ($gameState.population.current * 365)
  ).toFixed(0)

  const hectaresPerPerson = +(($farm.rows * $farm.cols) / $gameState.population.current).toFixed(2)

  const peopleAdequateCalories = +(
    (nutrientConversion * $farm.calories.total) /
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
