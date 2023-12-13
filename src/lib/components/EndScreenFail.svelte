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
        Bad luck, it's challenging to close the food gap! Over {$gameState.year.current -
          $gameState.year.start} years you {$successMetrics.calorieProductionChange > 0
          ? "increased"
          : "decreased"} global food production by {prettyPercent(
          Math.abs($successMetrics.calorieProductionChange)
        )}{$successMetrics.calorieProductionChange > 0 ? "," : "."}
        {#if $successMetrics.calorieProductionChange > 0}
          and fed an additional
          {largeNumber($gameState.population.current - $gameState.population.start)} people without clearing
          any more land for farming.
        {:else}
          Let's break that down.
        {/if}
      </p>
    </section>
    <section id="explanation">
      <p>
        You failed to keep <b>{failedItem.label}</b>
        {failedItem.value > failedItem.limit ? "under" : "over"}
        {(failedItem.suffix === "%" ? 100 : 1) * failedItem.limit}{failedItem.suffix}.
      </p>

      <div class="column-chart flex-col">
        <div class="label objective text-secondary-3">{failedItem.label}</div>
        <div class="line-chart label flex-center">
          <LineChart
            warn
            labels
            labelFormat={failedItem.suffix === "%" && prettyPercent}
            length={$gameState.year.current - $gameState.year.start}
            data={$successMetrics[failedItem.key].history}
            {...$successMetrics[failedItem.key].chartSettings}
          />
        </div>
      </div>
    </section>
    <section id="recommendations">
      <p class="bold">Harness this knowledge</p>
      <p>
        {@html foods
          .slice(0, 3)
          .map(
            (f) =>
              `<span class="food-item-pill"><span class="food-item-avatar bg-${f.colorId}"></span>${f.name}</span>`
          )
          .join(" ")}
        have the highest
        <b>{failedItem.label}</b>
        per hectare of land.
      </p>

      <p>
        {@html foods
          .slice(-3)
          .map(
            (f) =>
              `<span class="food-item-pill"><span class="food-item-avatar bg-${f.colorId}"></span>${f.name}</span>`
          )
          .reverse()
          .join(" ")}
        have the lowest.
      </p>
    </section>
    <section id="cta">
      <p>Now try to close the food gap again!</p>
      <Button color="error" onClick={reset}>Try again</Button>
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
  justify-content: center
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
    height: 3rem
    position: relative
    margin: 1rem 0 0

// #recommendations
#cta
  grid-column: 1 / -1
  border-top: 1px solid var(--color-error-2)


</style>
