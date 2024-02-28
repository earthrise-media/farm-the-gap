<script lang="ts">
  import { base } from "$app/paths"
  import { page } from "$app/stores"
  import { fade } from "svelte/transition"

  import { userState } from "$lib/stores/state"

  import articles from "$lib/data/articles"

  import Icon from "$lib/components/Icon.svelte"
  import Farm from "$lib/components/Farm.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import ArticleMenu from "$lib/components/ArticleMenu.svelte"

  let vw: number
  let vh: number
  let hoveringItemLink = ""

  const items = [
    {
      title: "Game",
      note: "Return to your game",
      href: ""
    },
    {
      title: "Learning center",
      href: "learn",
      note: `${articles.length} micro-articles on food and the environment.`
    }
  ]

  $: isContentPage = $page.url.pathname !== "/"
  $: isSmallScreen = vw <= 900 && vw > vh
</script>

<svelte:window bind:innerWidth={vw} bind:innerHeight={vh} />

{#if $userState.isMenuOpen}
  <Modal id="main-menu-modal" showHeader={!isContentPage} fullscreen fullWidth durationOut={200}>
    <div id="main-menu" class:content-page={isContentPage}>
      <div id="main-menu-list">
        {#each items as { title, href, note }}
          <a
            class="main-menu-link"
            class:hover={hoveringItemLink === href}
            on:mouseenter={() => (hoveringItemLink = href)}
            on:touchstart={() => (hoveringItemLink = href)}
            on:click={(e) => {
              // check if touch vs mouse event
              const isTouch = e.hasOwnProperty("targetTouches")

              if (isTouch && hoveringItemLink !== href) {
                hoveringItemLink = href
                return
              }

              if (href === $page.url.pathname) e.preventDefault()
              else $userState.isMenuOpen = false
            }}
            href="{base}/{href}"
          >
            {@html title}
            {#if note}
              <div class="note bold">{note}</div>
            {/if}
          </a>
        {/each}
        <div class="attribution">
          This project was funded by <a href="https://theplotline.org/"
            ><b>The&nbsp;Plotline&nbsp;&nearr;</b></a
          >, an open innovation platform and resource hub working towards a more sustainable and
          equitable food system. This platform was designed, built, and written by
          <a href="https://brody.fyi/"><b>Brody&nbsp;Smith&nbsp;&nearr;</b></a>.
        </div>
      </div>
      <div id="article-menu-wrap" class="flex-col justify-center">
        {#key hoveringItemLink}
          <div transition:fade={{ duration: 300 }}>
            {#if hoveringItemLink === ""}
              <div class="rhs-container">
                <Farm levitate />
              </div>
            {:else if hoveringItemLink === "learn"}
              <ArticleMenu isInsideMenu={true} maxItems={isSmallScreen ? 3 : 6} />
            {/if}
          </div>
        {/key}
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

  &.content-page
    background: var(--color-primary-2)
    min-height: calc(100% - 3.75rem)
    width: calc(100% - 1.25rem)
    margin-left: 0.625rem
    border-radius: 1rem
    margin-top: 3.125rem

#main-menu-list,
#article-menu-wrap
  padding: 2rem
  width: 50%
  flex-basis: 50%

#main-menu-list
  font-size: 3rem
  display: flex
  justify-content: space-between
  align-items: flex-start
  flex-direction: column

.rhs-container
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
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

  h3
    font-size: 3rem
    font-weight: normal
    margin-bottom: 1rem
    color: var(--color-secondary-3)

a
  color: var(--color-secondary-3)
  text-decoration: none
  transition: all 0.3s

  &.hover,
  &:hover
    color: var(--color-secondary-1)
    transform: translateY(-0.125rem)

    .note
      color: var(--color-tertiary-1)
      transform: translateY(0.125rem)

  &.main-menu-link
    line-height: 1
    padding: 0.25rem 0

.note
  transition: inherit
  font-size: 1rem
  line-height: 1.2
  padding-left: 0.125rem
  margin: 0.375rem 0 1rem
  color: var(--color-secondary-3)

.attribution
  line-height: 1.3
  font-size: 0.75rem
  color: var(--color-secondary-2)
  margin-top: 0.75rem
  padding-top: 1.75rem
  border-top: 1px solid var(--color-primary-3)

  a
    color: var(--color-secondary-1)

@media (max-width: $screen-sm)
  #main-menu
    padding: 1rem

    &.content-page
      min-height: calc(100% - 1.75rem)
      margin-top: 1.875rem

  #main-menu-list,
  #article-menu-wrap
    padding: 1rem

  #main-menu-list,
  #article-menu-wrap h3
    font-size: 2.25rem

  #main-menu-list
    width: 40%
    flex-basis: 40%

  #article-menu-wrap
    width: 60%
    flex-basis: 60%
    justify-content: flex-start

  .attribution
    margin-top: 0
    padding-top: 1rem

  @media (orientation: portrait)

    #main-menu
      flex-direction: column
      justify-content: start
      align-items: start

      &.content-page
        margin-top: 3.5rem
        // margin-top: 0
    
    #main-menu-list
      width: 100%
      flex-basis: 100%

    #article-menu-wrap
      flex-basis: 0
      width: 100%

    .rhs-container
      justify-content: start


</style>
