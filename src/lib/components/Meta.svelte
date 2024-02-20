<script lang="ts">
  import { base } from "$app/paths"

  export let author = "The Plotline"
  export let title: string | undefined = "Foodprints"
  export let description: string | undefined =
    "The strategy game and learning platform about feeding the future."

  export let image: string | undefined = "/img/cover.png"
  export let siteurl: string | undefined = "https://stories.theplotline.org"

  const titleSuffix = `The Plotline`

  $: {
    if (!title) {
      title = titleSuffix
    } else if (!title.includes(titleSuffix)) {
      title += " - " + titleSuffix
    }
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="copyright" content={author} />
  <meta name="author" content={author} />
  <meta name="og:site_name" content={author} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:site" content="@the_plotline" />

  {#if image}
    <meta name="og:image" content="{siteurl}{base}{image}" />
    <meta name="image" property="og:image" content="{siteurl}{base}{image}" />
    <meta name="twitter:image" content="{siteurl}{base}{image}" />
    <meta name="twitter:card" content="summary_large_image" />
  {/if}

  {#if description}
    <meta name="description" content={description} />
    <meta name="og:description" content={description} />
    <meta name="twitter:description" content={description} />
  {/if}
</svelte:head>
