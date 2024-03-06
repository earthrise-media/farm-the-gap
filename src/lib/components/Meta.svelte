<script lang="ts">
  import { browser } from "$app/environment"
  import { page } from "$app/stores"

  export let author = "The Plotline"
  export let title: string | undefined = "Farm the Gap"
  export let description: string | undefined =
    "The strategy game and learning platform for feeding the future."

  export let image: string | undefined = "/img/cover.png"
  export let siteurl: string | undefined = "https://stories.theplotline.org/farm-the-gap"

  const titleSuffix = "The Plotline"
  const analyticsId = "G-SCXFQBRZMS"

  $: {
    // Initialise analytics
    if (analyticsId && browser) {
      window.dataLayer = window.dataLayer || []
      window.gtag = function gtag() {
        window.dataLayer.push(arguments)
      }
      window.gtag("js", new Date())
      window.gtag("config", "G-SCXFQBRZMS")
    }
  }

  $: {
    // Update title on page change
    if (!title) {
      title = titleSuffix
    } else if (!title.includes(titleSuffix)) {
      title += " - " + titleSuffix
    }

    // Update analytics on page change
    if (analyticsId && browser && window.gtag !== undefined) {
      window.gtag("config", analyticsId, {
        page_title: title,
        page_path: $page.url.pathname
      })
    }
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="author" content={author} />
  <meta name="copyright" content={author} />

  <meta property="og:title" content={title} />
  <meta property="og:site_name" content={author} />
  <meta property="og:url" content={siteurl} />

  <meta name="twitter:title" content={title} />
  <meta name="twitter:site" content="@the_plotline" />

  {#if image}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="{siteurl}{image}" />
    <meta property="og:image" content="{siteurl}{image}" />
  {/if}

  {#if description}
    <meta name="description" content={description} />
    <meta name="twitter:description" content={description} />
    <meta property="og:description" content={description} />
  {/if}

  {#if analyticsId}
    <script async src="https://www.googletagmanager.com/gtag/js?id={analyticsId}"></script>
  {/if}
</svelte:head>
