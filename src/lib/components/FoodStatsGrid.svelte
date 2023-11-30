<script lang="ts">
  import { flip } from "svelte/animate"
  import { fade } from "svelte/transition"
  import { quintInOut as easing } from "svelte/easing"

  import { foodItems } from "$lib/data/foods"
  import { gameState } from "$lib/stores/state"

  import Button from "$lib/components/Button.svelte"
  import { largeNumber } from "$lib/utils/written"

  const impactPerHectare = (food: Food, xPerKg: number) =>
    xPerKg * food.yieldPerHa * $gameState.coefficients.yieldMultiplier

  const nutritionPerHectare = (food: Food, xPerKg: number, multiplier = 1) =>
    xPerKg *
    multiplier *
    food.yieldPerHa *
    $gameState.coefficients.yieldMultiplier *
    $gameState.coefficients.lossRatio

  const columns = [
    { label: "Name", sort: (a: Food, b: Food) => a.name.localeCompare(b.name) },
    {
      label: "Calories",
      sort: (a: Food, b: Food) =>
        nutritionPerHectare(b, b.calorieRatio) - nutritionPerHectare(a, a.calorieRatio)
    },
    {
      label: "Protein",
      sort: (a: Food, b: Food) =>
        nutritionPerHectare(b, b.proteinRatio, $gameState.coefficients.proteinMultiplier) -
        nutritionPerHectare(a, a.proteinRatio, $gameState.coefficients.proteinMultiplier)
    },
    {
      label: "Emissions",
      sort: (a: Food, b: Food) => impactPerHectare(b, b.ghgPerKg) - impactPerHectare(a, a.ghgPerKg)
    },
    {
      label: "Water",
      sort: (a: Food, b: Food) =>
        impactPerHectare(b, b.waterPerKg) - impactPerHectare(a, a.waterPerKg)
    }
  ]

  let sortFunction = columns[1].sort

  $: foods = foodItems.sort(sortFunction)
</script>

<div class="food-items-grid block">
  <h3 class="block-title flex align-center">
    Food output per hectare
    <sup class="label" data-tooltip-title="Sources" data-tooltip="Our World in Data; USDA.">ⓘ</sup>
  </h3>
  <div class="food-items-grid-body">
    <div class="food-card table-head">
      {#each columns as { label, sort }, i}
        <div class="th">
          <Button
            classList="bare bold"
            color="secondary"
            active={sortFunction === sort}
            onClick={() => {
              if (sortFunction === sort) foods = foods.reverse()
              else sortFunction = sort
            }}
          >
            {label}
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
        <div class="td">{largeNumber(nutritionPerHectare(f, f.calorieRatio))}</div>
        <div class="td">
          {largeNumber(
            nutritionPerHectare(f, f.proteinRatio, $gameState.coefficients.proteinMultiplier)
          )}
        </div>
        <div class="td">{largeNumber(impactPerHectare(f, f.ghgPerKg))}</div>
        <div class="td">{largeNumber(impactPerHectare(f, f.waterPerKg))}</div>
      </div>
    {/each}
  </div>
</div>

<style lang="sass">
.block-title
  sup
    margin-left: 0.5em

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
