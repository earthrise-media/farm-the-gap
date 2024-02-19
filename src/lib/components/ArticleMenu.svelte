<script lang="ts">
  import { userState } from "$lib/stores/state"
  import { page } from "$app/stores"
  import { base } from "$app/paths"

  import articles from "$lib/data/articles"

  export let grid = true
  export let maxItems = articles.length
  export let showFeaturedOnly = false
</script>

<div id="article-menu-list" class:grid>
  {#each articles
    .filter((a) => !showFeaturedOnly || a.featured)
    .slice(0, maxItems) as { title, slug }, i}
    <a
      class="article-link flex-center flex-col"
      class:current={$page.url.pathname === `${base}/learn/${slug}`}
      on:click={(e) => {
        if (slug === $page.url.pathname) e.preventDefault()
        $userState.isMenuOpen = false
      }}
      href="{base}/learn/{slug}"
    >
      <div class="article-link-title">{title}</div>
    </a>
  {/each}
</div>
{#if maxItems < articles.length || showFeaturedOnly}
  <div class="see-all-link text-secondary-2 text-right">
    <a href="{base}/learn" on:click={() => ($userState.isMenuOpen = false)}>See all &rarr;</a>
  </div>
{/if}

<style lang="sass">
@import "src/styles/vars/screens"

#article-menu-list
  display: flex
  flex-wrap: wrap
  font-size: 1rem
  margin: 1rem auto 0
  border-radius: 0 0.25rem 0.25rem 0
  overflow: hidden
  max-width: 750px

  &.grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
    gap: 0.5rem
    gap: 1rem


.article-link
  width: 100%
  padding: 1rem
  min-height: 8rem
  border-radius: 0.25rem
  text-decoration: none
  color: var(--color-secondary-2)
  background: var(--color-primary-3)
  border: 1px solid transparent
  transition: all 0.3s
  flex-grow: 1

  &.current
    opacity: 0.75
    pointer-events: none
    background: var(--color-primary-1)

  @media (hover: hover)
    &:hover
      color: var(--color-secondary-1)
      background: var(--color-primary-1)


.article-link-title
  font-weight: 600
  letter-spacing: -0.01em
  line-height: 1.2

.see-all-link
  margin-top: 1rem
  font-size: 0.825rem
  align-self: flex-end


@media (max-width: $screen-sm)
  #main-menu-list
    width: 40%
    flex-basis: 40%

</style>
