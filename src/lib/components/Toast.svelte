<script lang="ts">
  import { base } from "$app/paths"
  import { fly } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"

  import Button from "$lib/components/Button.svelte"
  import AnimatedIcon from "$lib/components/AnimatedIcon.svelte"

  import { qs } from "martha"
  import { onMount } from "svelte"
  import { spring } from "svelte/motion"
  import { gameState, userState, successMetrics, farm } from "$lib/stores/state"
  import { activeToastId } from "$lib/stores/toast"

  import { toasts } from "$lib/data/toasts"
  import { dev } from "$app/environment"

  import type { Toast, CallBackProps } from "$lib/data/toasts/types"

  let toast: Toast | undefined = undefined
  let mounted: boolean = false
  let callbackProps: CallBackProps

  onMount(() => {
    mounted = true
    document.addEventListener("click", (e) => setTimeout(() => onGlobalInteraction(e), 10), true)
  })

  const onGlobalInteraction = (e: InteractionEvent) => {
    // check if button
    if (!(e.target instanceof HTMLButtonElement)) return

    let hasCompletedTask = toast?.task?.(callbackProps)
    if (hasCompletedTask) setTimeout(onDismiss, 200)

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
    successMetrics: $successMetrics
  } // todo: fix this type error

  $: {
    if (mounted && toast) {
      toast?.onEnter?.(callbackProps)
      if (toast.target) {
        const element = qs(toast.target)
        const style = getComputedStyle(element)
        const r = parseInt(style.getPropertyValue("border-radius"))
        const p = parseInt(style.getPropertyValue("padding")) > 6 ? 0 : 6

        const { x, y, width: w, height: h } = element.getBoundingClientRect()
        $coords = { x: x - p, y: y - p, w: w + 2 * p, h: h + 2 * p, r }
      }
    }
  }
</script>

{#if toast}
  <div class="toast-wrapper">
    {#if toast.target}
      <div
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
        class="toast"
        out:fly|global={{ y: 32, easing }}
        in:fly|global={{ y: 32, easing, delay: 200 }}
      >
        {#if toast.img}
          <div class="toast-img"><img width="100%" src="{base}/img/{toast.img}" alt="" /></div>
        {:else if toast.icon}
          <div class="toast-icon"><AnimatedIcon name={toast.icon} /></div>
        {/if}
        <div class="toast-body">
          {#if toast.title}
            <div class="toast-title bold">{@html toast.title}</div>
          {/if}
          <div class="toast-message">{@html toast.message}</div>
        </div>
        {#if toast.button}
          <div class="toast-button">
            {#if dev}
              <Button onClick={() => onDismiss(false)}>Skip</Button>
            {/if}
            <Button onClick={(e) => onDismiss(true)}>
              {@html toast.button}
            </Button>
          </div>
        {/if}
      </div>
    {/key}
  </div>
{/if}

<style lang="sass">
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
    right: 0
    bottom: 0
    max-width: 30vw
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

  .toast-img,
  .toast-icon
    width: 35px
    display: flex
    align-items: end
    justify-content: center

    img
      width: 30px

  .toast-body
    display: flex
    flex-direction: column
    gap: 0.25rem

  .toast-button
    text-align: right
    grid-column: 1/-1

:global(.toast-message p:last-child)
  margin-bottom: 0

@keyframes pulse-tertiary
  0%
    border-color: var(--color-primary-3)
  100%
    border-color: var(--color-tertiary-1)

</style>
