<script lang="ts">
  import { userState } from "$lib/stores/state"
  import { prettyList, prettyPercent } from "$lib/utils/written"

  import Button from "$lib/components/Button.svelte"
  import Farm from "$lib/components/Farm.svelte"
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

<div class="slide-{slideNumber}">
  <h2 class="slide-title title" class:text-error-3={isFailed}>Your farm</h2>
  <p>
    By reducing global production of {@html describe(foodsRemoved)}, you freed up enough land to
    increase global production of {@html describe(foodsAdded)}{#if foodsAdded.length > 3}, plus more{/if}.
  </p>
  <div class="farm-container">
    <Farm levitate highlightChanges />
  </div>
</div>
<FoodChangesTable bind:foodsAdded bind:foodsRemoved />
<div class="cta-buttons">
  <Button
    onClick={() =>
      ($userState.shareText = `Reducing global production of ${describe(
        foodsRemoved,
        ""
      )} could free up enough land to increase global production of ${describe(
        foodsAdded,
        ""
      )}. I learned it here: `)}>Share this</Button
  >
  <Button color="secondary" onClick={reset}>{isFailed ? "Try again" : "Next"}</Button>
</div>

<style lang="sass">
.slide-1
  width: 100%

.farm-container
  width: 67%
  margin: 0 auto
  margin-top: -7.5%
  margin-bottom: -15%
</style>
