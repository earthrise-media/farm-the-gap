<script lang="ts">
  import { largeNumber, prettyPercent } from "$lib/utils/written"
  import {
    gameHistory,
    gameSettings,
    gameState,
    successMetrics,
    userState
  } from "$lib/stores/state"

  import Icon from "$lib/components/Icon.svelte"
  import Slide from "$lib/components/Slide.svelte"
  import Slides from "$lib/components/Slides.svelte"
  import Button from "$lib/components/Button.svelte"
  import Progress from "$lib/components/Progress.svelte"
  import LineChart from "$lib/components/LineChart.svelte"
  import ArticleMenu from "$lib/components/ArticleMenu.svelte"
  import EndSlideYourFarm from "$lib/components/EndSlideYourFarm.svelte"

  type FailureMetric = typeof $successMetrics.emissionsChange

  export let reset = () => {}
  export let isMobile = false
  export let failedMetric: FailureMetric | undefined
  export let exhaustedTurns: boolean

  let slideIndex = 0
  let slides = ["Summary", "Farm", "Tips"]
  let foodsAdded: Count[] = []
  let foodsRemoved: Count[] = []
</script>

<Slides
  close={() => (slideIndex = 0)}
  {slides}
  bind:slideIndex
  pagersText={slideIndex === 0
    ? "Click anywhere to learn more about your game"
    : slideIndex === slides.length - 1
      ? ""
      : "Keep clicking for more about your game"}
>
  {#if slideIndex === 0}
    <Slide hasPagers>
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
          {:else if exhaustedTurns}
            <div class="summary-chart exhausted-turns">
              <h6 class="label-caps">Food production (calories)</h6>
              <div class="line-chart label flex-center">
                <LineChart
                  labels
                  warn
                  yDatum={0}
                  yMin={-0.1}
                  pulseEndPoint
                  labelFormat={prettyPercent}
                  length={$gameState.year.end - $gameState.year.start}
                  data={$gameHistory.map((o) => o.calorieProductionChange)}
                  yLimit={$gameSettings.gap}
                  yMax={$gameSettings.gap}
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
              Without clearing any new land, you <b class="bg-primary-1 text-secondary-1"
                >&thinsp;increased&thinsp;</b
              >
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
              Oops! Your moves <em>decreased</em> global food production. You should try again!
            </p>
          {/if}
        </section>

        <div class="cta-buttons">
          <Button
            color="error-invert"
            classList="flex-center"
            onClick={() =>
              ($userState.shareText = `Without clearing any new land, I increased global calorie supply by ${prettyPercent(
                Math.abs($successMetrics.calorieProductionChange)
              )} and global protein supply by ${prettyPercent(
                $successMetrics.proteinProductionChange
              )}, feeding an additional
              ${largeNumber(
                $successMetrics.currentPopulationFed - $gameSettings.populationStart
              )} people!`)}>Share&nbsp;<Icon type="share" /></Button
          >
          <Button classList="flex-center" color="error-invert" onClick={reset}>
            Play again&nbsp;<Icon type="undo" />
          </Button>
        </div>
      </div>
    </Slide>
  {:else if slideIndex === 1}
    <Slide hasPagers>
      <EndSlideYourFarm isFailed {foodsAdded} {foodsRemoved} {reset} />
    </Slide>
  {:else if slideIndex === 2}
    <Slide hasPagers>
      <div class="slide-2 flex-col align-center">
        <h2 class="slide-title title text-error-3">Learn more</h2>
        <p>
          This platform also features six micro-articles on food systems and the environment. Try
          one below!
        </p>
        <ArticleMenu tight color="error" maxItems={isMobile ? 3 : undefined} />
        <hr class="spacer" />
        <Button color="error" classList="flex-center" onClick={reset}
          >Play again&nbsp;<Icon type="undo" /></Button
        >
      </div>
    </Slide>
  {/if}
</Slides>

<style lang="sass">
@import "src/styles/vars/screens"

.slide-0
  .slide-title-block
    min-height: 5rem
    align-items: flex-end
    justify-content: center
  .slide-title
    margin: 0
    text-wrap: balance
  .summary-chart
    width: 16ch
    margin-left: auto
    margin-top: -0.25rem
    &.exhausted-turns
      margin-left: 3rem
  .line-chart
    margin-top: 0.75rem
    height: 4rem
  .progress-bar
    margin: 1.5rem auto
    gap: 0.5rem
  #summary
    margin-top: 1.5rem

.slide-2
  hr.spacer
    margin: 1rem auto 0

:global(#end-screen .cta-buttons)
  display: inline-flex
  gap: 0.5rem
  margin-top: 0.5rem
:global(#end-screen .is-failed .pager)
  background: var(--color-error-2)
:global(#end-screen .is-failed .pager.active)
  background: var(--color-error-3)

@media (max-width: $screen-sm)
  .slide-0
    .slide-title
      font-size: 2.25rem

</style>
