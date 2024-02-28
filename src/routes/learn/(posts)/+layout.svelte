<script lang="ts">
  import "shown/src/css/shown.css"

  import Meta from "$lib/components/Meta.svelte"
  import Tooltip from "$lib/components/Tooltip.svelte"
  import ArticleMenu from "$lib/components/ArticleMenu.svelte"

  export let data

  $: ({ title, lede } = data.post)
</script>

<section class="article-hero">
  <h1 class="title">{title}</h1>
</section>

<article>
  <section class="article-content">
    <p class="lede">{lede}</p>
    <slot />
  </section>
</article>

<section class="article-footer text-center">
  <div class="article-footer-title text-secondary-2 text-2xl">Learning center</div>
  <div class="article-footer-subtitle bold text-tertiary-1">
    8 micro-articles on food and the environment.
  </div>
  <ArticleMenu linkToGame />
</section>

<Tooltip />
<Meta {title} description={lede} />

<style lang="sass">

article
  background-color: var(--color-secondary-1)
  color: var(--color-primary-0)
  border-radius: var(--border-radius)

section
  padding: 3rem 1rem

.lede
  font-weight: bold
  text-align: center
  margin-bottom: 2rem
  color: var(--color-error-1)

.article-footer-subtitle
  margin-top: 0.75rem
  margin-bottom: 2rem

</style>
