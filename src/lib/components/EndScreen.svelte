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

  import Modal from "$lib/components/Modal.svelte"
  import LineChart from "$lib/components/LineChart.svelte"
  import EndScreenFail from "$lib/components/EndScreenFail.svelte"
  import EndScreenSuccess from "$lib/components/EndScreenSuccess.svelte"
  import FoodChangesTable from "$lib/components/FoodChangesTable.svelte"
  import { largeNumber, prettyPercent } from "$lib/utils/written"

  let slideIndex = 0

  let exhaustedTurns = false
  let farmMetricKey: FarmMetricKey
  let foodMetricKey: keyof Food
  let failedMetric: FailureMetric | undefined = $sparklineData?.find((o) => o.fail)

  if (!failedMetric) {
    exhaustedTurns = true
  } else {
    farmMetricKey = failedMetric.farmMetricKey
    foodMetricKey = failedMetric.foodMetricKey
  }

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
</script>

{#if $userState.isGameComplete}
  <Modal id="end-screen" isError={!$successMetrics.hasSucceeded} fullscreen fullWidth>
    <div class="end-wrapper slide-{slideIndex}">
      <div class="slide-wrap">
        <div class="slide" out:fade in:fly={flyIn}>
          <h2 class="slide-title">
            {#if $successMetrics.hasSucceeded}
              You Won 🎊
            {:else if $successMetrics.hasFailed && exhaustedTurns && !failedMetric}
              You ran out of turns! 😮‍💨
            {:else if $successMetrics.hasFailed && failedMetric}
              <b>{failedMetric.label}</b>
              {failedMetric.value > failedMetric.limit ? "exceeded" : "fell under"}
              {failedMetric.suffix === "%" && failedMetric.value > 0
                ? "+"
                : ""}{(failedMetric.suffix === "%" ? 100 : 1) *
                failedMetric.limit}{failedMetric.suffix}! 😮‍💨
            {:else}
              <p>An error has occurred.</p>
            {/if}
          </h2>
          <section id="summary">
            <p>
              {#if $successMetrics.hasSucceeded}
                Amazing job! You closed the food gap and ensured a sustainble food future!
              {:else}
                Bad luck, it's a challenging job to close the food gap. But you made great progress
                –
              {/if}
              Over {$gameState.year.current - $gameState.year.start} years you {$successMetrics.calorieProductionChange >
              0
                ? "increased"
                : "decreased"} global food production by {prettyPercent(
                Math.abs($successMetrics.calorieProductionChange)
              )}{$successMetrics.calorieProductionChange > 0 ? "," : "."}
              {#if $successMetrics.calorieProductionChange > 0}
                and fed an additional
                {largeNumber($gameState.population.current - $gameState.population.start)} people without
                clearing any more land for farming. That's something to be proud of!
              {:else}
                Let's break that down.
              {/if}
            </p>
          </section>
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
            <p>An error has occurred.</p>
          {/if}
        </div>
      </div>
    </div>
  </Modal>
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


.summary-charts
  display: flex
  position: relative
  gap: 4rem
  padding: 2rem 0

  .line-chart
    width: 5rem
    height: 3rem

.summary-chart
  .chart-emoji
    margin-top: 0.5rem
</style>
