<script lang="ts">
  import { farm, gameHistory, gameState } from "$lib/stores/state"
  import Button from "./Button.svelte"

  export let hideRemainingCount = false

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
  classList="button-undo inline-flex align-center justify-center"
  {onClick}
  disabled={!$gameState.undosRemaining}
>
  {#if $gameState.undosRemaining && !hideRemainingCount}<span
      class="label bold food-item-avatar text-primary-1 bg-secondary-2"
      >{$gameState.undosRemaining}</span
    >
  {/if}<slot>Undo</slot>
</Button>

<style lang="sass">
.label
  margin-right: 0.5em
  margin-left: -0.375em
  padding: 0.75em
</style>
