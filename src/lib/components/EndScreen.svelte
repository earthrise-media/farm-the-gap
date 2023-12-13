<script lang="ts">
  import { fly, fade } from "svelte/transition"
  import { backOut as easing, linear } from "svelte/easing"

  import {
    userState,
    gameState,
    gameSettings,
    successMetrics,
    farm,
    gameHistory
  } from "$lib/stores/state"

  import Modal from "$lib/components/Modal.svelte"
  import BlockGameState from "$lib/components/BlockGameState.svelte"
  import EndScreenFail from "$lib/components/EndScreenFail.svelte"
  import EndScreenSuccess from "$lib/components/EndScreenSuccess.svelte"

  let slideIndex = 0

  const flyIn = { y: 8, easing, delay: 600, duration: 1200 }

  const reset = () => {
    $farm.reset()
    $gameState.reset()
    $farm = $farm
    $gameHistory = []
    $gameState = $gameState
    $gameHistory = $gameHistory
  }

  $: $userState.isGameComplete = $successMetrics.hasSucceeded || $successMetrics.hasFailed
</script>

{#if $userState.isGameComplete}
  <Modal id="end-screen" isError={!$successMetrics.hasSucceeded} fullscreen fullWidth>
    <div class="end-wrapper slide-{slideIndex}">
      <div class="slide-wrap">
        <div class="slide" out:fade in:fly={flyIn}>
          <h2 class="slide-title">
            You {$successMetrics.hasSucceeded ? "Won 🎊" : "Lost 😮‍💨"}
          </h2>
          {#if $successMetrics.hasFailed}
            <EndScreenFail {reset} />
          {:else if $successMetrics.hasSucceeded}
            <EndScreenSuccess {reset} />
          {:else}
            <p>An error has occurred.</p>
          {/if}
        </div>
      </div>
    </div>
  </Modal>
{/if}

<style lang="sass">
.end-wrapper
  display: flex
  height: 100%

.slide-wrap
  position: relative
  flex-grow: 1

.slide
  position: absolute
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  text-align: center
  top: 0
  left: 0
  right: 0
  bottom: 0
  font-size: 0.875rem
  font-size: 1.125rem
  line-height: 1.3

.slide-title
  font-size: 2rem

.buttons
  gap: 0.75rem

:global(#end-screen .scroller-contents.scroller-y)
  overflow: hidden

</style>
