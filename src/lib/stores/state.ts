import { get, writable, derived } from "svelte/store"

import { GameSettings, UserState, GameState } from "./models/Game"
import { Farm } from "./models/Farm"
import { units } from "$lib/data/units"

export const gameSettings = writable(new GameSettings())
export const userState = writable(new UserState())
export const gameState = writable(new GameState())
export const farm = writable(new Farm(get(gameSettings)))

export const successMetrics = derived(
  [farm, gameState, gameSettings],
  ([$farm, $gameState, $gameSettings]) => {
    const { population, year, coefficients, nutritionalRequirements } = $gameState

    const nutrientConversion = coefficients.yieldMultiplier * coefficients.lossRatio

    const caloriesPerPersonPerDay = +(
      ($farm.calories.total * nutrientConversion) /
      (population.current * 365)
    ).toFixed(0)

    const proteinPerPersonPerDay = +(
      ($farm.protein.total * coefficients.proteinMultiplier * nutrientConversion) /
      (population.current * 365)
    ).toFixed(0)

    const calorieProductionChange =
      ($farm.calories.total - $farm.initialState.calories.total) / $farm.initialState.calories.total

    const hectaresPerPerson = +(($farm.rows * $farm.cols) / population.current).toFixed(2)

    const peopleAdequateCalories = +(
      (nutrientConversion * $farm.calories.total) /
      (365 * nutritionalRequirements.calories)
    ).toFixed(0)

    const emissionsChange =
      ($farm.emissions.total - $farm.initialState.emissions.total) /
      $farm.initialState.emissions.total

    const waterUseChange =
      ($farm.waterUse.total - $farm.initialState.waterUse.total) / $farm.initialState.waterUse.total

    const eutrophyChange =
      ($farm.eutrophy.total - $farm.initialState.eutrophy.total) / $farm.initialState.eutrophy.total

    const hasSucceeded = calorieProductionChange >= $gameSettings.gap

    const hasFailed =
      year.current >= year.end ||
      proteinPerPersonPerDay < $gameState.nutritionalRequirements.protein ||
      emissionsChange > 0.05 ||
      waterUseChange > 0.1 ||
      eutrophyChange > 0.1

    return {
      hectaresPerPerson,
      peopleAdequateCalories,
      calorieProductionChange,
      caloriesPerPersonPerDay,
      proteinPerPersonPerDay: {
        value: proteinPerPersonPerDay,
        label: "Protein per capita",
        suffix: "g",
        objective: `Keep above ${$gameState.nutritionalRequirements.protein}g`,
        warn: proteinPerPersonPerDay < $gameState.nutritionalRequirements.protein + 5
      },
      emissionsChange: {
        value: emissionsChange,
        label: "Emissions",
        suffix: "%",
        objective: "Keep below +5%",
        warn: emissionsChange > 0.03
      },
      waterUseChange: {
        value: waterUseChange,
        label: "Freshwater use",
        suffix: "%",
        objective: "Keep below +10%",
        warn: waterUseChange > 0.05
      },
      eutrophyChange: {
        value: eutrophyChange,
        label: "Water pollution",
        suffix: "%",
        objective: "Keep below +10%",
        warn: eutrophyChange > 0.05
      },
      hasSucceeded,
      hasFailed
    }
  }
)
