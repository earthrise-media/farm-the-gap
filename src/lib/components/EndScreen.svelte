<script lang="ts">
  import {
    userState,
    gameState,
    successMetrics,
    sparklineData,
    farm,
    gameHistory
  } from "$lib/stores/state"

  import Modal from "$lib/components/Modal.svelte"
  import Button from "$lib/components/Button.svelte"
  import EndScreenFail from "$lib/components/EndScreenFail.svelte"
  import EndScreenSuccess from "$lib/components/EndScreenSuccess.svelte"
  import ModalUndo from "./ModalUndo.svelte"

  let slideIndex = 0

  let exhaustedTurns: boolean = false
  let farmMetricKey: FarmMetricKey
  let foodMetricKey: keyof Food
  let failedMetric: FailureMetric | undefined = $sparklineData?.find((o) => o.fail)

  const reset = () => {
    $farm.reset()
    $gameState.reset()
    $farm = $farm
    $gameHistory = []
    $gameState = $gameState
    $gameHistory = $gameHistory
  }

  $: $userState.isGameComplete = $successMetrics.hasSucceeded || $successMetrics.hasFailed
  $: exhaustedTurns = $gameState.year.current >= $gameState.year.end
  $: {
    failedMetric = $sparklineData?.find((o) => o.fail)
    if (failedMetric) {
      farmMetricKey = failedMetric.farmMetricKey
      foodMetricKey = failedMetric.foodMetricKey
    }
  }
  $: {
    if ($userState.isGameComplete && $gameState.undosRemaining <= 0) {
      $userState.itemInspecting = null
      $userState.itemHighlighted = null
      $userState.itemSelectedForSwap = null
      $userState.gameMetricHovering = null
    }
  }
</script>

{#if $userState.isGameComplete}
  {#if $successMetrics.hasFailed && failedMetric && $gameState.undosRemaining > 0}
    <ModalUndo {failedMetric} />
  {:else}
    <Modal
      id="end-screen"
      isError={$successMetrics.hasFailed && !$successMetrics.hasSucceeded}
      fullscreen
      fullWidth
    >
      <div
        class="end-wrapper slide-{slideIndex}"
        class:is-failed={$successMetrics.hasFailed && (exhaustedTurns || failedMetric)}
      >
        {#if $successMetrics.hasSucceeded}
          <EndScreenSuccess {reset} />
        {:else if $successMetrics.hasFailed && (exhaustedTurns || failedMetric)}
          <EndScreenFail {exhaustedTurns} {failedMetric} {reset} />
        {:else}
          <p>An error has occurred.</p>
        {/if}
      </div>
    </Modal>
  {/if}
{/if}

<style lang="sass">
.end-wrapper
  display: flex
  height: 100%

  :global(p)
    max-width: 525px
    margin: 0 auto 1em
    font-weight: bold
</style>
