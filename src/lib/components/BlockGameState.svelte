<script lang="ts">
  import { gameState, successMetrics } from "$lib/stores/state"
  import Icon from "$lib/components/Icon.svelte"
  import Number from "$lib/components/Number.svelte"
  import DivergingBar from "$lib/components/DivergingBar.svelte"

  $: data = [
    $successMetrics.proteinPerPersonPerDay,
    $successMetrics.emissionsChange,
    $successMetrics.waterUseChange,
    $successMetrics.eutrophyChange
  ]
</script>

<div class="block-game-state lock">
  <div class="group">
    <div class="label-caps">Game metrics</div>
    <div class="items">
      {#each data as { value, label, suffix, objective, warn }}
        <div class="item" class:warn>
          <div class="big-number flex-col">
            <div class="label">
              {label}
            </div>
            <div class="flex align-center">
              {#if suffix === "%"}
                <span class="label sign">{value >= 0 ? "+" : "-"}</span>
                <span>{(100 * Math.abs(value)).toFixed(0)}</span>
                <span class="label suffix text-secondary-2">{suffix}</span>
              {:else}
                <span>{value}</span>
                <span class="label suffix text-secondary-2">{suffix}</span>
              {/if}
            </div>
            <div class="label objective text-secondary-3">{objective}</div>
          </div>
          <div class="line-chart label flex-center">
            {#if warn}
              <span class="big-number bold">!</span>
            {:else}
              Line chart here
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="sass">
.block-game-state
  gap: 0
  
.block-title
  grid-column: 1 / -1

.group
  display: flex
  flex-direction: column
  gap: 0.5rem
  margin-top: 1rem

  &:first-child
    margin-top: 0
  &:last-child
    border-bottom: none

.items
  display: flex
  flex-direction: column
  justify-content: space-around
  gap: 0.75rem

.item
  display: flex
  padding: 0.5rem 0.5rem
  margin: 0 -0.5rem
  transition: all 0.3s
  color: var(--color-secondary-1)
  background: var(--color-primary-2)
  border-radius: 0.25rem
  cursor: pointer
  border: 1px solid transparent

  &.warn
    .label
      &.objective
        color: var(--color-secondary-1)
        background: var(--color-error-1)

    .line-chart
        background: var(--color-error-1)

.item,
.big-number
  gap: 0.375rem 1rem

.label
  transition: color 0.3s, background 0.3s
  &.sign
    font-size: 1.25rem
  &.suffix
    font-size: 0.75rem
    line-height: 1.3
    margin-left: 0.125rem
    align-self: flex-end
  &.objective
    margin-left: -0.125rem
    padding: 0.125rem
    border-radius: 0.125rem
    white-space: nowrap

.line-chart
  transition: background 0.3s
  border-bottom: 1px solid
  flex-grow: 1

@media (hover: hover)
  .item:hover
    background: var(--color-primary-3)

</style>
