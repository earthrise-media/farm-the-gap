<script lang="ts">
  import { userState } from "$lib/stores/state"
  import { page } from "$app/stores"
  import { base } from "$app/paths"

  import articles from "$lib/data/articles"

  export let wide = false
  export let tight = false
  export let color: "primary" | "secondary" | "error" = "primary"
  export let linkToGame = false
  export let isInsideMenu = false
  export let showFeaturedOnly = false
  export let maxItems = articles.length
</script>

<div
  id="article-menu-list"
  class="color-{color}"
  class:in-menu={isInsideMenu}
  class:tight
  class:wide
>
  {#each articles
    .filter((a) => !showFeaturedOnly || a.featured)
    .slice(0, maxItems) as { title, slug }, i}
    <a
      class="article-link flex-center flex-col"
      class:current={$page.url.pathname === `${base}/learn/${slug}/`}
      on:click={(e) => {
        if (slug === $page.url.pathname) e.preventDefault()
        $userState.isMenuOpen = false
      }}
      href="{base}/learn/{slug}/"
    >
      <div class="article-link-title">{title}</div>
    </a>
  {/each}
  {#if linkToGame}
    <a class="game-link flex-center" href="{base}/">
      <div class="icon"></div>
      <div class="article-link-title">Play game &rarr;</div>
    </a>
  {/if}
</div>
{#if maxItems < articles.length || showFeaturedOnly}
  <div class="see-all-link text-secondary-2 text-right">
    <a href="{base}/learn" on:click={() => ($userState.isMenuOpen = false)}>See all &rarr;</a>
  </div>
{/if}

<style lang="sass">
@import "src/styles/vars/screens"

#article-menu-list
  display: grid
  flex-wrap: wrap
  font-size: 1rem
  margin: 1rem auto 0
  overflow: hidden
  width: 750px
  max-width: 100%
  gap: 0.5rem
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
  gap: 1rem

  &.wide
    width: 100%

  &.in-menu
    display: grid
    grid-template-columns: repeat(2, minmax(200px, 1fr))
    gap: 1rem
    min-height: 90%

    .article-link
      min-height: 4rem

.article-link
  padding: 1rem
  min-height: 8rem
  border-radius: 0.25rem
  text-decoration: none
  color: var(--color-secondary-2)
  background: var(--color-primary-3)
  border: 1px solid transparent
  transition: all 0.3s

  .tight &
    min-height: 4rem

  .color-error &
    background: var(--color-error-2)
    color: var(--color-secondary-1)

  &.current
    opacity: 0.75
    pointer-events: none
    background: var(--color-primary-1)

  @media (hover: hover)
    &:hover
      color: var(--color-secondary-1)
      background: var(--color-primary-1)

    .color-error &:hover
      filter: brightness(1.1)
      background: var(--color-error-2)

.game-link
  gap: 1rem
  margin-top: 1rem
  font-size: 1.25rem
  grid-column: 1 / -1

  .icon
    width: 2rem
    height: 2rem
    z-index: 1
    overflow: visible
    position: relative
    border-radius: 2px
    background: var(--color-primary-3)
    transform: rotateX(60deg) rotateY(0deg) rotateZ(-45deg)

    &:after
      content: ""
      position: absolute
      z-index: -1
      top: 0
      left: 0
      width: 100%
      height: 100%
      transition: all 0.4s
      transform: translate3d(0, 0, 4px)
      box-shadow: -0.25rem 0.25rem 0.125rem rgba(black, 0.25)

.article-link-title
  font-weight: 600
  line-height: 1.2
  letter-spacing: -0.01em

.see-all-link
  font-size: 1rem
  margin-top: 1rem
  align-self: flex-end


@media (max-width: $screen-sm)
  #article-menu-list
    &.in-menu
      gap: 0.5rem
      grid-template-columns: minmax(200px, 1fr)

  .article-link
    min-height: 5rem

</style>
