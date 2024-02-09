<script lang="ts">
  import { farm, gameHistory, gameState } from "$lib/stores/state"

  import Icon from "$lib/components/Icon.svelte"
  import Button from "$lib/components/Button.svelte"

  export let bare = false
  export let showIcon = false
  export let hideRemainingCount = false
  export let color: "primary" | "secondary" = "primary"

  const onClick = () => {
    const lastMove = $gameState.undo()

    if (lastMove === undefined) return

    const { x, y, foodRemoved } = lastMove

    $farm.plantCrop(x, y, foodRemoved)

    $gameHistory = $gameHistory.slice(0, -1)
    $farm = $farm
    $gameState = $gameState
  }
</script>

<Button
  {bare}
  {color}
  classList="button-undo inline-flex align-center justify-center"
  {onClick}
  disabled={!$gameState.undosRemaining}
>
  <slot>
    {#if $gameState.undosRemaining && !hideRemainingCount}<span
        class="label bold food-item-avatar text-primary-1 bg-secondary-2"
        >{$gameState.undosRemaining}</span
      >
    {/if}Undo{#if showIcon}&nbsp;<Icon type="undo" />{/if}
  </slot>
</Button>

<style lang="sass">
.label
  margin-right: 0.5em
  margin-left: -0.375em
  padding: 0.75em
</style>
