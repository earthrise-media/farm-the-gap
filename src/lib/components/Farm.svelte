<script lang="ts">
  import { onMount } from "svelte"
  import { base } from "$app/paths"
  import { fade, scale } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"

  import { pan, pinch } from "svelte-gestures"

  import { farm, userState, gameState, gameHistory } from "$lib/stores/state"
  import { get } from "svelte/store"
  import Button from "./Button.svelte"
  import Icon from "./Icon.svelte"

  export let levitate = false // animate the farm levitating
  export let highlightChanges = false // highlight squares different from initial grid

  let isNewPan = true
  let isNewPinch = true
  let disableGestures = levitate
  let farmWrapperElement: HTMLDivElement
  let transform = { x: 0, y: 0, z: 1, cx: 0, cy: 0, cz: 1, x0: 0, y0: 0 }

  const minZoom = 0.5
  const maxZoom = 3.5

  const isSwappable = (food: Food) => food.id !== $userState.itemSelectedForSwap?.id

  const swapFoodItem = (e: MouseEvent, x: number, y: number) => {
    e.stopImmediatePropagation()

    const foodAdded = JSON.parse(JSON.stringify($userState.itemSelectedForSwap))
    const foodRemoved = JSON.parse(JSON.stringify($farm.grid[y][x]))

    if (foodAdded === null || foodAdded === undefined) return
    $farm.grid[y][x] = foodAdded
    $gameState.update(foodAdded, foodRemoved, x, y)

    if ($gameState.inventory.get(foodAdded.id).available <= 0) $userState.itemSelectedForSwap = null

    $gameState = $gameState
    $gameHistory = $gameHistory
  }

  const onResize = () => {
    transform.x = 0
    transform.y = 0
    transform.z = 1
  }

  onMount(() => {
    $gameState = $gameState
    onResize()
  })
</script>

<svelte:window on:resize={onResize} />

<div
  id="farm-wrapper"
  bind:this={farmWrapperElement}
  use:pan={{ delay: 0 }}
  use:pinch={{ delay: 0 }}
  on:pandown={(e) => {
    // if (e.detail.event.pointerType === "mouse") disableGestures = false
    // else disableGestures = false
  }}
  on:pan={(e) => {
    if (disableGestures) return
    if (isNewPan) {
      transform.x0 = e.detail.x
      transform.y0 = e.detail.y
      transform.cx = transform.x
      transform.cy = transform.y
      isNewPan = false
    }
    const { cx, cy, x0, y0 } = transform
    transform.x = cx + (e.detail.x - x0)
    transform.y = cy + (e.detail.y - y0)
  }}
  on:panup={(e) => {
    isNewPan = true
  }}
  on:pinch={(e) => {
    if (disableGestures) return
    if (isNewPinch) {
      transform.x0 = e.detail.center.x
      transform.y0 = e.detail.center.y
      transform.cx = transform.x
      transform.cy = transform.y
      transform.cz = transform.z
      isNewPinch = false
    }

    const { scale } = e.detail
    const { cx, cy, cz } = transform

    if (scale > 1 && transform.z >= maxZoom) return
    if (scale < 1 && transform.z <= minZoom) return

    transform.x = cx * scale
    transform.y = cy * scale
    transform.z = Math.max(Math.min(scale * cz, maxZoom), minZoom)
  }}
  on:wheel={(e) => {
    if (disableGestures) return
    const delta = e.deltaY / 100

    if (delta < 0 && transform.z >= maxZoom) return
    if (delta > 0 && transform.z <= minZoom) return

    const { top, left, width, height } = farmWrapperElement.getBoundingClientRect()

    const cx = e.clientX - (left + width / 2) // center of the farm from the left
    const cy = e.clientY - (top + height / 2) // center of the farm from the top

    transform.x += (delta * (cx - transform.x)) / transform.z
    transform.y += (delta * (cy - transform.y)) / transform.z
    transform.z = Math.max(Math.min(transform.z - delta, maxZoom), minZoom)
  }}
  on:pinchup={(e) => {
    isNewPinch = true
  }}
  class:levitate
