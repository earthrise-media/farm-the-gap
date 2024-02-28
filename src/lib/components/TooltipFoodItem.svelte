<script lang="ts">
  import { onMount } from "svelte"
  import { base } from "$app/paths"
  import { spring } from "svelte/motion"
  import { fade } from "svelte/transition"
  import { userState } from "$lib/stores/state"

  let vw = 0

  const coords = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.14,
      damping: 0.6
    }
  )

  const move = (e: InteractionEvent) => {
    document.body.style.cursor = "none"
    if (!active) {
      document.body.style.cursor = "initial"
      return
    }

    let x = 0
    let y = 0

    if (e.hasOwnProperty("targetTouches")) {
      const event = e as TouchEvent
      x = event.targetTouches[0].clientX
      y = event.targetTouches[0].clientY
    } else {
      const event = e as MouseEvent
      x = event.clientX
      y = event.clientY
    }

    coords.set({ x, y })
  }

  onMount(() => {
    // Todo: implement global pointer tracking and import coords into components
    document.addEventListener("pointermove", move, true)
    document.addEventListener("touchstart", move, true)
    document.addEventListener(
      "click",
      (e) => {
        setTimeout(() => move(e), 5)

        if (e.target instanceof HTMLElement && e.target.closest(".swappable")) {
          active = null
          setTimeout(() => (active = $userState.itemSelectedForSwap), 250)
        }
      },
      true
    )
  })

  $: active = $userState.itemSelectedForSwap
</script>

<svelte:window bind:innerWidth={vw} />

<div id="tooltip-food-item" style="left: {$coords.x}px; top: {$coords.y}px">
  {#if active}
    <div id="tooltip-food-item-body" in:fade={{ duration: 140 }} out:fade={{ duration: 70 }}>
      {#if active.image}
        <img src="{base}/{active.image}" alt={active.name} />
      {:else}
        {active.emoji}
      {/if}
    </div>
  {/if}
</div>

<style lang="sass">
#tooltip-food-item
  position: fixed
  pointer-events: none
  user-select: none
  z-index: 10
  
#tooltip-food-item-body
  position: absolute
  top: 0
  left: 0
  font-weight: 500
  text-align: center
  font-size: 1.25rem
  font-size: 1.5rem
  text-shadow: 0 0 0.5rem #0008
  transform: translate(-50%, calc(-50% - 0.25rem))
  transition: transform 0.3s

  img
    width: 1.25em
    height: 1.25em
    object-fit: contain

</style>
