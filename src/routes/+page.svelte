<script lang="ts">
  import { dev } from "$app/environment"
  import { userState } from "$lib/stores/state"

  import Meta from "$lib/components/Meta.svelte"
  import Dock from "$lib/components/Dock.svelte"
  import Farm from "$lib/components/Farm.svelte"
  import Toast from "$lib/components/Toast.svelte"
  import Header from "$lib/components/Header.svelte"
  import Tooltip from "$lib/components/Tooltip.svelte"
  import FoodMenu from "$lib/components/FoodMenu.svelte"
  import EndScreen from "$lib/components/EndScreen.svelte"
  import MobileMenu from "$lib/components/MobileMenu.svelte"
  import WelcomeScreen from "$lib/components/WelcomeScreen.svelte"
  import FoodItemsGrid from "$lib/components/FoodItemsGrid.svelte"
  import BlockGameState from "$lib/components/BlockGameState.svelte"
  import FoodStatsTable from "$lib/components/FoodStatsTable.svelte"
  import TooltipFoodItem from "$lib/components/TooltipFoodItem.svelte"
  import ModalOrientation from "$lib/components/ModalOrientation.svelte"
  import FoodInformationCard from "$lib/components/FoodInformationCard.svelte"
</script>

<Meta />
<ModalOrientation />

<main class:food-item-selected={$userState.itemSelectedForSwap}>
  <Header />
  <div class="panel-game-area panel">
    <div class="panel-menu panel">
      <FoodMenu />
    </div>
    <div class="panel-farm panel">
      <Farm />
      <Dock />
    </div>
  </div>

  <div class="panel panel-data">
    <div class="panel-tables">
      <FoodStatsTable />
      <FoodItemsGrid />
      <MobileMenu />
    </div>
    <div class="panel-game-state">
      <BlockGameState />
    </div>
  </div>

  <FoodInformationCard />
  <Tooltip />

  <TooltipFoodItem />

  {#if !dev}
    <WelcomeScreen />
    <EndScreen />
    <Toast />
  {/if}
</main>

<style lang="sass">
@import "src/styles/vars/screens"

main
  height: 100vh
  height: 100svh
  display: grid
  gap: 0.5rem 0.25rem
  padding: 0.5rem 0.75rem 0.75rem
  grid-template-rows: auto 1fr
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)
  grid-template-areas: "header header" "data game"
  background: var(--color-primary-1)

.panel
  position: relative
  overflow: hidden

.panel-game-area
  display: grid
  grid-area: game
  background: var(--color-primary-2)
  border-radius: var(--border-radius)
  padding: 0
  grid-template-rows: auto 1fr

.panel-farm
  display: flex
  align-items: center
  justify-content: center

.panel-data
  grid-area: data
  gap: 0.25rem
  display: grid
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr)

  .panel-game-state
    background: var(--color-primary-2)
    border-radius: var(--border-radius)
    padding: var(--border-radius)
    max-height: 100vh
    max-height: 100svh
    overflow: hidden
    padding: 1rem 0.25rem

@media (max-width: $screen-sm)

  main
    padding-left: 0
    gap: 0 0.25rem
    grid-template-columns: minmax(0, 1fr) minmax(0, 2.125fr)

  .panel-game-area
    gap: 0.25rem
    grid-template-rows: 1fr
    grid-template-columns: auto 1fr
    padding-left: 0.75rem

  .panel-data
    grid-template-columns: 4rem minmax(0, 2.5fr)

</style>
