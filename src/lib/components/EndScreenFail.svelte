<script lang="ts">
  import { base } from "$app/paths"
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
    foods.sort((a, b) => b[key] / b.calorieRatio - a[key] / a.calorieRatio)
  }
</script>

<div class="fail-screen-wrapper">
  {#if failedMetric || exhaustedTurns}
    <section>
      <div class="col">
        <div class="step-counter">1</div>
        <p>
          {#if exhaustedTurns}
            You ran out of turns before you could close the food gap.
          {/if}
          Remember your objective is to maximise calorie production, {#if exhaustedTurns}
            so trade the least efficient foods out for the most efficient ones.
          {:else}but you must maintain protein levels and keep environmental impacts in check.{/if}
        </p>
      </div>
      <div class="col">
        <div class="step-counter">2</div>
        <div class="label">
          {#if exhaustedTurns}
            <div>Use the data table to sort foods by calorie efficiency.</div>
          {:else if failedMetric}
            <div>
              Use the data table to sort foods by <b>{failedMetric.label}</b> and other metrics.
            </div>
          {/if}
          <span>&darr;</span>
        </div>
        <img class="food-table-preview" src="{base}/img/table.png" alt="Food stats table preview" />
      </div>
      {#if failedMetric}
        <div class="col">
          <div class="step-counter">3</div>
          <div class="label">
            <div>Check out these foods</div>
            <span>&darr;</span>
          </div>
          <div class="recommendation-efficiency-group">
            <p>
              These foods have the highest
              <b>{failedMetric.label} per calorie:</b>
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
            <p>These foods have the lowest:</p>
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
      {/if}
      <div class="col">
        <div class="step-counter">{failedMetric ? 4 : 3}</div>
        <div class="label">
          <div>Try to close the food gap one&nbsp;more&nbsp;time!</div>
          <span>&darr;</span>
        </div>
        <div class="button-retry-wrap">
          <Button color="secondary" onClick={reset}>Try again &rarr;</Button>
        </div>
      </div>
    </section>
  {:else}
    <p>An error has occurred.</p>
  {/if}
</div>

<style lang="sass">
.fail-screen-wrapper
  display: grid
  grid-template-columns: repeat(4, minmax(0, 1fr))
  border-top: 2px solid var(--color-error-1)
  gap: 1rem

section
  gap: 0 1rem
  padding: 1rem 0
  display: flex
  overflow: hidden
  font-size: 0.875rem
  grid-column: 1/-1

.col
  flex: 1
  display: flex
  flex-direction: column
  align-items: center
  height: 100%

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

.recommendation-efficiency-group
  display: flex
  margin: 0.5rem 0
  flex-direction: column
  align-items: center
  p
    margin-bottom: 0.25rem

.food-item-pill-group
  gap: 0.5rem
  justify-content: center

.food-table-preview
  width: 75%
  margin: auto
  border-radius: 0.25rem

.step-counter
  background: var(--color-plant-2)
  height: 1.5rem
  width: 1.5rem
  line-height: 1.5rem
  border-radius: 1rem
  margin-bottom: 0.75rem

.button-retry-wrap
  flex: 1
  display: flex
  align-items: center
  justify-self: center

  :global(button)
    width: 100%
    padding: 2rem
    border: 1px solid var(--color-tertiary-1)
    animation: flash 0.5s ease-in-out infinite alternate


</style>
