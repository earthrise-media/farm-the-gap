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
    <section id="failed-metric">
      <div class="col">
        <div class="food-item-avatar bg-plant-2">1</div>
        <div class="label">
          <div>Use the data table to sort foods by <b>{failedMetric.label} per hectare</b>.</div>
          <span>&darr;</span>
        </div>
        <img class="food-table-preview" src="/img/table.png" alt="Food stats table preview" />
      </div>
      <div class="col">
        <div class="food-item-avatar bg-plant-2">2</div>
        <div class="recommendation-efficiency-group">
          <p>
            Foods with the highest
            <b>{failedMetric.label}</b>
            per calorie.
          </p>
          <div class="flex food-item-pill-group">
            {@html foods
              .slice(0, 3)
              .map(
                (f) =>
                  `<span class="food-item-pill"><span class="food-item-avatar bg-${f.colorId}"></span>${f.name}</span>`
              )
              .join(" ")}
          </div>
        </div>
        <div class="recommendation-efficiency-group">
          <p>
            Foods with the lowest
            <b>{failedMetric.label}</b>
            per calorie.
          </p>
          <div class="flex food-item-pill-group">
            {@html foods
              .slice(-3)
              .map(
                (f) =>
                  `<span class="food-item-pill"><span class="food-item-avatar bg-${f.colorId}"></span>${f.name}</span>`
              )
              .reverse()
              .join(" ")}
          </div>
        </div>
      </div>
      <div class="col">
        <div class="food-item-avatar bg-plant-2">3</div>
        <p>
          Remember your objective is to maximise calorie production, but you must keep environmental
          impacts in check.
        </p>
        <p>Now try to close the food gap again!</p>
      </div>
      <Button color="error-invert" onClick={reset}>Try again<br />&rarr;</Button>
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
    <p>An error has occurredy.</p>
  {/if}
</div>

<style lang="sass">
.fail-screen-wrapper
  display: grid
  grid-template-columns: repeat(4, minmax(200px, 1fr))
  grid-template-rows: repeat(1, minmax(0, 1fr))
  border-top: 2px solid var(--color-error-1)
  gap: 1rem

section
  gap: 0 1rem
  padding: 1rem 0
  overflow: hidden

#failed-metric
  font-size: 0.875rem
  display: flex
  grid-column: 1/-1

  .col
    flex: 1

    &.border
      border: 2px solid var(--color-error-1)
      padding: 1rem
      border-radius: var(--border-radius)

#explanation,
#recommendations
  p
    font-size: 0.75rem
    margin-bottom: 0

#recommendations
  .failed-metric &
    gap: 1rem

  .food-item-pill-group
    gap: 0.5rem
    font-size: 0.875em
    justify-content: center
    margin-top: 0.25rem

.food-table-preview
  width: 75%
  margin: auto
  border: 1px solid var(--color-error-1)
  border-radius: 0.75rem

</style>
