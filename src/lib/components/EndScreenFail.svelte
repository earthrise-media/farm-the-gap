<script lang="ts">
  import { successMetrics, gameState, farm } from "$lib/stores/state"

  import LineChart from "$lib/components/LineChart.svelte"
  import Button from "$lib/components/Button.svelte"
  import { largeNumber, prettyPercent, prettyList } from "$lib/utils/written"
  import { foodItems } from "$lib/data/foods"

  export let reset = () => {}

  type FailureItem = typeof $successMetrics.emissionsChange

  const failedItem = [
    $successMetrics.emissionsChange,
    $successMetrics.eutrophyChange,
    $successMetrics.waterUseChange,
    $successMetrics.proteinPerPersonPerDay
  ].find((o) => o.fail) as FailureItem

  const farmMetricKey = failedItem.farmMetricKey as FarmMetricKey
  const foodMetricKey = failedItem.foodMetricKey as keyof Food
  const foodList = $farm[farmMetricKey].byFood
  const foods = foodItems.sort(
    (a, b) => b.yieldPerHa * b[foodMetricKey] - a.yieldPerHa * a[foodMetricKey]
  )
  console.log(foods)
</script>

{#if failedItem}
  <div class="fail-screen-wrapper">
    <section id="summary">
      <p>
        Nice try! In {$gameState.year.current - $gameState.year.start} years you managed to increase
        food production by {prettyPercent($successMetrics.calorieProductionChange)} and feed an additional
        {largeNumber($gameState.population.current - $gameState.population.start)} people.
      </p>
      <div class="flex align-center">
        <Button color="error" onClick={reset}>Try again</Button>
        <Button color="error" onClick={reset}>Undo last move</Button>
      </div>
    </section>
    <section id="explanation">
      <!-- <h3>Here's what went wrong</h3> -->
      <p>
        You failed to keep <b>{failedItem.label}</b>
        {failedItem.value > failedItem.limit ? "under" : "over"}
        {failedItem.limit}{failedItem.suffix}.
      </p>

      <div class="column-chart flex-col">
        <div class="label objective text-secondary-3">{failedItem.label}</div>
        <div class="line-chart label flex-center">
          <LineChart
            warn
            data={$successMetrics[failedItem.key].history}
            {...$successMetrics[failedItem.key].chartSettings}
          />
        </div>
      </div>
    </section>
    <section id="recommendations">
      <p>
        {prettyList(foods.slice(0, 3).map((f) => f.name))}
        have the highest
        {failedItem.label}
        per hectare of land, whereas
        {prettyList(
          foods
            .slice(-3)
            .map((f) => f.name)
            .reverse()
        )}
        have the lowest. Harness this knowledge and try to close the food gap again!
      </p>
      <Button color="error" onClick={reset}>Try again</Button>

      <!-- {#each foodList as { value, count, food, unit }, i (food.id)}
        <div class="food-card">
          <div class="label-index">#{i + 1}</div>
          <div class="food-item-avatar flex-center bg-{food.colorId}">{count}</div>
          <strong class="name">{food.name}</strong>
          <div class="value percent-value">
            {(100 * value) / $farm[farmMetricKey].total}<span class="text-secondary-3">%</span>
          </div>
          <div class="value absolute-value">
            <Number {value} duration={200} />
            <span class="text-secondary-3">{unit.suffix}</span>
          </div>
        </div>
      {/each} -->
    </section>
  </div>
{:else}
  <p>An error has occurred.</p>
{/if}

<style lang="sass">

.fail-screen-wrapper
  display: grid
  grid-template-columns: repeat(2, minmax(0, 1fr))
  grid-template-rows: repeat(2, minmax(0, 1fr))
  gap: 2rem

section
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
  justify-content: start
  gap: 0 1rem
  padding: 1rem 0
  overflow: hidden

#summary
  padding-top: 0
  grid-column: 1/-1
  border-bottom: 1px solid var(--color-error-2)

  > *
    max-width: 550px

#explanation
  .line-chart
    height: 4rem
    position: relative
    margin: 1rem 0 0

// #recommendations


</style>
