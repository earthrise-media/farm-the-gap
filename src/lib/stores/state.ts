import { get, writable, derived } from "svelte/store"

import { GameSettings, UserState, GameState, GameSnapshot } from "./models/Game"
import { Farm } from "./models/Farm"

export const gameSettings = writable(new GameSettings())
export const userState = writable(new UserState())
export const gameState = writable(new GameState())
export const gameHistory = writable([] as GameSnapshot[])
export const farm = writable(new Farm(get(gameSettings)))

export const successMetrics = derived(
  [farm, gameState, gameSettings],
  ([$farm, $gameState, $gameSettings]) => {
    const { population, year, coefficients, nutritionalRequirements } = $gameState
    const nutrientConversion = coefficients.yieldMultiplier * coefficients.lossRatio
    const $gameHistory = get(gameHistory)

    const caloriesPerPersonPerDayValue = +(
      ($farm.calories.total * nutrientConversion) /
      (population.current * 365)
    ).toFixed(0)

    const calorieProductionChange =
      ($farm.calories.total - $farm.initialState.calories.total) / $farm.initialState.calories.total

    const hectaresPerPerson = +(($farm.rows * $farm.cols) / population.current).toFixed(2)

    const peopleAdequateCalories = +(
      (nutrientConversion * $farm.calories.total) /
      (365 * nutritionalRequirements.calories)
    ).toFixed(0)

    // Protein
    const proteinPerPersonPerDayLimit = $gameState.nutritionalRequirements.protein
    const proteinPerPersonPerDayValue = +(
      ($farm.protein.total * coefficients.proteinMultiplier * nutrientConversion) /
      (population.current * 365)
    ).toFixed(0)

    // Emissions
    const emissionsChangeLimit = 0.1
    const emissionsChangeValue =
      ($farm.emissions.total - $farm.initialState.emissions.total) /
      $farm.initialState.emissions.total

    // Water use
    const waterUseChangeLimit = 0.1
    const waterUseChangeValue =
      ($farm.waterUse.total - $farm.initialState.waterUse.total) / $farm.initialState.waterUse.total

    // Eutrophy
    const eutrophyChangeLimit = 0.1
    const eutrophyChangeValue =
      ($farm.eutrophy.total - $farm.initialState.eutrophy.total) / $farm.initialState.eutrophy.total

    // Check for success or failure
    const hasSucceeded = calorieProductionChange >= $gameSettings.gap
    const hasFailed =
      year.current >= year.end ||
      proteinPerPersonPerDayValue < proteinPerPersonPerDayLimit ||
      emissionsChangeValue > emissionsChangeLimit ||
      waterUseChangeValue > waterUseChangeLimit ||
      eutrophyChangeValue > eutrophyChangeLimit

    // Update snapshot history

    gameHistory.update(($gameHistory) => {
      const snapshot = new GameSnapshot(
        year.current,
        proteinPerPersonPerDayValue,
        emissionsChangeValue,
        waterUseChangeValue,
        eutrophyChangeValue,
        hasSucceeded,
        hasFailed
      )

      const index = $gameHistory.findIndex((item) => item.year === year.current)

      // if (index >= 0) $gameHistory[index] = snapshot
      if (index === -1) $gameHistory.push(snapshot)

      return $gameHistory
    })

    // Metric monitors
    const proteinPerPersonPerDay = {
      value: proteinPerPersonPerDayValue,
      key: "proteinPerPersonPerDay",
      label: "Protein per capita",
      suffix: "g",
      limit: proteinPerPersonPerDayLimit,
      objective: `Keep above ${proteinPerPersonPerDayLimit}g`,
      warn: proteinPerPersonPerDayValue < proteinPerPersonPerDayLimit + 3,
      history: $gameHistory.map((o) => o.proteinPerPersonPerDay),
      chartSettings: {
        yDatum: proteinPerPersonPerDayLimit,
        yMin: proteinPerPersonPerDayLimit,
        yMax: proteinPerPersonPerDayLimit + 10
      }
    }

    const emissionsChange = {
      value: emissionsChangeValue,
      key: "emissionsChange",
      label: "GHG Emissions",
      suffix: "%",
      limit: emissionsChangeLimit,
      objective: `Keep below +${100 * emissionsChangeLimit}%`,
      warn: emissionsChangeValue > emissionsChangeLimit - 0.02,
      history: $gameHistory.map((o) => o.emissionsChange),
      chartSettings: {
        yDatum: 0,
        yLimit: emissionsChangeLimit,
        yMax: emissionsChangeLimit,
        yMin: -0.5 * emissionsChangeLimit
      }
    }

    const waterUseChange = {
      value: waterUseChangeValue,
      key: "waterUseChange",
      label: "Freshwater use",
      suffix: "%",
      limit: waterUseChangeLimit,
      objective: `Keep below +${100 * waterUseChangeLimit}%`,
      warn: waterUseChangeValue > waterUseChangeLimit - 0.05,
      history: $gameHistory.map((o) => o.waterUseChange),
      chartSettings: {
        yDatum: 0,
        yLimit: waterUseChangeLimit,
        yMax: waterUseChangeLimit,
        yMin: -0.5 * waterUseChangeLimit
      }
    }
    const eutrophyChange = {
      value: eutrophyChangeValue,
      key: "eutrophyChange",
      label: "Water pollution",
      suffix: "%",
      limit: eutrophyChangeLimit,
      objective: `Keep below +${100 * eutrophyChangeLimit}%`,
      warn: eutrophyChangeValue > eutrophyChangeLimit - 0.05,
      history: $gameHistory.map((o) => o.eutrophyChange),
      chartSettings: {
        yDatum: 0,
        yLimit: eutrophyChangeLimit,
        yMax: eutrophyChangeLimit,
        yMin: -0.5 * eutrophyChangeLimit
      }
    }

    return {
      hectaresPerPerson,
      peopleAdequateCalories,
      calorieProductionChange,
      caloriesPerPersonPerDayValue,
      proteinPerPersonPerDay,
      emissionsChange,
      waterUseChange,
      eutrophyChange,
      hasSucceeded,
      hasFailed
    }
  }
)
