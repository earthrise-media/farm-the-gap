<script lang="ts">
  import { fade } from "svelte/transition"

  import Button from "$lib/components/Button.svelte"
  import Scroller from "$lib/components/Scroller.svelte"

  export let id = ""
  export let close = () => {}
  export let classList = ""
  export let isError = false
  export let fullWidth = false
  export let fullscreen = false
  export let durationIn = 200
  export let durationOut = 100

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      close()
    }
  }

  $: title = $$slots.title
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  {id}
  class="modal-screen font-sans {classList}"
  class:has-title={title}
  role="dialog"
  tabindex="-1"
  aria-modal="true"
  class:fullscreen
  class:error={isError}
  class:w-full={fullWidth}
  on:click={close}
  on:keydown={handleKeydown}
  in:fade={{ duration: durationIn }}
  out:fade={{ duration: durationOut }}
>
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    class="modal"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    on:click={(e) => !fullscreen && e.stopPropagation()}
    on:keydown={(e) => !fullscreen && e.stopPropagation()}
  >
    {#if !fullscreen}
      <div class="modal-close-button">
        <Button onClick={close}>Close</Button>
      </div>
    {/if}
    {#if title}
      <h2 class="modal-title">
        <slot name="title" />
      </h2>
    {/if}
    <Scroller classList={title ? "bg-fill bg-secondary-3" : ""}>
      <slot />
    </Scroller>
  </div>
</div>

<style lang="sass">
$padding: 1.25rem
$radius: 1rem

.modal-screen
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 1000
  display: flex
  align-items: center
  justify-content: center
  background: rgba(0,0,0,0.5)

  &.fullscreen
    background: var(--color-primary-0)

  &.error
    background: var(--color-animal-1)

.modal
  display: flex
  flex-direction: column
  position: relative
  transition: all 0.2s
  width: 550px
  max-width: 95vw
  height: auto
  min-height: 200px
  max-height: 80vh
  max-height: 80svh
  padding: $padding
  border-radius: $radius
  color: var(--color-primary-1)
  background: var(--color-secondary-1)

  .fullscreen &
    max-height: 100vh
    max-height: 100svh
    max-width: 100vw
    height: 100%
    min-height: none
    border-radius: 0
    color: var(--color-secondary-1)
    background: transparent

  .w-full &
    width: 100%

  .has-title &
    padding: $radius

.modal-close-button
  position: absolute
  right: 0
  top: 0
  margin: calc($radius / 2)

  .has-title &
    margin: $radius

.modal-title
  font-weight: bold
  margin-bottom: 0.75rem
</style>
