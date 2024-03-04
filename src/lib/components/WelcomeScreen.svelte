<script lang="ts">
  import { fade } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"

  import { userState, gameState, gameSettings } from "$lib/stores/state"
  import { prettyPercent } from "$lib/utils/written"

  import Farm from "$lib/components/Farm.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import Slide from "$lib/components/Slide.svelte"
  import Slides from "$lib/components/Slides.svelte"

  let slideIndex = 0
  let slides = ["Welcome", "Context", "Gameplay", "Challenge"]

  const close = () => {
    $userState.hasBeenWelcomed = true
  }

  const impactCharts = [
    {
      title: "Emissions",
      percent: 26,
      description: "of global greenhouse gas emissions come from food"
    },
    {
      title: "Land use",
      percent: 50,
      description: "of the world’s habitable land is used for agriculture"
    },
    {
      title: "Water use",
      percent: 70,
      description: "of global freshwater withdrawals are used for agriculture"
    },
    {
      title: "Water pollution",
      percent: 78,
      description: "of ocean and freshwater eutrophication is caused by agriculture"
    }
  ]
</script>

{#if !$userState.hasBeenWelcomed}
  <Modal id="welcome-screen" fullscreen fullWidth durationOut={800}>
    <div
      class="welcome-wrapper slide-{slideIndex}"
      role="button"
      tabindex="0"
      in:fade={{ duration: 2000, delay: 100, easing }}
    >
      <Slides bind:slideIndex {slides} {close} showPagers={slideIndex > 0}>
        <div out:fade class="backing-screen">
          <div class="welcome-farm-wrapper">
            <div class="farm-transform">
              <Farm levitate />
            </div>
          </div>
        </div>
        {#if slideIndex === 0}
          <Slide>
            <h1 class="title slide-title slide-title-0">Farm the Gap</h1>
            <p>
              The world faces a food gap. By {$gameState.year.end}, we must produce {prettyPercent(
                $gameSettings.gap
              )} more calories to feed a growing and developing population.
            </p>
            <p>Can you reimagine agriculture to feed the future sustainably?</p>
            <p class="label text-tertiary-1">Click anywhere to begin (x)</p>
          </Slide>
        {:else if slideIndex === 1}
          <Slide>
            <h3 class="slide-title slide-title-1">The environmental impact of food</h3>
            <p>
              Food systems have a significant global footprint.<sup
                ><a href="https://ourworldindata.org/environmental-impacts-of-food" target="_blank"
                  >1</a
                ></sup
              > To close the food gap, we must better utilise our finite land and water resources, and
              reduce emissions and pollution.
            </p>
            <div class="impact-charts flex">
              {#each impactCharts as { title, percent, description }}
                <div class="flex-col align-center text-center justify-center">
                  <div class="label-caps text-secondary-3">{title}</div>
                  <div class="big-number">
                    {percent}<span class="text-secondary-3">%</span>
                  </div>
                  <div class="label text-secondary-3">{description}</div>
                </div>
              {/each}
            </div>
          </Slide>
        {:else if slideIndex === 2}
          <Slide>
            <h3 class="slide-title slide-title-2">This is our global farm</h3>
            <p>
              Each square on this 10&hairsp;×&hairsp;10 plot represents 1% of global land used for
              agriculture. 77% is used for livestock farming, and 23% for crops for human
              consumption, such as fruit, vegetables, and grains.
            </p>
          </Slide>
        {:else if slideIndex === 3}
          <Slide>
            <h3 class="slide-title slide-title-3">You decide how to feed the future</h3>
            <p>
              You have {$gameState.year.end - $gameState.year.current} years to close the food gap by
              changing what food we grow. You are allowed one move per year.
            </p>
            <p>
              You must continually deliver a nutritionally-balanced diet to a growing population,
              while keeping environmental impacts in check.
            </p>
            <p>
              <b class="text-tertiary-1"> Let's play! </b>
            </p>
          </Slide>
        {/if}
      </Slides>
    </div>
  </Modal>
{/if}

<style lang="sass">
.welcome-wrapper
  display: flex
  height: 100%

  h1
    margin-bottom: 0.25em
  p
    margin-bottom: 0.5em

    + p
      margin-top: 0.25em

.slide-title
  padding-top: 8rem

  &.slide-title-1
    padding-top: 0

.welcome-farm-wrapper
  margin: 0 auto
  top: 0
  left: 0
  right: 0
  bottom: 0
  display: flex
  position: absolute
  align-items: center
  justify-content: center
  transform-origin: center
  transform-style: preserve-3d
  -webkit-transform-origin: center
  -webkit-transform-style: preserve-3d

  .farm-transform
    max-width: 420px
    transition: all 0.6s ease-in-out
    transform: scale(0.7)

    :global(.land-cell)
      font-size: 75%

    .slide-0 &
      transition: all 0.8s ease
      transform: scale(0.85) translate(0, -75%)

    .slide-1 &
      transform: scale(2) translate(0, -65%)

    .slide-2 &
      transform: scale(1) translate(0, -55%)

    .slide-3 &
      transform: scale(0.85) translate(0, -75%)

.impact-charts
  gap: 0 1.25rem
  margin-top: 1.25rem

.backing-screen
  top: 0
  left: 0
  right: 0
  bottom: 0
  position: fixed
  opacity: 1
  pointer-events: none

:global(#welcome-screen, #end-screen)
  user-select: none
:global(#welcome-screen .scroller-contents.scroller-y),
:global(#end-screen .scroller-contents.scroller-y)
  overflow: hidden

</style>
