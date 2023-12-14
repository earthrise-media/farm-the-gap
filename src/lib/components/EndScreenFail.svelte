<script lang="ts">
  import { successMetrics, sparklineData, gameState, farm } from "$lib/stores/state"

  import Button from "$lib/components/Button.svelte"
  import LineChart from "$lib/components/LineChart.svelte"
  import FoodChangesTable from "$lib/components/FoodChangesTable.svelte"
  import { largeNumber, prettyPercent, prettyList } from "$lib/utils/written"
  import { foodItems } from "$lib/data/foods"

  type FailureMetric = typeof $successMetrics.emissionsChange

  export let reset = () => {}
  export let failedMetric: FailureMetric | undefined
  export let exhaustedTurns: boolean

  let foods: Food[] = JSON.parse(JSON.stringify(foodItems))

  if (failedMetric) {
    let key = failedMetric.foodMetricKey
    foods.sort(
      (a, b) => (b.yieldPerHa * b[key]) / b.calorieRatio - (a.yieldPerHa * a[key]) / a.calorieRatio
    )
  }
</script>

<div class="fail-screen-wrapper">
  {#if failedMetric}
    <section id="explanation">
      <p>Here's how you changed the global agricultural landscape:</p>
      <div class="change-table">
        <FoodChangesTable />
      </div>
    </section>
    <section id="recommendations">
      <p class="bold">Harness this knowledge</p>
      <p class="label">
        Foods with the highest
        <b>{failedMetric.label}</b>
        per calorie.
      </p>
      <div class="flex">
        {@html foods
          .slice(0, 3)
          .map(
            (f) =>
              `<span class="food-item-pill"><span class="food-item-avatar bg-${f.colorId}"></span>${f.name}</span>`
          )
          .join(" ")}
      </div>
      <p class="label">
        Foods with the lowest
        <b>{failedMetric.label}</b>
        per calorie.
      </p>
      <div class="flex">
        {@html foods
          .slice(-3)
          .map(
            (f) =>
              `<span class="food-item-pill"><span class="food-item-avatar bg-${f.colorId}"></span>${f.name}</span>`
          )
          .reverse()
          .join(" ")}
      </div>
    </section>
  {:else if exhaustedTurns}
    <section id="explanation">
      <p>You ran out of turns before you could close the food gap.</p>
    </section>
    <section id="recommendations">
      <p>
        Try to increase the yield of the most productive crops, and reduce the yield of the least
        productive crops.
      </p>
    </section>
  {:else}
    <p>An error has occurred.</p>
  {/if}
  <section id="cta">
    <p>Now try to close the food gap again!</p>
    <Button color="error" onClick={reset}>Try again</Button>
  </section>
</div>

<style lang="sass">

.fail-screen-wrapper
  display: grid
  grid-template-columns: repeat(2, minmax(0, 1fr))
  grid-template-rows: repeat(2, minmax(0, 1fr))
  border-top: 1px solid var(--color-error-2)
  gap: 1rem

section
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
  justify-content: center
  gap: 0 1rem
  padding: 1rem 0
  overflow: hidden

#summary
  padding: 0
  grid-column: 1/-1
  border-bottom: 1px solid var(--color-error-2)

  > *
    max-width: 550px

#explanation
  .line-chart
    height: 3rem
    position: relative
    margin: 1rem 0 0

// #recommendations, #explanation
//   border-top: 1px solid var(--color-error-2)
  // border-bottom: 1px solid var(--color-error-2)

#cta
  grid-column: 1 / -1
  border-top: 1px solid var(--color-error-2)


</style>
