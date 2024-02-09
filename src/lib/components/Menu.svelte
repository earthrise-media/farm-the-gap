<script lang="ts">
  import { userState } from "$lib/stores/state"

  import { page } from "$app/stores"

  import Modal from "$lib/components/Modal.svelte"
  import Header from "./Header.svelte"
  import Scroller from "./Scroller.svelte"

  const items = [
    {
      title: "Game",
      slug: "/"
    },
    {
      title: "About",
      slug: "/about"
    }
  ]

  const articles = [
    {
      title: "Water use",
      slug: "/articles/water-use"
    },
    {
      title: "Land use",
      slug: "/articles/land-use"
    },
    {
      title: "Food emissions",
      slug: "/articles/emissions"
    },
    {
      title: "What is the best diet for the climate?",
      slug: "/articles/diet"
    },
    {
      title: "Small changes by many or large changes by few?",
      slug: "/articles/changes"
    }
  ]
</script>

{#if $userState.isMenuOpen}
  <Modal showHeader fullscreen fullWidth durationOut={200}>
    <div id="main-menu">
      <div id="main-menu-list">
        {#each items as { title, slug }}
          <a
            class="main-menu-link"
            on:click={(e) => {
              if (slug === $page.url.pathname) e.preventDefault()
              $userState.isMenuOpen = false
            }}
            href={slug}>{title}</a
          >
        {/each}
        <div class="attribution description">
          This project was funded by <a href="https://theplotline.org/">The Plotline</a>, an open
          innovation platform and resource hub working towards a more sustainable and equitable food
          system. This game and website was designed and built by
          <a href="https://brody.fyi/">Brody Smith</a>.
        </div>
      </div>
      <div id="article-menu-wrap">
        <h3 class="text-xl">Learning center</h3>
        <div class="description">
          These snack-sized articles will help you understand food systems and the environment. Take
          a quick bite!
        </div>
        <div id="article-menu-list">
          {#each articles as { title, slug }}
            <a
              class="article-link"
              on:click={(e) => {
                if (slug === $page.url.pathname) e.preventDefault()
                $userState.isMenuOpen = false
              }}
              href={slug}>{title}</a
            >
          {/each}
        </div>
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

#article-menu-list
  gap: 0.25rem
  display: flex
  flex-wrap: wrap
  font-size: 1rem
  margin-top: 1rem

#article-menu-wrap
  border-left: 1px solid var(--color-secondary-3)

  h3
    font-size: 3rem
    font-weight: normal
    margin-bottom: 0.5rem
    color: var(--color-secondary-3)

a
  color: var(--color-secondary-3)
  text-decoration: none
  transition: color 0.2s

  @media (hover: hover)
    &:hover
      color: var(--color-secondary-1)

  &.main-menu-link
    line-height: 1.25

  &.article-link
    padding: 1rem
    text-align: center
    color: var(--color-secondary-2)
    background: var(--color-primary-3)
    border-radius: 0.25rem
    transition: all 0.3s
    flex-grow: 1

    @media (hover: hover)
      &:hover
        background: var(--color-primary-1)
        color: var(--color-secondary-1)

.description
  line-height: 1.3
  font-size: 0.75rem
  color: var(--color-secondary-2)

.attribution
  margin-top: 1rem
  padding-top: 1rem
  border-top: 1px solid var(--color-secondary-3)

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

  #main-menu-list
    width: 40%
    flex-basis: 40%

  #article-menu-wrap
    width: 60%
    flex-basis: 60%


</style>
