<script lang="ts">
  import { onMount } from "svelte"

  import {
    farm,
    userState,
    gameState,
    gameHistory,
    sparklineData,
    successMetrics
  } from "$lib/stores/state"

  import Icon from "$lib/components/Icon.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import ModalUndo from "$lib/components/ModalUndo.svelte"
  import EndScreenFail from "$lib/components/EndScreenFail.svelte"
  import EndScreenSuccess from "$lib/components/EndScreenSuccess.svelte"

  let isMobile = false
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

  const onResize = () => {
    isMobile = window.innerWidth <= 900
  }

  onMount(onResize)

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
    if ($userState.isGameComplete) {
      $userState.itemInspecting = null
      $userState.itemHighlighted = null
      $userState.itemSelectedForSwap = null
      $userState.gameMetricHovering = null
    }
  }
</script>

<svelte:window on:resize={onResize} />

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
        {#if $userState.isGameComplete && isMobile}
          <div
            id="mobile-rotate"
            class:bg-error-1={$successMetrics.hasFailed}
            class="flex-center bg-primary-0"
          >
            <div class="flex-col align-center">
              <h2 class="text-xl">Please rotate back to portrait<br />to view your results.</h2>
              <Icon type="rotate-phone-portrait" classList="title" />
            </div>
          </div>
        {/if}
        {#if $successMetrics.hasSucceeded}
          <EndScreenSuccess {isMobile} {reset} />
        {:else if $successMetrics.hasFailed && (exhaustedTurns || failedMetric)}
          <EndScreenFail {isMobile} {exhaustedTurns} {failedMetric} {reset} />
        {:else}
          <p>An error has occurred.</p>
        {/if}
      </div>
    </Modal>
  {/if}
{/if}

<style lang="sass">
@import "src/styles/vars/screens"

.end-wrapper
  display: flex
  height: 100%

  :global(p)
    max-width: 525px
    margin: 0 auto 1em
    font-weight: bold

#mobile-rotate
  display: none

@media (max-width: $screen-sm)
  .slide-0
    .slide-title
      font-size: 2.25rem

  #mobile-rotate
    display: flex
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    opacity: 0.95
    line-height: 1.3

  @media (orientation: portrait)
    #mobile-rotate
      display: none

</style>
