<script lang="ts">
  import { userState } from "$lib/stores/state"

  import { page } from "$app/stores"

  import Modal from "$lib/components/Modal.svelte"

  const items = [
    {
      title: "Game",
      slug: "/"
    },
    {
      title: "About",
      slug: "/about"
    },
    {
      title: "Learn",
      slug: "/learn"
    }
  ]
</script>

{#if $userState.isMenuOpen}
  <Modal fullscreen durationOut={200}>
    {#each items as { title, slug }}
      <a
        on:click={(e) => {
          if (slug === $page.url.pathname) e.preventDefault()
          $userState.isMenuOpen = false
        }}
        href={slug}>{title}</a
      >
    {/each}
  </Modal>
{/if}

<style lang="sass">
@import "src/styles/vars/screens"

a
  font-size: 3rem

// #menu
</style>
