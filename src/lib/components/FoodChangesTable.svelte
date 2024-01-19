<script lang="ts">
  import { farm } from "$lib/stores/state"
  import Number from "./Number.svelte"

  export let foodsAdded: Count[] = []
  export let foodsRemoved: Count[] = []

  const ascending = (a: Count, b: Count) => a.delta - b.delta
  const descending = (a: Count, b: Count) => b.delta - a.delta

  // TODO: Add pagination
  // export let pagination: boolean = false
  // let maxItemsPerPage = 4

  $: foodsAdded = $farm.foodChanges.filter((o) => o.delta > 0).sort(descending)
  $: foodsRemoved = $farm.foodChanges.filter((o) => o.delta < 0).sort(ascending)
  $: data = [
    {
      label: "Foods removed",
      icon: "↘",
      list: foodsRemoved
    },
    {
      label: "Foods added",
      icon: "↗",
      list: foodsAdded
    }
  ]
</script>

<div class="food-changes-table">
  {#each data as { label, icon, list }}
    <div class="group">
      <div class="th label bold">
        <span>{label}</span>
        <span>{icon}</span>
      </div>
      {#each list as { delta, food }}
        <div class="item label">
          <div class="flex align-center">
            <div class="td food-item-avatar bg-{food.colorId}" />
            <div class="td label">
              {food.name}
            </div>
          </div>
          <div class="td">
            <Number value={delta} duration={0} showSign={delta !== 0} />
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>

<style lang="sass">
  .food-changes-table
    display: flex
    justify-content: space-between
    gap: 1rem
    width: 100%

  .group
    min-width: 140px
    display: flex
    flex-direction: column

  .item
    display: flex
    justify-content: space-between

  .td, .th
    padding: 0.125rem
    
  .th
    display: flex
    justify-content: space-between
    border-bottom: 1px solid var(--color-secondary-3)

</style>
