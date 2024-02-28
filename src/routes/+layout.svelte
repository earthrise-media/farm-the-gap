<script>
  import "/src/styles/app.sass"

  import { dev } from "$app/environment"
  import { afterNavigate } from "$app/navigation"

  import Menu from "$lib/components/Menu.svelte"
  import ModalShare from "$lib/components/ModalShare.svelte"

  let vh = 0
  let vw = 0

  afterNavigate(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
</script>

<slot />

<Menu />
<ModalShare />

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
