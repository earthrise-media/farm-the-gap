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
  <a
    id="logo"
    class="flex align-center"
    href="{base}/"
    on:click={() => ($userState.isMenuOpen = false)}
  >
    <img src="{base}/brand/icon@128.png" alt="The Farm The Gap Logo" />
    <div class="wordmark label flex-col">
      <div class="wordmark-title bold">Farm the Gap</div>
      <div class="wordmark-subtitle italic">by The Plotline</div>
    </div>
  </a>
  <div class="buttons">
    {#if !isArticle && !$userState.isGameComplete}
      <div class="sm-hidden">
        <ButtonUndo showIcon />
      </div>
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
      $r: 5px
      content: ""
      position: absolute
      padding: var(--border-radius) 0 0
      left: -$r
      right: -$r
      top: calc(100% - $r)
      border: $r solid var(--color-primary-0)
      border-radius: var(--border-radius) var(--border-radius) 0 0 
      border-bottom: none
      background: transparent

#logo
  gap: 0.5rem

  img
    height: 2.25rem

  .wordmark
    gap: 0.125rem
    font-size: 0.75rem
  .wordmark-subtitle
    font-size: 0.625rem
    letter-spacing: -0.025em
    color: var(--color-secondary-3)

.buttons
  gap: 0.75rem
  display: flex
  align-items: center
  justify-content: space-between

  :global(button.color-secondary)
    line-height: 0

@media (max-width: $screen-sm)
  header:not(.article)
    padding-left: 0.5rem
@media (max-width: $screen-sm) and (orientation: landscape)
  header
    display: none
    &.article
      display: flex
</style>
