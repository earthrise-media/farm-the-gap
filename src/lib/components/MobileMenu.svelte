<script lang="ts">
  import type { IconName } from "$lib/data/icon"
  import { gameState, userState } from "$lib/stores/state"

  import Icon from "$lib/components/Icon.svelte"
  import Button from "$lib/components/Button.svelte"
  import ButtonUndo from "./ButtonUndo.svelte"

  type Item = {
    icon: IconName
    fn: () => void
  }

  const items: Item[] = [
    {
      icon: "menu",
      fn: () => ($userState.isMenuOpen = !$userState.isMenuOpen)
    },
    {
      icon: "tables",
      fn: () => ($userState.isMobileTablesOpen = !$userState.isMobileTablesOpen)
    },
    {
      icon: "undo",
      fn: () => console.log("undo")
    }
  ]
</script>

<div id="mobile-menu" class="text-2xl">
  {#each items as { icon, fn }}
    <svelte:component
      this={icon === "undo" ? ButtonUndo : Button}
      bare
      color="secondary"
      onClick={fn}
    >
      <div class="icon icon-{icon} flex-center bg-primary-2">
        <Icon type={icon === "menu" ? ($userState.isMenuOpen ? "close" : "menu") : icon} />
        {#if icon === "undo"}
          <span class="label bg-primary-0 food-item-avatar">{$gameState.undosRemaining}</span>
        {/if}
      </div>
    </svelte:component>
  {/each}
</div>

<style lang="sass">
@import "src/styles/vars/screens"

#mobile-menu
  display: none

@media (max-width: $screen-sm)
  #mobile-menu
    position: relative
    z-index: 1000
    gap: 0.75rem
    display: flex
    align-items: center
    flex-direction: column

  .icon
    width: 1.375em
    height: 1.375em
    border-radius: 100%

  .icon-undo
    position: relative

    .label
      position: absolute
      right: 0.375rem
      bottom: 0.375rem
      padding: 0.75em
      font-weight: bold
</style>
