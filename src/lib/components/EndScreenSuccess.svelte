<script lang="ts">
  import {
    gameSettings,
    gameState,
    successMetrics,
    gameHistory,
    userState
  } from "$lib/stores/state"
  import { prettyPercent, largeNumber } from "$lib/utils/written"

  import Button from "$lib/components/Button.svelte"
  import Farm from "$lib/components/Farm.svelte"
  import Slides from "$lib/components/Slides.svelte"
  import Slide from "$lib/components/Slide.svelte"
  import EndSlideYourFarm from "$lib/components/EndSlideYourFarm.svelte"
  import LineChart from "./LineChart.svelte"

  export let reset = () => {}

  let slideIndex = 0
  let slides = ["Summary", "Farm", "Learn more"]
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
        <div class="slide-title-block flex-col align-center">
          <h2 class="title text-tertiary-1">You won!</h2>
          <div class="summary-chart">
            <h6 class="label-caps text-secondary-3">Food production (calories)</h6>
            <div class="line-chart label flex-center">
              <LineChart
                labels
                labelFormat={prettyPercent}
                pulseEndPoint
                length={$gameState.year.end - $gameState.year.start}
                data={$gameHistory.map((o) => o.calorieProductionChange)}
                yDatum={0}
                yLimit={$gameSettings.gap}
                yMax={$gameSettings.gap}
                yMin={-0.1}
              />
            </div>
          </div>
        </div>
        <div>
          <p>
            Without clearing any new land, you <b class="text-tertiary-1">increased</b>
            global calorie supply by {prettyPercent(
              Math.abs($successMetrics.calorieProductionChange)
            )} and global protein supply by {prettyPercent(
              $successMetrics.proteinProductionChange
            )}.
          </p>
        </div>
        <div class="farm-container">[Graphic showing animated food icons here.]</div>
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
          <Button color="secondary" onClick={() => slideIndex++}>Next</Button>
        </div>
      </div>
    </Slide>
  {:else if slideIndex === 1}
    <Slide>
      <EndSlideYourFarm {foodsAdded} {foodsRemoved} reset={() => slideIndex++} />
    </Slide>
  {:else if slideIndex === 2}
    <Slide>
      <h2 class="title">Learn more</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus voluptatem itaque
        voluptatibus ducimus laborum, accusantium odit dicta numquam tempora, possimus architecto
        sed eveniet reprehenderit, consectetur iusto maiores eligendi nihil aperiam.
      </p>
      <Button color="secondary" onClick={reset}>Play again</Button>
    </Slide>
  {/if}
</Slides>

<style lang="sass">

.slide-0
  .slide-title-block
    margin-bottom: 1.5rem
  .progress-bar
    margin-bottom: 1.5rem
    gap: 0.5rem
  .line-chart
    margin-top: 0.75rem
    height: 2.25rem
</style>
