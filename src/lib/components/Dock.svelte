<script lang="ts">
  import { gameHistory, gameSettings, gameState, successMetrics } from "$lib/stores/state"
  import Progress from "$lib/components/Progress.svelte"
  import Number from "$lib/components/Number.svelte"
  import { prettyPercent } from "$lib/utils/written"
  import { fly } from "svelte/transition"
  import { backOut } from "svelte/easing"

  let nMoves = 0
  let calorieChange = 0
  let showFlyNumber = true
  let flyNumberTimeout: number

  $: {
    nMoves = $gameHistory.length - 1

    if (nMoves > 0) {
      showFlyNumber = true

      calorieChange =
        $gameHistory[nMoves].calorieProductionChange -
        $gameHistory[nMoves - 1].calorieProductionChange

      clearTimeout(flyNumberTimeout)
      flyNumberTimeout = setTimeout(() => (showFlyNumber = false), 2500)
    }
  }
</script>

<div id="dock">
  <div class="dock-item flex-col">
    <strong class="big-number">
      <Number
        showSign
        isPercent
        value={Math.floor(100 * $successMetrics.calorieProductionChange) / 100}
      />
    </strong>
    <div class="label">Calorie production</div>
    <div class="label text-secondary-3">Target: +{prettyPercent($gameSettings.gap)}</div>
  </div>
  <div class="dock-item flex-col flex-grow progress-calorie">
    {#if $gameHistory.length > 1 && showFlyNumber}
      <div
        transition:fly={{ y: 16, easing: backOut }}
        class="progress-change-fly bold label"
        class:text-tertiary-1={calorieChange >= 0}
        class:text-error-2={calorieChange < 0}
      >
        <Number showSign isPercent precision={1} value={calorieChange} />
      </div>
    {/if}
    <Progress
      isPercent
      max={$gameSettings.gap}
      showLabels={false}
      showValue={false}
      value={$successMetrics.calorieProductionChange}
    />
    <span class="label">Food gap progress</span>
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
