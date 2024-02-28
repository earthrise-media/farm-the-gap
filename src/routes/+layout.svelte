<script>
  import "/src/styles/app.sass"

  import { page } from "$app/stores"
  import { dev } from "$app/environment"

  import Menu from "$lib/components/Menu.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import ModalShare from "$lib/components/ModalShare.svelte"
  import { afterNavigate } from "$app/navigation"

  let vh = 0
  let vw = 0

  afterNavigate(() => {
    // scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" })

    console.log("Navigated to", $page.url.pathname)
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
