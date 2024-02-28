<script lang="ts">
  import Meta from "$lib/components/Meta.svelte"
  import ArticleMenu from "$lib/components/ArticleMenu.svelte"
</script>

<Meta title="Learn" description="Six bite-sized articles about food and the environment" />

<section class="article-hero">
  <section class="article-menu-wrap">
    <h1 class="title">Learning center</h1>
    <div class="description text-secondary-2">
      These bite-sized articles will help you understand food systems and the environment.
    </div>
    <ArticleMenu />
  </section>
</section>

<style lang="sass">
section.article-hero
  min-height: 100vh
  min-height: 100svh
  padding: 2rem 0 0
  display: flex
  flex-direction: column
  align-items: center

.article-menu-wrap
  padding: 0 0.75rem
  max-width: 100%
  position: relative

.description
  margin: -0.5rem auto 2.5rem

</style>
