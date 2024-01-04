<script lang="ts">
  import { onMount } from "svelte"
  import { spring } from "svelte/motion"
  import { fade } from "svelte/transition"
  import { userState } from "$lib/stores/state"

  let vw = 0

  const coords = spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.1,
      damping: 0.7
    }
  )

  const move = (e: InteractionEvent) => {
    if (!active) return

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
    document.addEventListener("mousemove", move, true)
    document.addEventListener("click", (e) => setTimeout(() => move(e), 5), true)
  })

  $: active = $userState.itemSelectedForSwap
</script>

<svelte:window bind:innerWidth={vw} />

<div id="tooltip-food-item" style="left: {$coords.x}px; top: {$coords.y}px">
  {#if active}
    <div id="tooltip-food-item-body" class="bg-{active.colorId}" transition:fade />
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
  font-size: 12px
  font-weight: 500
  height: 0.75rem
  width: 0.5rem
  text-align: center
  border-radius: 100%
  box-shadow: 0 4px 0.5rem #0008
  transform: translate(-50%, calc(-50% - 0.25rem))
  transition: transform 0.3s

</style>
