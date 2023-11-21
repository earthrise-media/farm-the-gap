<script lang="ts">
  import { gameState, successMetrics } from "$lib/stores/state"
  import Number from "$lib/components/Number.svelte"
  import Progress from "$lib/components/Progress.svelte"
  import DivergingBar from "$lib/components/DivergingBar.svelte"

  const proteinInitial = $successMetrics.proteinPerPersonPerDay
</script>

<div class="block-game-state block">
  <div class="flex justify-between">
    <div class="flex-col">
      <strong>{$gameState.year.current}</strong>
      <span class="label">year</span>
    </div>
    <div class="flex-col text-right">
      <strong>{$gameState.population.current}</strong>
      <span class="label">population</span>
    </div>
  </div>

  <div class="progress-calorie">
    <div class="label">People fed adequate calories</div>
    <Progress
      min={$gameState.population.start}
      max={$gameState.population.end}
      value={$successMetrics.peopleAdequateCalories}
    />
  </div>

  <hr />

  <div class="flex align-center">
    <div class="label">
      Protein (g)
      <div class="text-secondary-3">per person per day</div>
    </div>
    <DivergingBar
      showValue
      isPercent={false}
      showSign={false}
      datum={proteinInitial}
      value={$successMetrics.proteinPerPersonPerDay}
      scale={50}
    />
  </div>
</div>

<style lang="sass">
.block-game-state
  border: 1px solid var(--color-tertiary-1)
  background: var(--color-primary-1)

hr
  width: 100%
  margin: 0.125em auto
  border-color: var(--color-tertiary-1)

.label
  text-align: center

.progress-calorie
  .label
    margin-bottom: -0.25em
</style>
