<script lang="ts">
  import { fly, fade } from "svelte/transition"
  import { backOut as easing, linear } from "svelte/easing"

  import {
    userState,
    gameState,
    gameSettings,
    successMetrics,
    sparklineData,
    farm,
    gameHistory
  } from "$lib/stores/state"

  import Button from "$lib/components/Button.svelte"
  import ButtonUndo from "$lib/components/ButtonUndo.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import Progress from "$lib/components/Progress.svelte"
  import LineChart from "$lib/components/LineChart.svelte"
  import EndScreenFail from "$lib/components/EndScreenFail.svelte"
  import EndScreenSuccess from "$lib/components/EndScreenSuccess.svelte"
  import FoodChangesTable from "$lib/components/FoodChangesTable.svelte"
  import { largeNumber, prettyPercent } from "$lib/utils/written"
  import { base } from "$app/paths"
  import ModalUndo from "./ModalUndo.svelte"

  let slideIndex = 0

  let exhaustedTurns: boolean = false
  let farmMetricKey: FarmMetricKey
  let foodMetricKey: keyof Food
  let failedMetric: FailureMetric | undefined = $sparklineData?.find((o) => o.fail)

  const flyIn = { y: 8, easing, delay: 600, duration: 1200 }

  const reset = () => {
    $farm.reset()
    $gameState.reset()
    $farm = $farm
    $gameHistory = []
    $gameState = $gameState
    $gameHistory = $gameHistory
  }

  $: $userState.isGameComplete = $successMetrics.hasSucceeded || $successMetrics.hasFailed
  $: exhaustedTurns = $gameState.year.current >= $gameState.year.end
  $: {
    failedMetric = $sparklineData?.find((o) => o.fail)
    if (failedMetric) {
      farmMetricKey = failedMetric.farmMetricKey
      foodMetricKey = failedMetric.foodMetricKey
    }
  }
</script>

{#if $userState.isGameComplete}
  {#if $successMetrics.hasFailed && failedMetric && $gameState.undosRemaining > 0}
    <ModalUndo {failedMetric} />
  {:else}
    <Modal id="end-screen" isError={!$successMetrics.hasSucceeded} fullscreen fullWidth>
      <div class="end-wrapper slide-{slideIndex}">
        <div class="slide-wrap">
          <div class="slide" out:fade in:fly={flyIn}>
            <h2 class="slide-title">
              {#if $successMetrics.hasSucceeded}
                <span class="text-tertiary-1">You Won! 🎊</span>
              {:else if $successMetrics.hasFailed && exhaustedTurns && !failedMetric}
                <span class="text-error-2"> You ran out of turns! </span>
              {:else if $successMetrics.hasFailed && failedMetric}
                <span class="text-error-2">
                  <b>{failedMetric.label}</b>
                  {failedMetric.value > failedMetric.limit ? "exceeded" : "fell under"}
                  {failedMetric.suffix === "%" && failedMetric.value > 0
                    ? "+"
                    : ""}{(failedMetric.suffix === "%" ? 100 : 1) *
                    failedMetric.limit}{failedMetric.suffix}!
                </span>
              {:else}
                <p>An error has occurred.</p>
              {/if}
            </h2>
            <section id="summary">
              <p>
                {#if $successMetrics.hasSucceeded}
                  Amazing job! You closed the food gap and ensured a sustainable food future!
                {:else}
                  Bad luck! It's a challenging job to close the food gap, but you made great
                  progress.
                {/if}
                Over {$gameState.year.current - $gameState.year.start} years you {$successMetrics.calorieProductionChange >
                0
                  ? "increased"
                  : "decreased"} global food production by {prettyPercent(
                  Math.abs($successMetrics.calorieProductionChange)
                )}{$successMetrics.calorieProductionChange > 0 ? "," : "."}
                {#if $successMetrics.calorieProductionChange > 0}
                  and fed an additional
                  {largeNumber(
                    $successMetrics.currentPopulationFed - $gameSettings.populationStart
                  )} people without clearing any more land for farming. That's something to be proud
                  of!
                {:else}
                  Let's break that down.
                {/if}
              </p>
            </section>
            <div class="progress-bar label-caps">
              <span
                >Food gap: <span class="text-tertiary-1">
                  {prettyPercent($successMetrics.calorieProductionChange)} / {prettyPercent(
                    $gameSettings.gap
                  )}</span
                ></span
              >
              <Progress
                isPercent
                max={$gameSettings.gap}
                showLabels={false}
                showValue={false}
                value={$successMetrics.calorieProductionChange}
              />
            </div>
            <div class="label-caps">Key game metrics</div>
            <div class="summary-charts">
              {#each $sparklineData as { fail, history, label, suffix, objective, warn, chartSettings }}
                <div class="summary-chart" class:warn>
                  <div class="line-chart label flex-center">
                    <LineChart
                      labels
                      data={history}
                      {warn}
                      labelFormat={suffix === "%" ? prettyPercent : (n) => `${n}${suffix}`}
                      {...chartSettings}
                    />
                  </div>
                  <div class="label chart-emoji text-center">{fail ? "❌" : "✅"}</div>
                  <div class="label chart-title">{label}</div>
                  <div class="label objective {fail ? 'text-error-2' : 'text-tertiary-1'}">
                    {objective}
                  </div>
                </div>
              {/each}
            </div>
            {#if $successMetrics.hasFailed}
              <EndScreenFail {exhaustedTurns} {failedMetric} {reset} />
            {:else if $successMetrics.hasSucceeded}
              <EndScreenSuccess {reset} />
            {:else if $gameState.year.current >= $gameState.year.end}
              <!-- Run out of turns -->
              <p>You run out of turns!</p>
            {:else}
              <p>An error has occurredd.</p>
            {/if}
          </div>
        </div>
      </div>
    </Modal>
  {/if}
{/if}

<style lang="sass">
.end-wrapper
  display: flex
  height: 100%

.slide-wrap
  position: relative
  flex-grow: 1

.slide
  position: absolute
  display: flex
  flex-direction: column
  align-items: center
  text-align: center
  top: 0
  left: 0
  right: 0
  bottom: 0
  font-size: 0.875rem
  font-size: 1.125rem
  line-height: 1.3
  padding: 4rem
  

.slide-title
  font-size: 2rem

.buttons
  gap: 0.75rem

#summary
  max-width: 700px

.summary-charts
  display: flex
  position: relative
  gap: 4rem
  padding: 1rem 0 2rem

  .line-chart
    width: 5rem
    height: 3rem

.summary-chart
  .chart-emoji
    margin-top: 0.5rem

.progress-bar
  width: 50%
  margin-bottom: 1rem
  display: flex
  flex-direction: column
  gap: 0.375rem
</style>
