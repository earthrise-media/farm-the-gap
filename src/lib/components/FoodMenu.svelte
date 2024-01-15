<script lang="ts">
  import { foodItemsGrouped } from "$lib/data/foods"

  import Button from "$lib/components/Button.svelte"
  import { gameState, userState } from "$lib/stores/state"

  const showFoodDetail = (e: MouseEvent | KeyboardEvent, food: Food) => {
    e.stopPropagation()
    $userState.itemInspecting = food
  }

  const selectFoodItem = (e: MouseEvent | KeyboardEvent, food: Food) => {
    e.stopPropagation()
    $userState.itemSelectedForSwap = food
  }
</script>

<svelte:window on:click={() => ($userState.itemSelectedForSwap = null)} />

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
          <div class="food-item-button">
            <div class="flex align-center label">
              <div class="food-item-avatar text-secondary-3 bg-{food.colorId}">
                <span>
                  {$gameState.inventory.get(food.id).available}
                </span>
              </div>
              <span>{food.name}</span>
            </div>
            <!-- <Button classList="bare" onClick={(e) => showFoodDetail(e, food)}>ⓘ</Button> -->
          </div>
        </Button>
      {/each}
    </div>
  {/each}
</div>

<style lang="sass">
#food-menu-wrapper
  display: grid
  grid-template-columns: 2fr 2fr
  grid-template-areas: "animal plant"
  grid-gap: 1.5rem
  margin-top: 1rem
  align-items: start
  border: 1px solid transparent

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
  font-size: 12px
  pointer-events: none

.food-item-avatar
  margin-right: 0.375em
  padding: 0.625em

:global(#food-menu-wrapper button)
  padding: 0.125em 0.125em

:global(#food-menu-wrapper .food-item-button button)
  padding: 0
</style>
