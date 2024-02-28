<script lang="ts">
  import Modal from "$lib/components/Modal.svelte"
  import { onMount } from "svelte"
  import Icon from "./Icon.svelte"

  import { page } from "$app/stores"

  let show: boolean

  const onResize = () => {
    const isSmallDevice = window.innerWidth < 900
    const isGamePage = $page.url.pathname === "/"
    const isPortrait = window.innerWidth < window.innerHeight
    show = isGamePage && isSmallDevice && isPortrait
  }

  onMount(onResize)
</script>

<!-- Don't use Screen Orientation API due to compatibility concerns -->
<svelte:window on:resize={onResize} />

{#if show}
  <Modal id="modal-orientation" fullscreen hideCloseButton>
    <div class="modal-orientation-body flex-col flex-center title">
      <h2>Please rotate to landscape to play game</h2>
      <Icon type="rotate-phone-landscape" />
    </div>
  </Modal>
{/if}

<style lang="sass">
:global(#modal-orientation)
  z-index: 101
  opacity: 0.9
.modal-orientation-body
  height: calc(100% - 1.5rem)
</style>
