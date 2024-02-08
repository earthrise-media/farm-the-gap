<script lang="ts">
  import { base } from "$app/paths"
  import { farm, gameState, gameHistory, userState } from "$lib/stores/state"

  import Dock from "$lib/components/Dock.svelte"
  import Farm from "$lib/components/Farm.svelte"
  import Button from "$lib/components/Button.svelte"
  import FoodMenu from "$lib/components/FoodMenu.svelte"
  import MobileMenu from "$lib/components/MobileMenu.svelte"
  import BlockImpact from "$lib/components/BlockImpact.svelte"
  import FoodStatsTable from "$lib/components/FoodStatsTable.svelte"
  import FoodItemsGrid from "$lib/components/FoodItemsGrid.svelte"
  import BlockGameState from "$lib/components/BlockGameState.svelte"
  import FoodInformationCard from "$lib/components/FoodInformationCard.svelte"
  import WelcomeScreen from "$lib/components/WelcomeScreen.svelte"
  import EndScreen from "$lib/components/EndScreen.svelte"
  import Tooltip from "$lib/components/Tooltip.svelte"
  import Toast from "$lib/components/Toast.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import FoodChangesTable from "$lib/components/FoodChangesTable.svelte"
  import ButtonUndo from "$lib/components/ButtonUndo.svelte"
  import TooltipFoodItem from "$lib/components/TooltipFoodItem.svelte"
</script>

<main class:food-item-selected={$userState.itemSelectedForSwap}>
  <header class="flex align-center justify-between">
    <img width="100" src="{base}/brand/logo.png" alt="The Plotline Logo" />
    <div class="buttons">
      <ButtonUndo />
      <Button
        onClick={() => {
          $farm.reset()
          $gameState.reset()
          $gameHistory = []
          $farm = $farm
          $gameState = $gameState
          $gameHistory = $gameHistory
        }}
      >
        Reset
      </Button>
      <!-- <Button onClick={() => ($userState.showAboutPage = true)}>About</Button> -->
    </div>
  </header>
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

  <!-- <WelcomeScreen /> -->
  <EndScreen />
  <Toast />
</main>

<style lang="sass">
@import "src/styles/vars/screens"

main
  height: 100vh
  height: 100svh
  display: grid
  gap: 0.75rem 0.25rem
  padding: 0.75rem
  grid-template-rows: auto 1fr
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)
  grid-template-areas: "header header" "data game"
  background: var(--color-primary-1)

.panel
  position: relative
  overflow: hidden

header
  grid-area: header

.panel-game-area
  display: grid
  grid-area: game
  background: var(--color-primary-2)
  border-radius: var(--border-radius)
  padding: 0 1rem
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

.buttons
  gap: 0.25rem
  display: flex
  align-items: center
  justify-content: space-between


@media (max-width: $screen-sm)
  header
    display: none
    .buttons
      display: none
    img
      width: 60px

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
    grid-template-columns: minmax(0, 1fr) minmax(0, 2.5fr)

  // .panel-tables
    // opacity: 0
    // display: none

</style>
