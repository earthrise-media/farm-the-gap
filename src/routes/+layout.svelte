<script>
  import "/src/styles/app.sass"

  import Header from "$lib/components/Header.svelte"
  import Menu from "$lib/components/Menu.svelte"
  import ModalShare from "$lib/components/ModalShare.svelte"
  import ModalOrientation from "$lib/components/ModalOrientation.svelte"
  import { dev } from "$app/environment"

  let vh = 0,
    vw = 0
</script>

<slot />

<Menu />
<ModalShare />
<ModalOrientation />

<svelte:window bind:innerHeight={vh} bind:innerWidth={vw} />

{#if dev}
  <div id="size-ui" class="bg-primary-0 label bold">{vw}, {vh}</div>
{/if}

<style lang="sass">
#size-ui
  position: fixed
  right: 0
  bottom: 0
  padding: 0.25rem
  z-index: 1000
</style>
