<script lang="ts">
  import { tweened } from "svelte/motion"
  import { fly } from "svelte/transition"
  import { linear } from "svelte/easing"

  import { farm, gameState, successMetrics } from "$lib/stores/state"

  import Modal from "$lib/components/Modal.svelte"
  import Button from "$lib/components/Button.svelte"
  import Progress from "$lib/components/Progress.svelte"

  let slideIndex = 0
  let slides = ["End slide"]
  let showEndScreen = true

  const close = () => {
    showEndScreen = false
  }
</script>

{#if showEndScreen || $successMetrics.hasSucceeded || $successMetrics.hasFailed}
  <Modal fullscreen {close}>
    <h2 slot="title">Game over • {$successMetrics.hasSucceeded ? "Success!" : "You failed!"}</h2>
    <div class="wrapper">
      <div class="slide-wrap">
        {#if slideIndex === 0}
          <div class="slide" in:fly={{ x: 1000 }} out:fly={{ x: -1000 }}>
            {#if $successMetrics.hasSucceeded}
              <p>
                You were able to supply 850 people with adequate nutrition without clearing more
                land.
              </p>
            {:else}
              <p>You failed to supply 850 people with adequate nutrition in time.</p>
            {/if}
            <Button
              color="secondary"
              onClick={() => {
                $farm.reset()
                $farm = $farm
                $gameState.reset()
                $gameState = $gameState
                showEndScreen = false
              }}
            >
              Try again &rarr;
            </Button>
          </div>
        {/if}
      </div>
      <div class="pager-wrap">
        <div class="pagers">
          {#each slides as s, i}
            <button
              class="pager"
              class:active={slideIndex === i}
              on:click={() => (slideIndex = i)}
            />
          {/each}
          <div class="label">{slideIndex + 1} / {slides.length}</div>
        </div>
        <div class="arrows">
          <Button disabled={slideIndex === 0} onClick={() => (slideIndex -= 1)}>&larr;</Button>
          <Button
            color="secondary"
            onClick={() => (slideIndex === slides.length - 1 ? close() : (slideIndex += 1))}
          >
            {slideIndex === slides.length - 1 ? "Enter" : "Next"}
            &rarr;</Button
          >
        </div>
      </div>
    </div>
  </Modal>
{/if}

<style lang="sass">
.wrapper
  display: flex
  flex-direction: column
  height: 100%

.slide-wrap
  position: relative
  flex-grow: 1

.slide
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  font-size: 0.875rem

.pager-wrap
  position: relative
  display: flex
  justify-content: space-between
  align-items: flex-end

.pagers
  display: flex
  gap: 0.25rem

  .label
    margin-left: 0.25rem

.pager
  width: 1em
  height: 1em
  cursor: pointer
  border-radius: 100%
  border: none
  transition: background 0.2s ease-in-out
  background: var(--color-primary-3)

  &.active
    background: var(--color-primary-1)

p
  margin-bottom: 1rem
  text-align: center

</style>
