<script lang="ts">
  export let data

  $: ({ title, description, lede } = data?.post ?? {})
</script>

<section class="article-hero">
  <h1 class="description">{title}</h1>
  <h1 class="title">{description}</h1>
</section>

<article>
  <section class="article-content">
    <p class="lede">{lede}</p>
    <slot />
  </section>
</article>

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

</style>
