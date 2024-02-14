<script lang="ts">
  import { userState } from "$lib/stores/state"

  import { page } from "$app/stores"

  import articles from "$lib/data/articles"

  export let grid = true
  export let maxItems = articles.length
  export let showFeaturedOnly = false
</script>

<div id="article-menu-list" class:grid>
  {#each articles
    .filter((a) => !showFeaturedOnly || a.featured)
    .slice(0, maxItems) as { title, slug, description }, i}
    <a
      class="article-link border-tertiary-1 border-plnt-{(i % 5) + 4}"
      on:click={(e) => {
        if (slug === $page.url.pathname) e.preventDefault()
        $userState.isMenuOpen = false
      }}
      href="/learn/{slug}"
    >
      <div class="article-link-title label">{title}</div>
      <div class="article-link-description"><b>{description}</b></div>
    </a>
  {/each}
</div>
{#if maxItems < articles.length || showFeaturedOnly}
  <div class="see-all-link text-secondary-2 text-right">
    <a href="/learn">See all &rarr;</a>
  </div>
{/if}

<style lang="sass">
@import "src/styles/vars/screens"

#article-menu-list
  display: flex
  flex-wrap: wrap
  font-size: 1rem
  margin-top: 1rem
  border-radius: 0 0.25rem 0.25rem 0
  overflow: hidden

  &.grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
    gap: 0.5rem
    gap: 1rem

  .article-link
    border: none
    display: flex
    flex-direction: column
    text-align: center
    align-items: center
    justify-content: center
    min-height: 8rem
    // aspect-ratio: 1
    border-radius: 0.25rem

.article-link
  text-decoration: none
  transition: color 0.2s
  padding: 0.75rem
  width: 100%
  color: var(--color-secondary-2)
  background: var(--color-primary-3)
  border-width: 2px
  border-left-style: solid
  transition: all 0.3s
  flex-grow: 1

  @media (hover: hover)
    &:hover
      color: var(--color-secondary-1)
      background: var(--color-primary-1)
      border-color: var(--color-secondary-1)

.article-link-title
  font-weight: bold
  margin-bottom: 0.25rem
  letter-spacing: -0.05em
  line-height: 1.3
  text-transform: uppercase
  color: var(--color-secondary-3)

.article-link-description
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
