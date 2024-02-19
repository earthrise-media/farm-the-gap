<script lang="ts">
  import { base } from "$app/paths"
  import { farm, gameState, gameHistory, userState } from "$lib/stores/state"

  import Button from "$lib/components/Button.svelte"
  import ButtonUndo from "$lib/components/ButtonUndo.svelte"
  import Icon from "./Icon.svelte"

  export let isArticle = false

  const resetGame = () => {
    $farm.reset()
    $gameState.reset()
    $gameHistory = []
    $farm = $farm
    $gameState = $gameState
    $gameHistory = $gameHistory
  }
</script>

<header class:article={isArticle} class="flex align-center justify-between">
  <a href="{base}/">
    <img width="100" src="{base}/brand/logo.png" alt="The Plotline Logo" />
  </a>
  <div class="buttons">
    {#if !isArticle}
      <ButtonUndo showIcon />
    {/if}
    <Button bare color="secondary" onClick={() => ($userState.isMenuOpen = !$userState.isMenuOpen)}>
      <Icon classList="text-2xl" type={$userState.isMenuOpen ? "close" : "menu"} />
    </Button>
  </div>
</header>

<style lang="sass">
@import "src/styles/vars/screens"

header
  z-index: 10000
  grid-area: header

  &.article
    top: 0
    left: 0
    right: 0
    margin-top: -0.75rem
    padding-top: 0.5rem
    padding-bottom: 0.5rem
    position: sticky
    overflow: visible
    background: var(--color-primary-0)

    &:after
      content: ""
      position: absolute
      padding: var(--border-radius) 0 0
      left: -6px
      right: -6px
      top: calc(100% - 6px)
      border: 6px solid var(--color-primary-0)
      border-radius: var(--border-radius) var(--border-radius) 0 0 
      border-bottom: none
      background: transparent

.buttons
  gap: 0.75rem
  display: flex
  align-items: center
  justify-content: space-between

  :global(button.color-secondary)
    line-height: 0

@media (max-width: $screen-sm)
  header
    display: none
    &.article
      display: flex
</style>
