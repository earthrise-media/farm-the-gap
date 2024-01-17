<script lang="ts">
  import { gameSettings, gameState, successMetrics } from "$lib/stores/state"
  import { prettyPercent, largeNumber } from "$lib/utils/written"

  import Button from "$lib/components/Button.svelte"
  import Farm from "$lib/components/Farm.svelte"
  import Slide from "$lib/components/Slide.svelte"

  export let reset = () => {}
</script>

<Slide>
  <h2 class="slide-title text-tertiary-1">You Won! 🎊</h2>
  <section id="summary">
    <p>
      Amazing job! You closed the food gap and ensured a sustainable food future! Over {$gameState
        .year.current - $gameState.year.start} years you increased global food production by {prettyPercent(
        Math.abs($successMetrics.calorieProductionChange)
      )}, feeding an additional
      {largeNumber($successMetrics.currentPopulationFed - $gameSettings.populationStart)} people without
      clearing any more land for farming!
    </p>
  </section>
  <div class="farm-container">
    <Farm levitate />
  </div>
  <div class="flex buttons">
    <Button color="primary" target="_blank" link="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
      Share
    </Button>
    <Button color="secondary" onClick={reset}>Play again</Button>
  </div>
</Slide>

<style lang="sass">
.farm-container
  position: relative
  max-width: 400px

.buttons
  gap: 1rem
</style>
