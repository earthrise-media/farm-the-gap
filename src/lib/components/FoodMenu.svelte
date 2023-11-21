<script lang="ts">
  import { foodItemsGrouped } from "$lib/data/foods"

  import Button from "$lib/components/Button.svelte"
  import { userState } from "$lib/stores/state"

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
          active={food === $userState.itemSelectedForSwap}
          color={food === $userState.itemSelectedForSwap ? "tertiary" : "primary"}
          onClick={(e) => selectFoodItem(e, food)}
        >
          <div class="food-item-button">
            <div class="flex align-center">
              <div class="food-item-avatar text-secondary-3 bg-{food.colorId}">
                <svg fill="currentColor" viewBox="0 0 10 10" width="8">
                  <path d="M3.97 9.29V.24h2.3v9.05h-2.3ZM.6 5.91V3.62h9.05v2.29H.6Z" />
                </svg>
              </div>
              <span>{food.name}</span>
            </div>
            <Button classList="bare" onClick={(e) => showFoodDetail(e, food)}>ⓘ</Button>
          </div>
        </Button>
      {/each}
    </div>
  {/each}
</div>

<style lang="sass">
#food-menu-wrapper
  display: grid
  grid-template-columns: 1fr 2fr
  grid-template-areas: "animal plant"
  grid-gap: 1.5rem
  margin-top: 1rem
  align-items: start

.group-animal
  grid-area: animal

.group-plant
  grid-area: plant
  grid-template-columns: 1fr 1fr

.button-group
  display: grid
  grid-gap: 0.25rem
  gap: 0.25rem 0.375rem

.label
  grid-column: 1 / -1
  text-transform: capitalize

.food-item-button
  display: flex
  align-items: center
  justify-content: space-between
  font-weight: bold
  font-size: 12px

.food-item-avatar
  margin-right: 0.5em
</style>
