<script lang="ts">
  import { farmGrid, gameState, successMetrics } from "$lib/stores/state"

  import Farm from "$lib/components/Farm.svelte"
  import Number from "$lib/components/Number.svelte"
  import Button from "$lib/components/Button.svelte"
  import FoodMenu from "$lib/components/FoodMenu.svelte"
  import Progress from "$lib/components/Progress.svelte"
  import DivergingBar from "$lib/components/DivergingBar.svelte"
</script>

<main>
  <div class="panel panel-controls">
    <header class="flex justify-between">
      <img width="100" src="/brand/logo.png" alt="The Plotline Logo" />
      <Button
        onClick={() => {
          $farmGrid.grid = $farmGrid.initialGrid
          $gameState.reset()
          $gameState = $gameState
        }}
      >
        Reset
      </Button>
    </header>
    <p class="label">Change how your land is used by adding food types below.</p>
    <FoodMenu />
  </div>
  <div class="panel panel-farm"><Farm /></div>
  <div class="panel panel-center">
    <div class="label">People served adequate calories</div>
    <Progress
      min={$gameState.population.start}
      max={$gameState.population.end}
      value={$successMetrics.peopleAdequateCalories}
    />
    <hr />
    <h2>Futureville statistics</h2>
    <div class="food-info-card-cell">
      <span class="label">current year</span>
      <span>{$gameState.year.current}</span>
    </div>
    <div class="food-info-card-cell">
      <span class="label">current population</span>
      <span>{$gameState.population.current}</span>
    </div>
    <div style="margin: 1rem 0">
      {#each Object.entries($successMetrics) as [key, value]}
        <div class="food-info-card-cell">
          <span class="label">{key}</span>
          <br />
          <span><Number value={+value} /></span>
        </div>
      {/each}
    </div>
    <hr />
    <h2>Emissions</h2>
    <div class="label">Total</div>
    <Number value={+$farmGrid.emissions.total} /><span class="label">&nbsp;kg CO₂eq</span>
    <DivergingBar datum={695122} value={+$farmGrid.emissions.total} scale={100000} />
    <div class="label">Contribution by food types</div>
    {#each Object.entries($farmGrid.emissions.byFood)
      .sort((a, b) => +b[1] - +a[1])
      .slice(0, 4) as [key, value]}
      <div class="food-info-card-cell">
        <span class="label">{key}</span>
        <Progress
          isPercent
          max={0.25}
          showLabels={false}
          value={+value / $farmGrid.emissions.total}
        />
        <span>
          <!-- <Number value={+value} isPercent /> -->
          <span class="label" />
        </span>
      </div>
    {/each}
  </div>
  <div class="panel panel-right">right panel</div>
</main>

<style lang="sass">
main
  height: 100vh
  height: 100svh
  display: grid
  grid-template-rows: 1fr 2fr
  grid-template-columns: 2fr 1fr 1fr
  grid-template-areas: "controls center right" "farm center right"

.panel
  position: relative
  padding: 1rem

.panel-controls
  grid-area: controls

  header
    margin-bottom: 0.75rem

.panel-farm
  grid-area: farm
  padding-top: 0rem
.panel-center
  grid-area: center
  grid-column: 2
  grid-row: 1 / -1
  background-color: var(--color-primary-2)
.panel-right
  grid-row: 1 / -1
  grid-column: 3
  grid-area: right
  background-color: var(--color-primary-3)

</style>
