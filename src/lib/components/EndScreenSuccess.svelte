<script lang="ts">
  import {
    farm,
    userState,
    gameState,
    gameHistory,
    gameSettings,
    successMetrics
  } from "$lib/stores/state"
  import { prettyPercent, largeNumber } from "$lib/utils/written"

  import Button from "$lib/components/Button.svelte"
  import Slides from "$lib/components/Slides.svelte"
  import Slide from "$lib/components/Slide.svelte"
  import EndSlideYourFarm from "$lib/components/EndSlideYourFarm.svelte"
  import LineChart from "./LineChart.svelte"
  import FoodIcon from "./FoodIcon.svelte"
  import ArticleMenu from "./ArticleMenu.svelte"
  import Icon from "./Icon.svelte"

  export let reset = () => {}
  export let isMobile = false

  let slideIndex = 0
  let slides = ["Summary", "Farm", "Learn more"]
  let foodsAdded: Count[] = []
  let foodsRemoved: Count[] = []
</script>

<Slides
  {slides}
  bind:slideIndex
  close={() => (slideIndex = 0)}
  pagersText={slideIndex === 0
    ? "Click anywhere to learn more about your game"
    : "Keep clicking for more about your game"}
>
  {#if slideIndex === 0}
    <Slide hasPagers>
      <div class="slide-0">
        <div class="slide-title-block flex-col align-center">
          <h2 class="title text-tertiary-1">You won!</h2>
          <div class="summary-chart">
            <h6 class="label-caps text-secondary-3">Food production (calories)</h6>
            <div class="line-chart label flex-center">
              <LineChart
                labels
                xLabels={[$gameState.year.start, $gameState.year.end]}
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
        <div class="food-icons flex-center title">
          {#each $farm.foodChanges.filter((o) => o.delta > 0) as { food }}
            <div class="food-icon">
              <FoodIcon {food} />
            </div>
          {/each}
        </div>
        <div class="cta-buttons">
          <Button
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
        </div>
      </div>
    </Slide>
  {:else if slideIndex === 1}
    <Slide hasPagers>
      <EndSlideYourFarm {foodsAdded} {foodsRemoved} reset={() => slideIndex++} />
    </Slide>
  {:else if slideIndex === 2}
    <Slide hasPagers>
      <div class="slide-2 flex-col align-center">
        <h2 class="slide-title title">Learn more</h2>
        <p>
          This platform also features six micro-articles on food systems and the environment. Try
          one below!
        </p>
        <ArticleMenu wide tight maxItems={isMobile ? 3 : undefined} />
        <hr class="spacer" />
        <Button classList="flex-center" onClick={reset}>Play again&nbsp;<Icon type="undo" /></Button
        >
      </div>
    </Slide>
  {/if}
</Slides>

<style lang="sass">
@import "src/styles/vars/screens"

.slide-0
  .slide-title-block
    margin-bottom: 1.5rem
  .progress-bar
    margin-bottom: 1.5rem
    gap: 0.5rem
  .line-chart
    margin-top: 1.25rem
    height: 4.5rem

.food-icons
  gap: 0.75rem
  font-size: 2.5rem

.food-icon
  animation: dance 0.75s infinite alternate ease-in-out

.slide-2
  position: relative
  width: 100%

  hr.spacer
    margin: 1rem auto 0

</style>