>
  {#if transform.x || transform.y || transform.z !== 1}
    <div transition:fade id="reset-transform-button" data-tooltip="Re-center">
      <Button bare onClick={onResize}>
        <Icon type="center-focus"></Icon>
      </Button>
    </div>
  {/if}
  <div
    id="gesture-element"
    style="transform: translate3d({transform.x}px, {transform.y}px, 0) scale({transform.z})"
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div id="land-grid" on:mouseleave={() => ($userState.itemHighlighted = null)}>
      {#each $farm.grid as row, y}
        {#each row as food, x}
          {#key food.id}
            <button
              in:scale={{ duration: 300, easing, start: 0.6, opacity: 0.5 }}
              class="land-cell"
              data-food={food.name}
              data-tooltip={$userState.itemSelectedForSwap && $farm.getCropCount(food.id) === 1
                ? `Cannot swap. You must keep at least one ${food.name.replace(
                    /s$/,
                    ""
                  )} square on the board at all times.`
                : $userState.itemSelectedForSwap && isSwappable(food)
                  ? `Replace ${food.name} with ${$userState.itemSelectedForSwap.name}`
                  : food.name}
              class:is-only={$farm.getCropCount(food.id) === 1}
              class:highlighted={$userState.itemHighlighted?.id === food.id}
              class:unswappable={$userState.itemSelectedForSwap && !isSwappable(food)}
              class:swappable={$userState.itemSelectedForSwap && isSwappable(food)}
              class:has-changed={highlightChanges && $farm.initialState.grid[y][x].id !== food.id}
              on:mouseenter={() => ($userState.itemHighlighted = food)}
              on:click={(e) => {
                const isOnly = $farm.getCropCount(food.id) === 1

                if (isOnly) return

                return (
                  $userState.itemSelectedForSwap &&
                  !isOnly &&
                  isSwappable(food) &&
                  swapFoodItem(e, x, y)
                )
              }}
            >
              <div class="food-item-fill bg-{food.colorId}"></div>
              <div class="food-item-image">
                {#if food.image}
                  <img src="{base}/{food.image}" alt={food.name} />
                {:else}
                  {food.emoji}
                {/if}
              </div>
            </button>
          {/key}
        {/each}
      {/each}
    </div>
  </div>
</div>

<style lang="sass">
@import "/src/styles/vars/color.scss"
@import "/src/styles/vars/screens.sass"

#farm-wrapper
  width: 100%
  max-height: 100%
  overflow: visible
  padding-bottom: 10%
  display: flex
  align-items: center
  position: relative
  justify-content: center
  border-radius: var(--border-radius)
  transform-origin: center
  transform-style: preserve-3d
  -webkit-transform-origin: center
  -webkit-transform-style: preserve-3d

  *, *::before, *::after
    transform-origin: center
    transform-style: preserve-3d
    -webkit-transform-origin: center
    -webkit-transform-style: preserve-3d

#reset-transform-button
  position: absolute
  top: 0
  right: 0
  z-index: 2
  width: 2.5rem
  height: 2.5rem
  font-size: 2rem
  display: flex
  align-items: center
  justify-content: center
  margin: 0.25rem
  color: var(--color-secondary-1)
  background: var(--color-primary-1)
  border-radius: 2rem

  :global(button)
    padding: 0
    line-height: 0

#gesture-element
  width: 100%

#land-grid
  margin: auto
  width: 70%
  transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg)
  display: grid
  grid-template-rows: repeat(10, 1fr)
  grid-template-columns: repeat(10, 1fr)
  position: relative
  z-index: 1
  background: var(--color-primary-0)
  border: 1px solid var(--color-primary-0)

  .levitate &
    animation: levitate 1s ease-in-out infinite alternate
    pointer-events: none

    .land-cell
      pointer-events: none

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
    transition: all 0.4s
    background: var(--color-primary-0)

  &::after
    width: calc(0.375rem)
    height: 141.4213% // ~ sqrt(2)
    transform: rotateZ(-45deg) rotateY(-60deg) translate(calc(-0.375rem - 1px), 0)
    transform-origin: top
    -webkit-transform-origin: top left

  &::before
    transform: translate3d(-1px, -1px, -0.5rem)
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
  color: var(--color-secondary-3)
  overflow: hidden
  aspect-ratio: 1
  user-select: none
  pointer-events: all
  transition: background 0.2s, transform 0.2s ease-out
  
  &.swappable
    background: var(--color-primary-1)
  &.highlighted
    background: var(--color-primary-3)
    animation: flash 0.5s ease-in-out infinite alternate
  &.unswappable
    background: var(--color-tertiary-2)
  &.has-changed
    background: var(--color-primary-3)
    animation: flash 0.5s ease-in-out infinite alternate

.food-item-fill
  position: absolute
  z-index: 0
  height: 100%
  width: 100%
  opacity: 0
  transition: opacity 0.2s

.food-item-image
  position: relative
  width: auto
  height: auto
  font-size: 200%
  // font-size: 1.875rem
  transition: all 0.3s ease-out
  transform: rotateZ(45deg) rotateY(-60deg) translate(0,0%)
  text-shadow: 0 0 0.1rem rgba(black, 0.5)

  img
    width: 1em
    height: 1em
    object-fit: contain

  .land-cell:not(.unswappable):hover &
    transform: rotateZ(45deg) rotateY(-60deg) translate(0, -5%)

  [data-food="Eggs"] &,
  [data-food="Lamb"] &,
  [data-food="Corn"] &,
  [data-food="Nuts"] &
    font-size: 1.75rem

  [data-food="Corn"] &
    transform: rotateZ(65deg) rotateX(-20deg) rotateY(-60deg) translate(0,0%)

  [data-food="Vegetables"] &
    transform: rotateZ(30deg) rotateX(15deg) rotateY(-60deg) translate(0,0%)

@media (hover: hover)
  .land-cell:not(.unswappable):hover
    .food-item-fill
      opacity: 1

@media (max-height: 650px) and (min-width: $screen-sm)
  #farm-wrapper
    padding-bottom: 5%
  #land-grid
    width: 60%

@media (max-width: $screen-sm)
  .land-cell
    font-size: 0.875rem


</style>
