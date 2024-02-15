<script lang="ts">
  import { base } from "$app/paths"

  import { foodItemsGrouped } from "$lib/data/foods"
  import { gameState, userState } from "$lib/stores/state"

  import Button from "$lib/components/Button.svelte"
  import Scroller from "$lib/components/Scroller.svelte"

  let vh: number
  let vw: number

  const showFoodDetail = (e: MouseEvent | KeyboardEvent, food: Food) => {
    e.stopPropagation()
    $userState.itemInspecting = food
  }

  const selectFoodItem = (e: MouseEvent | KeyboardEvent, food: Food) => {
    e.stopPropagation()
    $userState.itemSelectedForSwap = food
  }
</script>

<svelte:window
  bind:innerWidth={vw}
  bind:innerHeight={vh}
  on:click={() => ($userState.itemSelectedForSwap = null)}
/>

<Scroller gradient={vw < 900 && vh < 600}>
  <div id="food-menu-wrapper">
    {#each Object.keys(foodItemsGrouped) as key}
      <div class="button-group group-{key}">
        <div class="label">{key} Proteins</div>
        {#each foodItemsGrouped[key] as food, i}
          <Button
            attributes={{ "data-food-id": food.id, "data-food-name": food.name }}
            disabled={$gameState.inventory.get(food.id).available <= 0}
            active={food === $userState.itemSelectedForSwap}
            color={food === $userState.itemSelectedForSwap ? "tertiary" : "primary"}
            onMouseEnter={() => ($userState.itemHighlighted = food)}
            onMouseLeave={() => ($userState.itemHighlighted = null)}
            onClick={(e) => selectFoodItem(e, food)}
            tooltip={$gameState.inventory.get(food.id).available <= 0
              ? food.name + " supply exhaused."
              : null}
          >
            <div class="food-item-button label">
              <div class="food-item-avatar text-secondary-3 bg-{food.colorId}">
                <span class="food-count">
                  {$gameState.inventory.get(food.id).available}
                </span>
              </div>
              <span class="food-name">{food.name}</span>
              <span class="food-emoji">
                {#if food.image}
                  <img src="{base}/{food.image}" alt={food.name} />
                {:else}
                  {food.emoji}
                {/if}
              </span>
            </div>
          </Button>
        {/each}
      </div>
    {/each}
  </div>
</Scroller>

<style lang="sass">
@import "src/styles/vars/screens"

#food-menu-wrapper
  display: grid
  grid-template-columns: 2fr 2fr
  grid-template-areas: "animal plant"
  grid-gap: 1.5rem
  margin-top: 1rem
  align-items: start

.group-animal,
.group-plant
  grid-template-columns: 1fr 1fr
  grid-template-rows: auto repeat(4, 1fr)
  grid-auto-flow: column
  align-items: start

.group-animal
  grid-area: animal
  
.group-plant
  grid-area: plant

.button-group
  display: grid
  align-items: start
  grid-gap: 0.25rem
  gap: 0.25rem 0.25rem

.label
  grid-column: 1 / -1
  text-transform: capitalize

.food-item-button
  display: flex
  align-items: center
  justify-content: space-between
  font-weight: bold
  pointer-events: none

.food-item-avatar
  margin-right: 0.375em
  padding: 0.625em

.food-count

.food-emoji
  font-size: 1.25em
  margin-left: auto

  img
    width: 1em
    height: 1em
    object-fit: contain

:global(#food-menu-wrapper button)
  padding: 0.125em 0.375em 0.125em 0.125em

@media (max-width: $screen-sm)
  #food-menu-wrapper
    gap: 0.75rem
    margin-bottom: 1.5rem
    grid-template-columns: 1fr
    grid-template-areas: "animal" "plant"

  .group-animal,
  .group-plant
    grid-template-columns: 1fr
    grid-template-rows: 1fr
    grid-auto-flow: row

  .button-group
    gap: 0.5rem

  .food-name
    color: white
    max-width: 5ch
    overflow: hidden
    margin-left: 0.25rem
    text-overflow: ellipsis

  .food-item-avatar
    margin: 0
    font-size: 1.25rem

  :global(#food-menu-wrapper button)
    padding: 0
    background: transparent

</style>
