<script lang="ts">
  import { userState } from "$lib/stores/state"
  import { prettyList, prettyPercent } from "$lib/utils/written"

  import Icon from "$lib/components/Icon.svelte"
  import Farm from "$lib/components/Farm.svelte"
  import Button from "$lib/components/Button.svelte"
  import FoodChangesTable from "$lib/components/FoodChangesTable.svelte"

  export let isFailed = false
  export let slideNumber = 1
  export let foodsAdded: Count[] = []
  export let foodsRemoved: Count[] = []
  export let reset = () => {}

  const describeCount = (foodCount: Count) => `${foodCount.food.name} by
      ${prettyPercent(Math.abs(foodCount.delta) / foodCount.initial)}`

  const describe = (foodCounts: Count[], wrap = "b", max = 2) =>
    prettyList(foodCounts.slice(0, max).map(describeCount), max, { wrap })
</script>

<div class="your-farm-slide-wrapper slide-{slideNumber}">
  <h2 class="slide-title title" class:text-error-3={isFailed}>Your farm</h2>
  <p>
    By reducing global production of {@html describe(foodsRemoved)}, you freed up enough land to
    increase global production of {@html describe(foodsAdded)}{#if foodsAdded.length > 3}, plus more{/if}.
  </p>
  <div class="farm-container end-slide-farm-container">
    <Farm levitate highlightChanges />
  </div>
</div>
<FoodChangesTable bind:foodsAdded bind:foodsRemoved />
<div class="cta-buttons">
  <Button
    color={isFailed ? "error-invert" : "primary"}
    classList="flex-center"
    onClick={() =>
      ($userState.shareText = `Reducing global production of ${describe(
        foodsRemoved,
        ""
      )} could free up enough land to increase global production of ${describe(
        foodsAdded,
        ""
      )}. I learned it here: `)}>Share&nbsp;<Icon type="share" /></Button
  >
  {#if isFailed}
    <Button color={"error-invert"} classList="flex-center" onClick={reset}
      >Play again&nbsp;<Icon type="undo" /></Button
    >
  {/if}
</div>

<style lang="sass">
.your-farm-slide-wrapper
  width: 100%

  p
    font-weight: bold

.farm-container
  max-width: 475px
  margin: 0 auto
  margin-top: -6%
  margin-bottom: -16%

.cta-buttons
  padding-top: 1rem

.end-slide-farm-container
  :global(.land-cell)
    font-size: 75%
</style>
