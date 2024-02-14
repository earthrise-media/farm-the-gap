<script lang="ts">
  import Header from "$lib/components/Header.svelte"
</script>

<svelte:head>
  <style>
    html,
    body {
      height: auto !important;
      overflow: unset !important;
      background: var(--color-primary-0) !important;
    }
  </style>
</svelte:head>

<main>
  <Header isArticle />
  <slot />
</main>
