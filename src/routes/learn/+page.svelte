<script lang="ts">
  import ArticleMenu from "$lib/components/ArticleMenu.svelte"
</script>

<section class="article-hero">
  <section class="article-menu-wrap">
    <h1 class="title">Learning center</h1>
    <div class="description text-secondary-2">
      These snack-sized articles will help you understand food systems and the environment. Take a
      quick bite!
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

.description
  margin: -1rem auto 2rem

</style>
