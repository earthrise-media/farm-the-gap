<script lang="ts">
  import { base } from "$app/paths"
  import { fade, fly } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"

  import Button from "$lib/components/Button.svelte"
  import AnimatedIcon from "$lib/components/AnimatedIcon.svelte"

  import { qs } from "martha"
  import { onMount } from "svelte"
  import { spring } from "svelte/motion"
  import { gameState, userState, successMetrics, gameSettings, farm } from "$lib/stores/state"
  import { activeToastId, activeTipId } from "$lib/stores/toast"

  import { toasts } from "$lib/data/toasts"

  import type { Toast, CallBackProps } from "$lib/data/toasts/types"

  let toast: Toast | undefined = undefined
  let mounted: boolean = false
  let callbackProps: CallBackProps

  onMount(() => {
    mounted = true
    document.addEventListener("click", (e) => setTimeout(() => onGlobalInteraction(e), 25), true)
  })

  const onResize = () => {
    toast = toast
  }

  const onGlobalInteraction = (e: InteractionEvent) => {
    let hasCompletedTask = toast?.task?.(callbackProps)
    if (hasCompletedTask) onDismiss(true)

    if (!(e.target instanceof HTMLButtonElement)) return

    const newMilestone: Toast | undefined = toasts.find(
      (t) => !$userState.toastIdsShown.includes(t.id) && t.trigger?.(callbackProps)
    )

    if (newMilestone?.id) {
      $userState.toastIdsShown.push(newMilestone.id)
      $activeToastId = newMilestone.id
    } else if (toast && $userState.toastIdsShown.includes(toast.id)) {
      onDismiss()
    }
  }

  const onDismiss = (goToNext = true) => {
    toast?.onDismiss?.(callbackProps)

    if (toast?.type === "tip") $activeTipId = $activeToastId

    if (goToNext) $activeToastId = toast?.next
    else $activeToastId = undefined
  }

  const coords = spring(
    { x: 0, y: 0, w: 0, h: 0, r: 0 },
    {
      stiffness: 0.15,
      damping: 0.6
    }
  )

  $: toast = toasts.find((t) => t.id === $activeToastId)

  $: callbackProps = {
    farm: $farm,
    userState: $userState,
    gameState: $gameState,
    gameSettings: $gameSettings,
    successMetrics: $successMetrics
  } // todo: fix this type error

  $: {
    if (mounted && toast) {
      toast?.onEnter?.(callbackProps)
      if (toast.target) {
        const element = qs(toast.target)

        if (element) {
          const style = getComputedStyle(element)
          const r = parseInt(style.getPropertyValue("border-radius"))
          const p = parseInt(style.getPropertyValue("padding")) > 6 ? 0 : 6

          const { x, y, width: w, height: h } = element.getBoundingClientRect()
          $coords = { x: x - p, y: y - p, w: w + 2 * p, h: h + 2 * p, r }
        } else {
          console.error(`Element not found: ${toast.target}`)
        }
      }
    }
  }
</script>

<svelte:window on:resize={onResize} />

{#if toast}
  <div class="toast-wrapper">
    {#if toast.target}
      <div
        transition:fade|global
        class="toast-mask"
        style="grid-template-columns: {$coords.x}px  {$coords.w}px 1fr; grid-template-rows: {$coords.y}px {$coords.h}px 1fr;"
      >
        {#each Array(9) as _, i}
          {#if i === 4}
            <div class="window">
              <div id="active-tutorial-item" />
            </div>
          {:else}
            <div />
          {/if}
        {/each}
      </div>
    {/if}
    {#key toast.id}
      <div
        class="toast {toast.mobilePosition}"
        out:fly|global={{ y: 32, easing }}
        in:fly|global={{ y: 32, easing, delay: 200 }}
      >
        <div class="toast-img">
          <img
            width="100%"
            src="{base}/img/{toast.img ?? 'guide.png'}"
            alt="graphic of game guide"
          />
        </div>
        <div class="toast-body">
          {#if toast.title}
            <div class="toast-title bold">{@html toast.title}</div>
          {/if}
          <div class="toast-message">{@html toast.message}</div>
        </div>
        {#if toast.button}
          <div class="toast-button">
            {#if toast.next}
              <Button onClick={() => onDismiss(false)}>Exit</Button>
            {/if}
            <Button onClick={(e) => onDismiss(true)}>
              {@html toast.button}
            </Button>
          </div>
        {/if}
      </div>
    {/key}
  </div>
{:else}
  <button
    class="guide-img-button"
    data-tooltip="Give me some advice"
    transition:fly={{ x: -40 }}
    on:click={() => ($activeToastId = $activeTipId)}
  >
    <div class="toast-img">
      <img width="100%" src="{base}/img/guide.png" alt="graphic of game guide" />
    </div>
  </button>
{/if}

<style lang="sass">
@import "src/styles/vars/screens"

.toast-wrapper
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  display: flex
  justify-content: center
  font-size: 0.75rem
  line-height: 1.2
  padding: 1rem
  z-index: 100
  pointer-events: none

// this is a mask where the center grid item is transparent
.toast-mask
  position: fixed
  display: grid
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 0
  grid-template-rows: repeat(3,1fr)
  grid-template-columns: repeat(3,1fr)

  > div
    pointer-events: all
    background: rgba(0,0,0,0.5)

    &.window
      position: relative
      background: transparent
      pointer-events: none
      border: 2px solid var(--color-tertiary-1)
      animation: 0.4s ease-in-out infinite alternate pulse-tertiary

.toast
  pointer-events: all
  position: absolute
  left: 0
  bottom: 0
  max-width: calc(33vw - 1rem)
  margin: 0.75rem
  display: flex
  gap: 0 0.5rem
  padding: 0.75rem 0.5rem
  border: 1px solid var(--color-tertiary-1)
  z-index: 100
  border-radius: var(--border-radius)
  background: var(--color-primary-3)
  display: grid
  grid-template-columns: auto 1fr

  &.top
    top: 0
    bottom: auto

  &.right
    right: 0
    left: auto

.toast-img
  width: 35px
  display: flex
  align-items: end
  justify-content: center

.guide-img-button
  left: 0
  bottom: 0
  width: 35px
  z-index: 10
  border: none
  margin: 0.75rem
  pointer-events: all
  background: transparent
  position: absolute

.toast-body
  display: flex
  flex-direction: column
  gap: 0.25rem

.toast-button
  margin-top: 0.375rem
  text-align: right
  grid-column: 1/-1

:global(.toast-message p:last-child)
  margin-bottom: 0

@keyframes pulse-tertiary
  0%
    border-color: var(--color-primary-3)
  100%
    border-color: var(--color-tertiary-1)

@media (max-width: $screen-sm)
  .toast-wrapper
    font-size: 0.875rem

  .toast-button
    font-size: 1rem

  .guide-img-button
    padding: 0
    width: 2.5rem
    margin: 0.75rem

</style>
