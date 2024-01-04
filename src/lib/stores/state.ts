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
      ($farm.calories.total * nutrientConversion * coefficients.landRatio) /
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
      ($farm.protein.total *
        coefficients.proteinMultiplier *
        nutrientConversion *
        coefficients.landRatio) /
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

      // If year already exists in history, replace it with the new snapshot. This is necessary because all values are tweened.
      const index = $gameHistory.findIndex((item) => item.year === year.current)

      if (index === -1) $gameHistory.push(snapshot)

      return $gameHistory
    })

    // Metric monitors
    const proteinPerPersonPerDay: FailureMetric = {
      value: proteinPerPersonPerDayValue,
      key: "proteinPerPersonPerDay",
      label: "Protein per capita",
      suffix: "g",
      limit: proteinPerPersonPerDayLimit,
      objective: `Keep above ${proteinPerPersonPerDayLimit}g`,
      warn: proteinPerPersonPerDayValue < proteinPerPersonPerDayLimit + 3,
      fail: proteinPerPersonPerDayValue < proteinPerPersonPerDayLimit,
      history: $gameHistory.map((o) => o.proteinPerPersonPerDay),
      farmMetricKey: "protein",
      foodMetricKey: "proteinRatio",
      chartSettings: {
        yLimit: proteinPerPersonPerDayLimit,
        yMin: proteinPerPersonPerDayLimit,
        yMax: proteinPerPersonPerDayLimit + 15
      }
    }

    const emissionsChange: FailureMetric = {
      value: emissionsChangeValue,
      key: "emissionsChange",
      label: "GHG Emissions",
      suffix: "%",
      limit: emissionsChangeLimit,
      objective: `Keep below +${100 * emissionsChangeLimit}%`,
      warn: emissionsChangeValue > emissionsChangeLimit - 0.05,
      fail: emissionsChangeValue > emissionsChangeLimit,
      history: $gameHistory.map((o) => o.emissionsChange),
      farmMetricKey: "emissions",
      foodMetricKey: "ghgPerKg",
      chartSettings: {
        yDatum: 0,
        yLimit: emissionsChangeLimit,
        yMax: emissionsChangeLimit,
        yMin: -0.5 * emissionsChangeLimit
      }
    }

    const waterUseChange: FailureMetric = {
      value: waterUseChangeValue,
      key: "waterUseChange",
      label: "Freshwater use",
      suffix: "%",
      limit: waterUseChangeLimit,
      objective: `Keep below +${100 * waterUseChangeLimit}%`,
      warn: waterUseChangeValue > waterUseChangeLimit - 0.05,
      fail: waterUseChangeValue > waterUseChangeLimit,
      history: $gameHistory.map((o) => o.waterUseChange),
      farmMetricKey: "waterUse",
      foodMetricKey: "waterPerKg",
      chartSettings: {
        yDatum: 0,
        yLimit: waterUseChangeLimit,
        yMax: waterUseChangeLimit,
        yMin: -0.5 * waterUseChangeLimit
      }
    }
    const eutrophyChange: FailureMetric = {
      value: eutrophyChangeValue,
      key: "eutrophyChange",
      label: "Water pollution",
      suffix: "%",
      limit: eutrophyChangeLimit,
      objective: `Keep below +${100 * eutrophyChangeLimit}%`,
      warn: eutrophyChangeValue > eutrophyChangeLimit - 0.05,
      fail: eutrophyChangeValue > eutrophyChangeLimit,
      history: $gameHistory.map((o) => o.eutrophyChange),
      farmMetricKey: "eutrophy",
      foodMetricKey: "eutrophyPerKg",
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

export const sparklineData = derived(successMetrics, ($successMetrics) => [
  $successMetrics.proteinPerPersonPerDay,
  $successMetrics.emissionsChange,
  $successMetrics.waterUseChange,
  $successMetrics.eutrophyChange
])
