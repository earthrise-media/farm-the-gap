# Farm the Gap

*Developed with the software and tools below*

![Svelte Badge](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)
![Typescript Badge](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Typescript Badge](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

## 📍 Overview

[Farm The Gap](https://stories.theplotline.org/farm-the-gap/), a new digital puzzle game from [The Plotline](https://theplotline.org/), gives you the keys to this virtual global farm. Modeled on real-world data, the game’s objective is to close a 50% “food gap” by simply changing what we grow and eat.

This repository contains all the source code and data for the game.

## 👾 Development

### System requirements

- Node v20+
- npm/pnpm

### Steps

1. Clone the repo and run `npm install` to install dependencies
2. Start a development server: `npm run dev`
3. Build a production version: `npm run build`
4. Preview the production build: `npm run preview`.

## Global state

The brains of the game are defined in [/src/lib/stores/state.ts](/src/lib/stores/state.ts).

In this file are five `writable` Svelte stores:

1. `$farm`: the foods occupying the farm grid and their respective and total outputs
2. `$gameState`: years, undos, inventory
3. `$gameSettings`: high-level global variables
4. `$userState`: user preferences and interaction states
5. `$gameHistory`: history of moves (foods added/removed and where)

The first three stores feed into a `derived` Svelte store called `**$successMetrics**`. This store monitors the overall game status (win/loss) and the warning or fail states of each individual game metric (protein supply, emissions, etc). Any changes in the dependant stores triggers a recalculation of the derived store.

## Data types

Global types and class declarations can be found in [/src/ambient.ts](/src/ambient.ts). Some important data structures:

### Farm

```typescript
class Farm {
  constructor(settings: GameSettings | null)

  // properties
  initialState: FarmState
  grid: FarmGrid
  items: string[]
  rows: number
  cols: number

  // methods
  getInitialState(): FarmState
  getFarmMetric(fn: (item: Food) => number): FarmMetric
  plantCrop(x: number, y: number, foodItem: Food): void
  getTotalSum(fn: (item: Food) => number): number
  getSumByFoodType(fn: (item: Food) => number): FarmGridFoodList[]

  // getters
  readonly yield: FarmMetric
  readonly landUse: FarmMetric
  readonly waterUse: FarmMetric
  readonly emissions: FarmMetric
  readonly eutrophy: FarmMetric
  readonly protein: FarmMetric
  readonly calories: FarmMetric
  readonly foodChanges: Count[]
}
```

### Failure metrics

```typescript
interface FailureMetric {
  value: number
  key: FailureMetricKey
  label: string
  suffix: string
  limit: number
  objective: string
  warn: boolean
  fail: boolean
  history: number[]
  farmMetricKey: FarmMetricKey
  foodMetricKey: keyof Food
  chartSettings: LineChartSettings
}
```

### High-level game status

```typescript
interface SuccessMetrics {
  hectaresPerPerson: number
  peopleAdequateCalories: number
  calorieProductionChange: number
  caloriesPerPersonPerDayValue: number
  proteinPerPersonPerDay: FailureMetric
  emissionsChange: FailureMetric
  waterUseChange: FailureMetric
  eutrophyChange: FailureMetric
  hasSucceeded: boolean
  hasFailed: boolean
}
```

## Source data

### Foods

I had to whittle down the hundreds of foods eaten globally into a sensible list of groups for easy gameplay. That involved making decisions about how to group and categorize foods, and finding the optimal trade-off between simplicity and accuracy. I arrived at the 13 foods and food groups in the stats table below.

| Food | globalLand (%) | kgYieldPerHa | caloriesPerKg | proteinPerKg | emissionsPerKg | waterUsePerKg | eutrophyPerKg | landPerKg |
| ---  | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 🐄 Beef | 53 | 50 | 2,430 | 175 | 95 | 2494 | 428.7 | 295.3 | 
| 🐑 Lamb | 10 | 27 | 2,550 | 171 | 39.7 | 1803 | 97.1 | 369.8 |
| 🥛 Dairy | 6 | 2,458 | 610 | 32.7 | 3.7 | 310 | 11.5 | 4.1 |
| 🌾 Rice | 5 | 4,740 | 3,590 | 70.4 | 3.9 | 1,586 | 26.5 | 2.9 | 
| 🍞 Wheat | 5 | 3,483 | 3,700 | 151 | 1.6 | 648 | 7.2 | 3.9 | 
| 🐖 Pork | 4 | 737 | 2,280 | 178 | 9.8 | 1292 | 60.9 | 13.6 |
| 🥜 Nuts* | 3 | 1,600 | 5,930 | 206.7 | 1.8 | 2993 | 16.6 | 11 |
| 🫘 Legumes* | 3 | 1,896 | 3093 | 192 | 1.4 | 52 | 11.7 | 16.4 |
| 🐓 Poultry | 3 | 1,200 | 1,330 | 179 | 8.2 | 483 | 34.3 | 8.3 |
| 🌽 Corn | 2 | 5,847 | 3,640 | 62 | 1.7 | 216 | 4 | 2.9 |
| 🥦 Vegetables* | 2 | 19,862 | 663 | 16.7 | 0.5 | 48 | 1.9 | 0.4 |
| 🍊 Fruit* | 2 | 13,655 | 418 | 6.8 | 1.1 | 186 | 3.5 | 1 |
| 🥚 Eggs | 2 | 1,465 | 1,430 | 124 | 4.4 | 830 | 20 | 6.8 |

- ***Nuts** impact data is the average of Nuts and Groundnuts (commodity data); nutrition data is the average of raw peanuts, almonds, and cashews.*
- ***Legumes** data is a weighted average of Beans (75%), Chickpeas (10%), Lentils (5%), Garden Peas (10%)*
- ***Vegetables** impact data is the weighted average of Root Vegetables (75%), Other Vegetables (20%), and Brassicas (5%). Nutrition data is the weighted average of gold potatoes, mature carrots and raw broccoli.*
- ***Fruit** impact data is weighted average of Apples (11%), Bananas (14%), Berries (1%), Citrus Fruit (18%), Tomatoes (21%), and Other Fruit (35%) (commodity data). Nutritional data is weighted average of red delicious apples, bananas, strawberries, navel oranges, roma tomatoes and bartlett pears.*

Find these defined in [/src/lib/data/foods.json](/src/lib/data/foods.json).

The game relies on four core datasets for each food type, outlined in the table below.











