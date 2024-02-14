<script lang="ts">
  import { userState } from "$lib/stores/state"

  import { page } from "$app/stores"

  import articles from "$lib/data/articles"

  import Modal from "$lib/components/Modal.svelte"
  import Header from "$lib/components/Header.svelte"
  import Scroller from "$lib/components/Scroller.svelte"
  import ArticleMenu from "./ArticleMenu.svelte"
  import { fade } from "svelte/transition"
  import Farm from "./Farm.svelte"

  const items = [
    {
      title: "Game",
      note: "Return to your game",
      slug: "/"
    },
    {
      title: "About",
      slug: "/about",
      note: "More about the game, our methodology and team."
    },
    {
      title: "Learning center",
      slug: "/learn",
      note: `${articles.length} micro-articles on food and the environment.`
    }
  ]

  let hoveringItemSlug = "/"
</script>

{#if $userState.isMenuOpen}
  <Modal showHeader fullscreen fullWidth durationOut={200}>
    <div id="main-menu">
      <div id="main-menu-list">
        {#each items as { title, slug, note }}
          <a
            class="main-menu-link"
            class:hover={hoveringItemSlug === slug}
            on:mouseenter={() => (hoveringItemSlug = slug)}
            on:click={(e) => {
              if (slug === $page.url.pathname) e.preventDefault()
              $userState.isMenuOpen = false
            }}
            href={slug}
          >
            {title}
            <div class="note text-tertiary-1 bold">{note}</div>
          </a>
        {/each}
        <div class="attribution">
          This project was funded by <a href="https://theplotline.org/">The Plotline</a>, an open
          innovation platform and resource hub working towards a more sustainable and equitable food
          system. This game and website was designed and built by
          <a href="https://brody.fyi/">Brody Smith</a>.
        </div>
      </div>
      <div id="article-menu-wrap">
        {#if hoveringItemSlug === "/"}
          <div class="rhs-container" transition:fade={{ duration: 200 }}>
            <Farm levitate />
          </div>
        {:else if hoveringItemSlug === "/learn"}
          <div class="rhs-container" transition:fade={{ duration: 200 }}>
            <Scroller gradient>
              <ArticleMenu maxItems={6} />
            </Scroller>
          </div>
        {/if}
      </div>
    </div>
  </Modal>
{/if}

<style lang="sass">
@import "src/styles/vars/screens"

#main-menu
  display: flex
  align-items: center
  min-height: 100%
  padding: 2rem

#main-menu-list,
#article-menu-wrap
  padding: 2rem
  width: 50%
  flex-basis: 50%

#main-menu-list
  font-size: 3rem
  display: flex
  justify-content: space-between
  flex-direction: column

.rhs-container
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  padding-left: 2rem
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

#article-menu-wrap
  position: relative
  height: inherit
  overflow: visible
  min-height: calc(100vh - 10rem)
  min-height: calc(100svh - 10rem)
  // border-left: 1px solid var(--color-secondary-3)

  h3
    font-size: 3rem
    font-weight: normal
    margin-bottom: 0.5rem
    color: var(--color-secondary-3)

a
  color: var(--color-secondary-3)
  text-decoration: none
  transition: color 0.2s, transform 0.3s

  @media (hover: hover)
    &.hover,
    &:hover
      color: var(--color-secondary-1)
      transform: translateY(-0.25rem)

      .note
        opacity: 1
        transform: translateY(0)

  &.main-menu-link
    line-height: 1.5

.note
  opacity: 0
  transition: opacity 0.2s, transform 0.3s
  transform: translateY(-0.5rem)
  font-size: 1rem
  line-height: 0.1

.attribution
  line-height: 1.3
  font-size: 0.75rem
  color: var(--color-secondary-2)
  margin-top: 1.25rem
  padding-top: 1.75rem
  border-top: 1px solid var(--color-primary-3)

@media (max-width: $screen-sm)
  #main-menu
    padding: 1rem
    align-items: start

  #main-menu-list,
  #article-menu-wrap
    padding: 1.5rem

  #main-menu-list,
  #article-menu-wrap h3
    font-size: 2.25rem

  #article-menu-wrap
    width: 60%
    flex-basis: 60%


</style>
