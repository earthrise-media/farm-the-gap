<script lang="ts">
  import { farm } from "$lib/stores/state"
  import Number from "./Number.svelte"

  const ascending = (a, b) => a.delta - b.delta
  const descending = (a, b) => b.delta - a.delta

  $: data = [
    {
      label: "Increased ↗",
      list: $farm.foodChanges.filter((o) => o.delta > 0).sort(descending)
    },
    {
      label: "Reduced ↘",
      list: $farm.foodChanges.filter((o) => o.delta < 0).sort(ascending)
    }
  ]
</script>

<div class="food-changes-table">
  {#each data as { label, list }}
    <div class="group">
      <div class="th label bold">{label}</div>
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
    gap: 1rem

  .group
    min-width: 100px
    display: flex
    flex-direction: column

  .item
    display: flex
    justify-content: space-between

  .td, .th
    padding: 0.125rem
    
  .th
    padding-right: 0.75rem
    border-bottom: 1px solid var(--color-secondary-3)

</style>
