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
            class:tall={x == 4}
            data-tooltip={food.name}
            class:unswappable={$userState.itemSelectedForSwap && !isSwappable(food)}
            class:swappable={$userState.itemSelectedForSwap && isSwappable(food)}
            on:click|stopPropagation={() => $userState.itemSelectedForSwap && swapFoodItem(x, y)}
          >
            <div class="food-item-avatar bg-{food.colorId}" />
          </button>
        {/key}
      {/each}
    {/each}
  </div>
</div>

<style lang="sass">
#farm-wrapper
  width: 100%
  overflow: hidden
  padding: 0.25rem
  border-radius: var(--border-radius)

  *
    transform-origin: center
    transform-style: preserve-3d
    -webkit-transform-origin: center
    -webkit-transform-style: preserve-3d

#land-grid
  margin: auto
  margin-top: 0
  width: 66.67%
  transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg)
  display: grid
  grid-template-rows: repeat(10, 1fr)
  grid-template-columns: repeat(10, 1fr)
  gap: 1px
  position: relative
  z-index: 1
  background: var(--color-primary-0)
  border: 1px solid var(--color-primary-0)

  &::after,
  &::before
    content: ""
    position: absolute
    z-index: -1
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: var(--color-primary-0)

  &::after
    width: calc(1rem)
    height: 141.4213% // ~ sqrt(2)
    transform: rotateZ(-45deg) rotateY(-60deg) translate(calc(-1rem - 0.25px), 0)
    transform-origin: top
    -webkit-transform-origin: top left

  &::before
    transform: translate3d(-1px, -1px, -1.125rem) // translateZ(-1.125rem)
    width: calc(100% + 2px)
    height: calc(100% + 2px)
    border: 4px solid var(--color-primary-0)

.land-cell
  background: var(--color-primary-1)
  border: none
  position: relative
  display: flex
  flex-direction: column
  text-align: center
  align-items: center
  justify-content: center
  font-size: 1rem
  overflow: hidden
  cursor: pointer
  color: var(--color-secondary-3)
  overflow: hidden
  aspect-ratio: 1
  transition: background 0.2s, transform 0.2s ease-out
  
  &.swappable
    background: var(--color-primary-3)

.food-item-avatar
  position: relative
  overflow: hidden
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25)
  transform: rotateZ(-15deg) rotateY(-40deg) rotateX(60deg) scale(1, 1.5) translate(9%, -19%)


  &::after
    content: ""
    position: absolute
    z-index: 1
    top: 0
    left: 0
    width: 100%
    height: 100%
    // background: radial-gradient(circle at 33% 33%, rgba(black, 0), rgba(black, 0.125))

@media (hover: hover)
  .land-cell:not(.unswappable):hover
    background: var(--color-secondary-3)
    transform: translate3d(0, 0, 3px)

</style>
