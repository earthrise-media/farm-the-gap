<script lang="ts">
  import { fade, scale } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"

  import { farm, userState, gameState } from "$lib/stores/state"

  const isSwappable = (food: Food) => food.id !== $userState.itemSelectedForSwap?.id
  const swapFoodItem = (x: number, y: number) => {
    $farm.grid[y][x] = JSON.parse(JSON.stringify($userState.itemSelectedForSwap))
    $gameState.update()
    $gameState = $gameState
  }
</script>

<div id="farm-wrapper">
  <div id="land-grid">
    {#each $farm.grid as row, y}
      {#each row as food, x}
        {#key food.id}
          <button
            in:scale={{ duration: 300, easing, start: 0.6, opacity: 0.5 }}
            class="land-cell"
            class:unswappable={$userState.itemSelectedForSwap && !isSwappable(food)}
            class:swappable={$userState.itemSelectedForSwap && isSwappable(food)}
            on:click|stopPropagation={() => $userState.itemSelectedForSwap && swapFoodItem(x, y)}
          >
            <div class="food-item-avatar bg-{food.colorId}" />
            <div class="land-cell-label">{food.name ?? ""}</div>
          </button>
        {/key}
      {/each}
    {/each}
  </div>
</div>

<style lang="sass">
#farm-wrapper
  width: 100%
  height: 100%
  overflow: hidden
  padding: 0.25rem
  border-radius: var(--border-radius)
  background: var(--color-primary-3)

#land-grid
  width: 100%
  height: 100%
  display: grid
  grid-template-rows: repeat(10, 1fr)
  grid-template-columns: repeat(10, 1fr)
  gap: 1px

.land-cell
  background: var(--color-secondary-3)
  border: none
  position: relative
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
  justify-content: center
  font-size: 14px
  overflow: hidden
  cursor: pointer
  color: var(--color-primary-1)
  transition: background 0.2s
  overflow: hidden

  &:nth-child(1)
    border-radius: 0.75rem 0 0 0
  &:nth-child(10)
    border-radius: 0 0.75rem 0 0
  &:nth-child(91)
    border-radius: 0 0 0 0.75rem
  &:nth-child(100)
    border-radius: 0 0 0.75rem 0
  
  &.swappable
    background: var(--color-secondary-2)

.land-cell-label
  position: absolute
  bottom: 0
  right: 0
  width: 100%
  text-align: center
  font-size: 0.4375rem
  white-space: nowrap
  text-overflow: ellipsis
  overflow: hidden
  margin: 0.25em 0

@media (hover: hover)
  .land-cell:not(.unswappable):hover
    background: var(--color-secondary-1)

</style>
