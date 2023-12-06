<script lang="ts">
  import { fly } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"

  import Button from "./Button.svelte"
  import Icon from "./Icon.svelte"

  import { qs } from "martha"
  import { onDestroy, onMount } from "svelte"
  import { spring } from "svelte/motion"
  import { gameState, userState } from "$lib/stores/state"
  import { activeToastId } from "$lib/stores/toast"

  import { toasts } from "$lib/data/toasts"
  import { milestones } from "$lib/data/toasts/milestones"

  let toast
  let mounted

  onMount(() => {
    mounted = true
    document.addEventListener("click", onGlobalInteraction, true)
  })

  const onGlobalInteraction = () => {
    if (toast?.task?.($gameState)) setTimeout(onDismiss, 250)

    const newMilestone = milestones.find(
      (t) => !$userState.milestonesAchieved.includes(t.id) && t.trigger($gameState)
    )

    if (newMilestone) {
      $userState.milestonesAchieved.push(newMilestone.id)
      toast = newMilestone
    }
  }

  const onDismiss = () => {
    if (toast.target) qs(toast.target).classList.remove("active-tutorial-item")

    toast.onDismiss?.()

    $activeToastId = toast.next
  }

  const coords = spring(
    { x: 0, y: 0, w: 0, h: 0, r: 0 },
    {
      stiffness: 0.15,
      damping: 0.6
    }
  )

  $: toast = toasts.find((t) => t.id === $activeToastId)

  $: {
    if (mounted && toast) {
      toast?.onEnter?.()
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
          <div class:window={i === 4} />
        {/each}
      </div>
    {/if}
    {#key toast.id}
      <div class="toast" out:fly={{ y: 32, easing }} in:fly={{ y: 32, easing, delay: 400 }}>
        {#if toast.img}
          <div class="toast-img"><img width="45" src="/img/{toast.img}" alt="" /></div>
        {:else if toast.icon}
          <div class="toast-icon"><Icon name={toast.icon} /></div>
        {/if}
        <div class="toast-body">
          {#if toast.title}
            <div class="toast-title bold">{@html toast.title}</div>
          {/if}
          <div class="toast-message">{@html toast.message}</div>
        </div>
        {#if toast.button}
          <div class="toast-button">
            <Button onClick={onDismiss}>
              {@html toast.button}
            </Button>
          </div>
        {/if}
      </div>
    {/key}
    <div
      id="active-tutorial-item"
      style="left: {$coords.x}px; top: {$coords.y}px; width: {$coords.w}px; height: {$coords.h}px; border-radius: {$coords.r}px"
    />
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

    div
      pointer-events: all
      background: rgba(0,0,0,0.5)
      &.window
        pointer-events: none
        border: 2px solid var(--color-tertiary-1)
        animation: 0.4s ease-in-out infinite alternate pulse-tertiary
        background: transparent

  .toast
    pointer-events: all
    position: absolute
    right: 0
    bottom: 0
    max-width: 30vw
    margin: 1rem
    display: flex
    gap: 0.5rem
    padding: 0.75rem 0.5rem
    border: 1px solid var(--color-tertiary-1)
    z-index: 100
    border-radius: var(--border-radius)
    background: var(--color-primary-3)

  .toast-icon
    display: flex
    align-items: center
    justify-content: center

  .toast-body
    display: flex
    flex-direction: column
    gap: 0.25rem

  .toast-button
    margin-top: auto
    text-align: right

@keyframes pulse-tertiary
  0%
    border-color: var(--color-primary-3)
  100%
    border-color: var(--color-tertiary-1)

</style>
