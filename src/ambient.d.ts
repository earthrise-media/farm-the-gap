declare global {
  type InteractionEvent = MouseEvent | PointerEvent | TouchEvent | KeyboardEvent

  type FoodId =
    | "f01"
    | "f02"
    | "f03"
    | "f04"
    | "f05"
    | "f06"
    | "f07"
    | "f08"
    | "f09"
    | "f10"
    | "f11"
    | "f12"
    | "f13"
    | "f14"

  interface Food {
    id: FoodId
    name: string
    type: string
    emoji: string
    image?: string
    proteinType: string
    landAllocation: number
    yieldPerHa: number
    productionSources: string
    proteinRatio: number
    calorieRatio: number
    carbRatio: number
    fatRatio: number
    nutritionSources: string
    ghgPerKg: number
    waterPerKg: number
    eutrophyPerKg: number
    landPerKg: number
    impactSources: string
    description?: string
    colorId?: string
  }

  type FoodItemsGrouped = { [key: "animal" | "plant"]: Food[] }

  type UnitId =
    | "emissions"
    | "landUse"
    | "waterUse"
    | "eutrophy"
    | "yield"
    | "protein"
    | "calories"
    | "protein-per-capita"

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

  // GameState related types
  type InventoryItem = { id: FoodId; name: string; available: number }

  // Fail/success related types
  class GameSnapshot {
    year: number
    proteinPerPersonPerDay: number
    emissionsChange: number
    waterUseChange: number
    eutrophyChange: number
    hasSucceeded: boolean
    hasFailed: boolean
  }

  interface LineChartSettings {
    yDatum?: number
    yLimit?: number
    yMax?: number
    yMin?: number
  }

  type FailureMetricKey =
    | "proteinPerPersonPerDay"
    | "emissionsChange"
    | "waterUseChange"
    | "eutrophyChange"

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

  interface Count {
    food: Food
    initial: number
    current: number
    delta: number
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
    readonly foodChanges: Count[]
  }
}

export {}
