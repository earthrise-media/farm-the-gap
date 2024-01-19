<script lang="ts">
  import { base } from "$app/paths"
  import { farm, gameState, gameHistory, userState } from "$lib/stores/state"

  import Dock from "$lib/components/Dock.svelte"
  import Farm from "$lib/components/Farm.svelte"
  import Button from "$lib/components/Button.svelte"
  import FoodMenu from "$lib/components/FoodMenu.svelte"
  import BlockImpact from "$lib/components/BlockImpact.svelte"
  import FoodStatsTable from "$lib/components/FoodStatsTable.svelte"
  import FoodItemsGrid from "$lib/components/FoodItemsGrid.svelte"
  import BlockGameState from "$lib/components/BlockGameState.svelte"
  import FoodInformationCard from "$lib/components/FoodInformationCard.svelte"
  import WelcomeScreen from "$lib/components/WelcomeScreen.svelte"
  import EndScreen from "$lib/components/EndScreen.svelte"
  import AboutScreen from "$lib/components/AboutScreen.svelte"
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
    <div class="panel-controls panel">
      <FoodMenu />
    </div>
    <div class="panel-farm panel">
      <Farm />
      <Dock />
    </div>
  </div>

  <div class="panel panel-data">
    <div class="panel-2-3">
      <FoodStatsTable />
      <FoodItemsGrid />
    </div>
    <div class="panel-1-3">
      <BlockGameState />
    </div>
  </div>

  <FoodInformationCard />
  <Tooltip />

  <TooltipFoodItem />

  <WelcomeScreen />
  <EndScreen />
  <AboutScreen />
  <Toast />
</main>

<style lang="sass">
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

  .panel-1-3
    background: var(--color-primary-2)
    border-radius: var(--border-radius)
    padding: var(--border-radius)

.buttons
  gap: 0.25rem
  display: flex
  align-items: center
  justify-content: space-between

</style>
