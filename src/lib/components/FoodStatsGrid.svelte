<script lang="ts">
  import { flip } from "svelte/animate"
  import { fade } from "svelte/transition"
  import { quintInOut as easing } from "svelte/easing"

  import { foodItems } from "$lib/data/foods"
  import { gameState } from "$lib/stores/state"

  import Button from "$lib/components/Button.svelte"
  import { largeNumber } from "$lib/utils/written"

  type Key = "hectare" | "kilogram"
  type Measure = { key: Key; label: string }
  type KeyMetricGetter = { value: (f: Food) => string | number; sort: (a: Food, b: Food) => number }
  type SortableData = { label: string; hectare: KeyMetricGetter; kilogram: KeyMetricGetter }

  const measures: Measure[] = [
    { key: "hectare", label: "per hectare land" },
    { key: "kilogram", label: "per kilogram food" }
  ]

  const impactPerHectare = (food: Food, xPerKg: number) =>
    xPerKg * food.yieldPerHa * $gameState.coefficients.yieldMultiplier

  const nutritionPerHectare = (food: Food, xPerKg: number, multiplier = 1) =>
    xPerKg *
    multiplier *
    food.yieldPerHa *
    $gameState.coefficients.yieldMultiplier *
    $gameState.coefficients.lossRatio

  const data: SortableData[] = [
    {
      label: "Name",
      hectare: {
        value: (f: Food) => f.name,
        sort: (a: Food, b: Food) => a.name.localeCompare(b.name)
      },
      kilogram: {
        value: (f: Food) => f.name,
        sort: (a: Food, b: Food) => a.name.localeCompare(b.name)
      }
    },
    {
      label: "Calories",
      hectare: {
        value: (f: Food) => largeNumber(nutritionPerHectare(f, f.calorieRatio)),
        sort: (a: Food, b: Food) =>
          nutritionPerHectare(b, b.calorieRatio) - nutritionPerHectare(a, a.calorieRatio)
      },
      kilogram: {
        value: (f: Food) => f.calorieRatio.toFixed(0),
        sort: (a: Food, b: Food) => b.calorieRatio - a.calorieRatio
      }
    },
    {
      label: "Protein",
      hectare: {
        value: (f: Food) =>
          largeNumber(
            nutritionPerHectare(f, f.proteinRatio, $gameState.coefficients.proteinMultiplier)
          ),
        sort: (a: Food, b: Food) =>
          nutritionPerHectare(b, b.proteinRatio, $gameState.coefficients.proteinMultiplier) -
          nutritionPerHectare(a, a.proteinRatio, $gameState.coefficients.proteinMultiplier)
      },
      kilogram: {
        value: (f: Food) => f.proteinRatio.toFixed(0),
        sort: (a: Food, b: Food) => b.proteinRatio - a.proteinRatio
      }
    },
    {
      label: "Emissions",
      hectare: {
        value: (f: Food) => largeNumber(impactPerHectare(f, f.ghgPerKg)),
        sort: (a: Food, b: Food) =>
          impactPerHectare(b, b.ghgPerKg) - impactPerHectare(a, a.ghgPerKg)
      },
      kilogram: {
        value: (f: Food) => f.ghgPerKg.toFixed(1),
        sort: (a: Food, b: Food) => b.ghgPerKg - a.ghgPerKg
      }
    },
    {
      label: "Water",
      hectare: {
        value: (f: Food) => largeNumber(impactPerHectare(f, f.waterPerKg)),
        sort: (a: Food, b: Food) =>
          impactPerHectare(b, b.waterPerKg) - impactPerHectare(a, a.waterPerKg)
      },
      kilogram: {
        value: (f: Food) => f.waterPerKg.toFixed(0),
        sort: (a: Food, b: Food) => b.waterPerKg - a.waterPerKg
      }
    }
  ]

  let currentMeasure: Measure = measures[0]
  let sortFunction = data[1][currentMeasure.key].sort

  $: foods = foodItems.sort(sortFunction)
</script>

<div class="food-items-grid block">
  <h3 class="block-title flex align-center">
    Food output data
    <sup class="label" data-tooltip-title="Sources" data-tooltip="Our World in Data; USDA.">ⓘ</sup>
  </h3>
  <div class="measure-buttons label-caps flex align-center">
    {#each measures as { key, label }}
      <Button
        active={currentMeasure.key === key}
        onClick={() => {
          const sortedIndex = data.findIndex((o) => o[currentMeasure.key].sort === sortFunction)

          currentMeasure = measures.find((m) => m.key === key) ?? measures[0]

          sortFunction = data[sortedIndex][currentMeasure.key].sort
        }}
        classList="label-caps"
      >
        {label}
      </Button>
    {/each}
  </div>
  <div class="food-items-grid-body">
    <div class="food-card table-head">
      {#each data as column, i}
        <div class="th">
          <Button
            classList="bare bold"
            color="secondary"
            active={sortFunction === column[currentMeasure.key].sort}
            onClick={() => {
              if (sortFunction === column[currentMeasure.key].sort) foods = foods.reverse()
              else sortFunction = column[currentMeasure.key].sort
            }}
          >
            {column.label}
          </Button>
        </div>
      {/each}
    </div>
    {#each foods as f, i (f.id)}
      <div
        class="food-card"
        animate:flip={{ duration: 800, easing, delay: 8 * i }}
        role="button"
        tabindex="-1"
      >
        <div class="food-item-avatar flex-center bg-{f.colorId}" />
        <strong class="name">{f.name}</strong>
        {#each data.slice(1) as column}
          <div class="td">
            {column[currentMeasure.key].value(f)}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="sass">
.block-title
  sup
    margin-left: 0.5em

.measure-buttons
  gap: 0.25rem
  margin: 0.25rem 0 0

.food-items-grid
  gap: 0.25rem

.food-items-grid-body
  display: grid
  grid-template-columns: 1fr
  font-size: 0.875rem
  overflow: hidden
  gap: 1px

.food-card
  display: grid
  grid-template-columns: auto 11ch repeat(4, minmax(0, 1fr))
  gap: 0.125em
  font-size: 0.625rem
  padding: 0.25em 0
  height: 100%
  transition: filter 0.2s ease-in-out
  cursor: pointer
  position: relative
  overflow: hidden

  .name, .td, .th
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis

  .name
    margin-left: 0.25em

  .td, .th
    text-align: right

    &:first-child
      text-align: left

  .th
    &.active
      color: var(--color-secondary-1)

.table-head
  .th
    &:first-child
      grid-column: 1 / span 2

@media (hover: hover)
  .food-card:not(:first-child):hover
    filter: brightness(1.25)

</style>
