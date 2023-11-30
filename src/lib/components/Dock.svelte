<script lang="ts">
  import { gameState, successMetrics } from "$lib/stores/state"
  import Progress from "$lib/components/Progress.svelte"
  import Number from "$lib/components/Number.svelte"

  $: data = [
    {
      label: "Population",
      value: $gameState.population.current
    },
    {
      label: "Moves left",
      value: $gameState.year.end - $gameState.year.current
    }
  ]
</script>

<div id="dock">
  <div class="dock-item flex-col">
    <strong class="big-number">
      <Number showSign isPercent value={$successMetrics.calorieProductionChange} />
    </strong>
    <div class="label">Calorie production</div>
    <div class="label text-secondary-3">Target: 70%</div>
  </div>
  <div class="dock-item flex-col flex-grow progress-calorie">
    <Progress
      isPercent
      max={0.7}
      showLabels={false}
      showValue={false}
      value={$successMetrics.calorieProductionChange}
    />
    <span class="label">Food gap closed</span>
  </div>
  <div class="dock-item flex-col">
    <strong class="big-number">{$gameState.year.end - $gameState.year.current}</strong>
    <span class="label">Moves remaining</span>
    <div class="label text-secondary-3">One move per year</div>
  </div>
</div>

<style lang="sass">
#dock
  position: absolute
  left: 0
  bottom: 0
  display: flex
  justify-content: space-between
  align-items: flex-end
  gap: 1rem
  width: 100%
  padding: 1em
  z-index: 1

.dock-item
  gap: 0.125em
  text-align: center
  &:first-child
    text-align: left
    width: 15ch
  &:last-child
    text-align: right
    width: 15ch

.progress-calorie
  font-size: 0.625rem
  gap: 0.375rem
</style>
