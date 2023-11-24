<script lang="ts">
  import { base } from "$app/paths"
  import { farm, gameState } from "$lib/stores/state"

  import Farm from "$lib/components/Farm.svelte"
  import Button from "$lib/components/Button.svelte"
  import FoodMenu from "$lib/components/FoodMenu.svelte"
  import BlockImpact from "$lib/components/BlockImpact.svelte"
  import FoodItemsGrid from "$lib/components/FoodItemsGrid.svelte"
  import BlockGameState from "$lib/components/BlockGameState.svelte"
  import FoodInformationCard from "$lib/components/FoodInformationCard.svelte"
  import WelcomeScreen from "$lib/components/WelcomeScreen.svelte"
  import EndScreen from "$lib/components/EndScreen.svelte"
  import Tooltip from "$lib/components/Tooltip.svelte"
</script>

<main>
  <div class="panel panel-controls">
    <header class="flex justify-between">
      <img width="100" src="{base}/brand/logo.png" alt="The Plotline Logo" />
      <Button
        onClick={() => {
          $farm.reset()
          $farm = $farm
          $gameState.reset()
          $gameState = $gameState
        }}
      >
        Reset
      </Button>
    </header>
    <p class="label">Change how your land is used by adding food types below.</p>
    <FoodMenu />
  </div>
  <div class="panel panel-farm"><Farm /></div>
  <div class="panel panel-center">
    <BlockGameState />
    <FoodItemsGrid />
  </div>
  <div class="panel panel-right">
    <!-- <div class="label">Environmental Impacts</div> -->
    <BlockImpact type="emissions" />
    <BlockImpact type="water" />
    <BlockImpact type="eutrophy" />
    <!-- <div class="label">Nutrition</div> -->
    <!-- <BlockNutrition type="protein" /> -->
  </div>
  <FoodInformationCard />
  <Tooltip />
  <!-- <WelcomeScreen /> -->
  <!-- <EndScreen /> -->
</main>

<style lang="sass">
main
  height: 100vh
  height: 100svh
  display: grid
  grid-template-rows: 1fr 2fr
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)
  grid-template-areas: "controls center right" "farm center right"

.panel
  position: relative
  padding: 1rem

.panel-controls
  grid-area: controls

  header
    margin-bottom: 0.75rem

.panel-farm
  grid-area: farm
  padding-top: 0rem
  display: flex
  align-items: center
  justify-content: center

.panel-right,
.panel-center
  gap: 1em
  display: flex
  flex-direction: column

.panel-center
  grid-area: center
  grid-column: 2
  grid-row: 1 / -1
  padding-right: 0.5rem
  background-color: var(--color-primary-2)

.panel-right
  grid-row: 1 / -1
  grid-column: 3
  grid-area: right
  padding-left: 0.5rem
  background-color: var(--color-primary-2)

</style>
