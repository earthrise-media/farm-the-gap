<script lang="ts">
  import { fly, fade } from "svelte/transition"
  import { backOut as easing, linear } from "svelte/easing"

  import { userState, gameState, gameSettings, successMetrics, farm } from "$lib/stores/state"

  import BlockGameState from "$lib/components/BlockGameState.svelte"
  import Button from "$lib/components/Button.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import Farm from "$lib/components/Farm.svelte"

  let slideIndex = 0

  const flyIn = { y: 8, easing, delay: 600, duration: 1200 }

  const restart = () => {
    $farm.reset()
    $farm = $farm
    $gameState.reset()
    $gameState = $gameState
  }

  $: $userState.isGameComplete = $successMetrics.hasSucceeded || $successMetrics.hasFailed
</script>

{#if $userState.isGameComplete}
  <Modal id="end-screen" isError={!$successMetrics.hasSucceeded} fullscreen>
    <div class="end-wrapper slide-{slideIndex}">
      <div class="slide-wrap">
        <div class="slide" out:fade in:fly={flyIn}>
          <h1 class="title slide-title-0">
            You {$successMetrics.hasSucceeded ? "Won" : "Lost"}!
          </h1>
          {#if $successMetrics.hasFailed}
            <p><b>Here's your problem:</b></p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis aliquam, ratione
              eligendi ex fugiat soluta reprehenderit delectus debitis, blanditiis deserunt
              perferendis molestias expedita. Vitae, non? Totam illo molestiae vitae, iste non
              perspiciatis beatae facilis sapiente odit delectus nihil.
            </p>
            <Button color="error" onClick={restart}>Try again?</Button>
          {:else if $successMetrics.hasSucceeded}
            <p>Congratulations, you closed the food gap!</p>
            <Farm levitate />
            <div class="flex buttons">
              <Button
                color="primary"
                target="_blank"
                link="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                onClick={restart}>Share</Button
              >
              <Button color="secondary" onClick={restart}>Play again</Button>
            </div>
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

.buttons
  gap: 0.75rem

:global(#end-screen .scroller-contents.scroller-y)
  overflow: hidden

</style>
