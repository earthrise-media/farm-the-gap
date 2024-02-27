<script lang="ts">
  import { gameState, userState } from "$lib/stores/state"

  import Icon from "$lib/components/Icon.svelte"
  import Button from "$lib/components/Button.svelte"
  import ButtonUndo from "./ButtonUndo.svelte"
</script>

<div id="mobile-menu" class="text-2xl">
  <div class="flex-col">
    <Button bare onClick={() => ($userState.isMenuOpen = !$userState.isMenuOpen)}>
      <div class="icon icon-menu flex-center bg-primary-2">
        <Icon type={$userState.isMenuOpen ? "close" : "menu"} />
      </div>
    </Button>
    <Button bare onClick={() => ($userState.isMobileTablesOpen = !$userState.isMobileTablesOpen)}>
      <div
        class="icon icon-tables flex-center {$userState.isMobileTablesOpen
          ? 'bg-tertiary-2 text-primary-0'
          : 'bg-primary-2'}"
      >
        <Icon type="tables" />
      </div>
    </Button>
    <ButtonUndo bare>
      <div class="icon icon-undo flex-center bg-primary-2">
        <Icon type="undo" />
        <span class="label bg-primary-0 food-item-avatar">{$gameState.undosRemaining}</span>
      </div>
    </ButtonUndo>
  </div>
  <div class="flex-col">
    <Button
      bare
      onClick={() =>
        ($userState.shareText =
          "Farm the Gap: The strategy game and learning platform for feeding the future.")}
    >
      <div class="icon icon-share flex-center bg-primary-2">
        <Icon type="share" />
      </div>
    </Button>
  </div>
</div>

<style lang="sass">
@import "src/styles/vars/screens"

#mobile-menu
  display: none

@media (max-width: $screen-sm)
  #mobile-menu
    position: relative
    z-index: 1
    display: flex
    align-items: center
    height: 100%
    justify-content: space-between
    flex-direction: column

    > .flex-col
      gap: 0.75rem

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
