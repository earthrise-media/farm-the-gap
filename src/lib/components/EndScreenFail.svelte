<script lang="ts">
  import { base } from "$app/paths"
  import { fade, fly } from "svelte/transition"
  import { backOut as easing, linear } from "svelte/easing"

  import { foodItems } from "$lib/data/foods"
  import { largeNumber, prettyPercent, prettyList } from "$lib/utils/written"
  import { gameSettings, successMetrics, sparklineData, gameState, farm } from "$lib/stores/state"

  import Slide from "$lib/components/Slide.svelte"
  import Button from "$lib/components/Button.svelte"
  import Progress from "$lib/components/Progress.svelte"
  import LineChart from "$lib/components/LineChart.svelte"
  import FoodChangesTable from "$lib/components/FoodChangesTable.svelte"
  import Slides from "./Slides.svelte"
  import Farm from "./Farm.svelte"

  type FailureMetric = typeof $successMetrics.emissionsChange

  export let reset = () => {}
  export let failedMetric: FailureMetric | undefined
  export let exhaustedTurns: boolean

  let slideIndex = 0
  let slides = ["Summary", "Farm", "Tips"]
  let foods: Food[] = JSON.parse(JSON.stringify(foodItems))

  if (failedMetric) {
    let key = failedMetric.foodMetricKey
    foods.sort((a, b) => b[key] / b.calorieRatio - a[key] / a.calorieRatio)
  }
</script>

<Slides {slides} bind:slideIndex pagersText="Click anywhere to learn more about your game">
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
            <p>You failed to close the food gap.<br />But you made great progress.</p>
            <p>
              Over {$gameState.year.current - $gameState.year.start} years you increased global food
              production by {prettyPercent(Math.abs($successMetrics.calorieProductionChange))},
              feeding an additional
              {largeNumber($successMetrics.currentPopulationFed - $gameSettings.populationStart)} people
              without clearing any more land for farming. That's something to be proud of!
            </p>
          {:else}
            <p>
              Oops! Your moves <em>decreased</em> global food production. You might want to try again?
            </p>
          {/if}
        </section>

        <div class="cta-buttons">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </Slide>
  {:else if slideIndex === 1}
    <Slide>
      <div class="slide-1">
        <h2 class="slide-title title text-error-3">Your farm</h2>
        <div class="farm-container">
          <Farm levitate />
        </div>
      </div>
      <FoodChangesTable />
      <Button onClick={reset}>Try again</Button>
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

<!-- <section>
      <div class="col">
        <div class="step-counter">1</div>
        <p>
          {#if exhaustedTurns}
            You ran out of turns before you could close the food gap.
          {/if}
          Remember your objective is to maximise calorie production, {#if exhaustedTurns}
            so trade the least efficient foods out for the most efficient ones.
          {:else}but you must maintain protein levels and keep environmental impacts in check.{/if}
        </p>
      </div>
      <div class="col">
        <div class="step-counter">2</div>
        <div class="label">
          {#if exhaustedTurns}
            <div>Use the data table to sort foods by calorie efficiency.</div>
          {:else if failedMetric}
            <div>
              Use the data table to sort foods by <b>{failedMetric.label}</b> and other metrics.
            </div>
          {/if}
          <span>&darr;</span>
        </div>
        <img class="food-table-preview" src="{base}/img/table.png" alt="Food stats table preview" />
      </div>
      {#if failedMetric}
        <div class="col">
          <div class="step-counter">3</div>
          <div class="label">
            <div>Check out these foods</div>
            <span>&darr;</span>
          </div>
          <div class="recommendation-efficiency-group">
            <p>
              These foods have the highest
              <b>{failedMetric.label} per calorie:</b>
            </p>
            <div class="flex food-item-pill-group">
              {@html foods
                .slice(0, 3)
                .map(
                  (f) =>
                    `<span class="food-item-pill"><span class="food-item-avatar bg-${f.colorId}"></span>${f.name}</span>`
                )
                .join(" ")}
            </div>
          </div>
          <div class="recommendation-efficiency-group">
            <p>These foods have the lowest:</p>
            <div class="flex food-item-pill-group">
              {@html foods
                .slice(-3)
                .map(
                  (f) =>
                    `<span class="food-item-pill"><span class="food-item-avatar bg-${f.colorId}"></span>${f.name}</span>`
                )
                .reverse()
                .join(" ")}
            </div>
          </div>
        </div>
      {/if}
      <div class="col">
        <div class="step-counter">{failedMetric ? 4 : 3}</div>
        <div class="label">
          <div>Try to close the food gap one&nbsp;more&nbsp;time!</div>
          <span>&darr;</span>
        </div>
        <div class="button-retry-wrap">
          <Button color="secondary" onClick={reset}>Try again &rarr;</Button>
        </div>
      </div>
    </section> -->

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

.slide-1
  width: 100%
  .farm-container
    width: 67%
    margin: 0 auto
    margin-top: -7.5%
    margin-bottom: -15%

:global(#end-screen .pager)
  background: var(--color-error-2)
:global(#end-screen .pager.active)
  background: var(--color-error-3)

</style>
