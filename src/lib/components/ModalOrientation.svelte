<script lang="ts">
  import Modal from "$lib/components/Modal.svelte"
  import { onMount } from "svelte"
  import Icon from "./Icon.svelte"

  let show: boolean

  const onResize = () => {
    const isSmallDevice = window.innerWidth < 900
    const isPortrait = window.innerWidth < window.innerHeight
    show = isSmallDevice && isPortrait
  }

  onMount(onResize)
</script>

<!-- Don't use Screen Orientation API due to compatibility concerns -->
<svelte:window on:resize={onResize} />

{#if show}
  <Modal fullscreen hideCloseButton>
    <div class="modal-orientation flex-col flex-center title">
      <h2>Please rotate to landscape mode!</h2>
      <Icon type="rotate-phone" />
    </div>
  </Modal>
{/if}

<style lang="sass">
.modal-orientation
  height: calc(100% - 1.5rem)
</style>
