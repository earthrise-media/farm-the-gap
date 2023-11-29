<script lang="ts">
  import { fade, scale } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"
  import { prettyNumber } from "$lib/utils/written"

  import { farm, userState, gameState } from "$lib/stores/state"

  export let levitate = false // animate the farm levitating

  const isSwappable = (food: Food) => food.id !== $userState.itemSelectedForSwap?.id
  const swapFoodItem = (x: number, y: number) => {
    $farm.grid[y][x] = JSON.parse(JSON.stringify($userState.itemSelectedForSwap))
    $gameState.update()
    $gameState = $gameState
  }

  const getTooltipBody = (food: Food) => `
      <div class="label flex-col">
        <div>Protein: ${prettyNumber(
          food.proteinRatio * $gameState.coefficients.lossRatio * food.yieldPerHa,
          0
        )} kg per hectare</div>
        <div>Calories: ${prettyNumber(
          food.calorieRatio * $gameState.coefficients.lossRatio * food.yieldPerHa,
          0
        )} cal per hectare</div>
    </div>
  `

  const getTooltipTitle = (food: Food) => `
    <div class="flex">
        <div class="food-item-avatar bg-${food.colorId}"></div>
        <h3 class="label">${food.name}</h3>
      </div>
  `
</script>

<div id="farm-wrapper" class:levitate>
  <div id="land-grid">
    {#each $farm.grid as row, y}
      {#each row as food, x}
        {#key food.id}
          <button
            in:scale={{ duration: 300, easing, start: 0.6, opacity: 0.5 }}
            class="land-cell"
            class:tall={x == 4}
            data-tooltip={getTooltipBody(food)}
            data-tooltip-title={getTooltipTitle(food)}
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
@import "/src/styles/vars/color.scss"

#farm-wrapper
  width: 100%
  overflow: hidden
  padding-bottom: 12.5%
  display: flex
  align-items: center
  justify-content: center
  border-radius: var(--border-radius)
  transform-origin: center
  transform-style: preserve-3d
  -webkit-transform-origin: center
  -webkit-transform-style: preserve-3d

  *
    transform-origin: center
    transform-style: preserve-3d
    -webkit-transform-origin: center
    -webkit-transform-style: preserve-3d

#land-grid
  margin: auto
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

  .levitate &
    animation: levitate 1s ease-in-out infinite alternate

    &::before
      animation: levitate-shadow 1s ease-in-out infinite alternate

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
    width: calc(0.75rem)
    height: 141.4213% // ~ sqrt(2)
    transform: rotateZ(-45deg) rotateY(-60deg) translate(calc(-0.75rem - 0.25px), 0)
    transform-origin: top
    -webkit-transform-origin: top left

  &::before
    transform: translate3d(-1px, -1px, -0.875rem)
    width: calc(100% + 2px)
    height: calc(100% + 2px)
    border: 4px solid var(--color-primary-0)
    box-shadow: -2rem 2rem 1rem rgba(black, 0.25)

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
    background: var(--color-primary-1)
  &.unswappable
    background: var(--color-primary-3)

.food-item-avatar
  position: relative
  overflow: hidden
  width: 0.75em
  height: 0.75em
  transition: all 0.3s ease-out
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25)
  transform: rotateZ(-16deg) rotateY(-40deg) rotateX(60deg) scale(1.25, 1.75) translate(15%, -30%)

  &::after
    content: ""
    position: absolute
    z-index: 1
    top: 0
    left: 0
    width: 100%
    height: 100%

@media (hover: hover)
  .land-cell:not(.unswappable):hover
    background: var(--color-secondary-3)
  .land-cell:not(.unswappable):hover .food-item-avatar
    transform: rotateZ(-16deg) rotateY(-40deg) rotateX(60deg) scale(1.25, 1.75) translate(20%, -40%)


@keyframes levitate
  0%
    transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg) translateZ(0)
  100%
    transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg) translateZ(0.5rem)

@keyframes levitate-shadow
  0%
    box-shadow: -2rem 2rem 1rem rgba(black, 0.25)
  100%
    box-shadow: -3rem 3rem 2rem rgba(black, 0.25)

</style>
