declare global {
  interface Food {
    id: string
    name: string
    type: string
    proteinType: string
    yieldPerHa: number
    proteinRatio: number
    calorieRatio: number
    carbRatio: number
    fatRatio: number
    vitamins: string
    ghgPerKg: number
    landPerKg: number
    waterPerKg: number
    eutrophyPerKg: number
    landAllocation: number
    sources: string
    description: string
    colorId?: string
  }

  type FoodItemsGrouped = { [key: string]: Food[] }

  type UnitId = "emissions" | "landUse" | "waterUse" | "eutrophy" | "yield" | "protein" | "calories"

  interface Unit {
    id: UnitId
    name: string
    suffix: string
    suffixFull: string
    description: string
    sources: string
  }

  interface Region {
    id: string
    name: string
    population: number
    dailyProteinPerCapita: number
    dailyCaloriesPerCapita: number
    cropLandAvailable: number
    grazingLandAvailable: number
    waterAvailable: number
    cropLandUsed: number
    grazingLandUsed: number
    waterAgriculturalUsed: number
    ghgAnnual: number
    ghgAgriculturalAnnual: number
    note: string
  }

  // Farm related types
  type FarmKey = keyof Farm

  type FarmGrid = Food[][]
  type FarmMetricFoodList = { value: number; count: number; food: Food; unit: Unit }
  type FarmMetricKey = Exclude<keyof FarmState, "grid"> // key of FarmState without "grid"

  interface FarmMetric {
    total: number
    byFood: FarmMetricFoodList[]
  }

  interface FarmState {
    grid: FarmGrid
    yield: FarmMetric
    landUse: FarmMetric
    waterUse: FarmMetric
    eutrophy: FarmMetric
    emissions: FarmMetric
    protein: FarmMetric
    calories: FarmMetric
  }

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
  }
}

export {}
