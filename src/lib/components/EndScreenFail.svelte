<script lang="ts">
  import { largeNumber, prettyPercent } from "$lib/utils/written"
  import { gameSettings, successMetrics, userState } from "$lib/stores/state"

  import Slide from "$lib/components/Slide.svelte"
  import Button from "$lib/components/Button.svelte"
  import Progress from "$lib/components/Progress.svelte"
  import LineChart from "$lib/components/LineChart.svelte"
  import FoodChangesTable from "$lib/components/FoodChangesTable.svelte"
  import Slides from "./Slides.svelte"
  import Farm from "./Farm.svelte"
  import EndSlideYourFarm from "./EndSlideYourFarm.svelte"

  type FailureMetric = typeof $successMetrics.emissionsChange

  export let reset = () => {}
  export let failedMetric: FailureMetric | undefined
  export let exhaustedTurns: boolean

  let slideIndex = 1
  let slides = ["Summary", "Farm", "Tips"]
  let foodsAdded: Count[] = []
  let foodsRemoved: Count[] = []
</script>

<Slides
  {slides}
  bind:slideIndex
  pagersText={slideIndex === 0
    ? "Or click anywhere to learn more about your game"
    : "Keep clicking for more about your game"}
>
  {#if slideIndex === 0}
    <Slide>
      <div class="slide-0">
        <div class="slide-title-block flex align-center">
          <h2 class="slide-title text-left title text-error-3">
            {#if exhaustedTurns && !failedMetric}
              You ran out of turns!
            {:else if !exhaustedTurns && failedMetric}
              {failedMetric.label}
              {failedMetric.value > failedMetric.limit ? "exceeded" : "fell under"}
              {failedMetric.suffix === "%" && failedMetric.value > 0
                ? "+"
                : ""}{(failedMetric.suffix === "%" ? 100 : 1) *
                failedMetric.limit}{failedMetric.suffix}
            {:else}
              You ran out of turns and failed to close the food gap!
            {/if}
          </h2>
          {#if failedMetric}
            <div class="summary-chart">
              <h6 class="label-caps">{failedMetric.label}</h6>
              <div class="line-chart label flex-center">
                <LineChart
                  labels
                  pulseEndPoint
                  data={failedMetric.history}
                  warn={failedMetric.warn}
                  labelFormat={failedMetric.suffix === "%"
                    ? prettyPercent
                    : (n) => `${n}${failedMetric?.suffix}`}
                  {...failedMetric.chartSettings}
                />
              </div>
            </div>
          {/if}
        </div>
        <section id="summary">
          {#if $successMetrics.calorieProductionChange >= 0}
            <div class="progress-bar label-caps text-error-1 flex-col">
              <Progress
                isError
                isPercent
                max={$gameSettings.gap}
                showLabels={false}
                showValue={false}
                value={$successMetrics.calorieProductionChange}
                backgroundCurrentColor
              />
              <span class="text-error-3">
                Food gap: <span>
                  {prettyPercent($successMetrics.calorieProductionChange)} / {prettyPercent(
                    $gameSettings.gap
                  )}
                </span>
              </span>
            </div>
            <p>You failed to close the food gap but you made great progress.</p>
            <p>
              Without clearing any new land, you <b class="text-tertiary-1">increased</b>
              global calorie supply by {prettyPercent(
                Math.abs($successMetrics.calorieProductionChange)
              )} and global protein supply by {prettyPercent(
                $successMetrics.proteinProductionChange
              )}.
            </p>
            <p>
              Your changes could feed an additional
              {largeNumber($successMetrics.currentPopulationFed - $gameSettings.populationStart)} people!
            </p>
          {:else}
            <p>
              Oops! Your moves <em>decreased</em> global food production. You might want to try again?
            </p>
          {/if}
        </section>

        <div class="cta-buttons">
          <Button
            onClick={() =>
              ($userState.shareText = `Without clearing any new land, I increased global calorie supply by ${prettyPercent(
                Math.abs($successMetrics.calorieProductionChange)
              )} and global protein supply by ${prettyPercent(
                $successMetrics.proteinProductionChange
              )}, feeding an additional
              ${largeNumber(
                $successMetrics.currentPopulationFed - $gameSettings.populationStart
              )} people!`)}>Share this</Button
          >
          <Button color="secondary" onClick={reset}>Try again</Button>
        </div>
      </div>
    </Slide>
  {:else if slideIndex === 1}
    <Slide>
      <EndSlideYourFarm isFailed {foodsAdded} {foodsRemoved} {reset} />
    </Slide>
  {:else if slideIndex === 2}
    <Slide>
      <div class="slide-2">
        <h2 class="slide-title title text-error-3">Your impact</h2>
      </div>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit perspiciatis maxime repellat
        eos dolor quae, perferendis fugit iure possimus quibusdam laudantium expedita nemo culpa aut
        voluptates autem maiores dolorem, beatae veritatis obcaecati tempora. Voluptates, laudantium
        illo nemo consectetur necessitatibus dolorum?
      </p>
      <Button onClick={reset}>Try again</Button>
    </Slide>
  {/if}
</Slides>

<style lang="sass">

.slide-0
  .slide-title-block
    margin-bottom: 0
  .progress-bar
    margin-bottom: 1.5rem
    gap: 0.5rem
  .summary-chart
    width: 16ch
    .line-chart
      margin-top: 1rem
      height: 4rem

:global(#end-screen .cta-buttons)
  display: inline-flex
  gap: 1rem
  margin-top: 0.5rem
:global(#end-screen .is-failed .pager)
  background: var(--color-error-2)
:global(#end-screen .is-failed .pager.active)
  background: var(--color-error-3)

</style>
