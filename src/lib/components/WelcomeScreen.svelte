<script lang="ts">
  import { onMount } from "svelte"
  import { tweened } from "svelte/motion"
  import { fly, fade } from "svelte/transition"
  import { backOut as easing, linear } from "svelte/easing"

  import { userState, gameState, gameSettings, successMetrics } from "$lib/stores/state"

  import Farm from "$lib/components/Farm.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import { prettyPercent } from "$lib/utils/written"

  let mounted = false
  let slideIndex = 0

  const slides = ["Welcome", "Context", "Gameplay", "Challenge"]

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

  onMount(() => {
    mounted = true
    setTimeout(() => (slideIndex = 0), 400)
  })

  const numberTween = tweened($gameState.population.start, { duration: 4000 })
  const flyIn = { y: 8, easing, delay: 600, duration: 1200 }

  $: {
    if (slideIndex === 2) $numberTween = $gameState.population.end
    else numberTween.set($gameState.population.start, { duration: 0, delay: 400 })
  }

  const close = () => {
    $userState.hasBeenWelcomed = true
  }

  const onClick = (e: InteractionEvent) => {
    const target = e.target as HTMLElement
    if (target?.tagName === "A") return
    if (slideIndex < 0) return
    if (slideIndex === slides.length - 1) close()
    else slideIndex += 1
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowRight", "Enter", " "].includes(e.key)) onClick(e)
    if (["ArrowUp", "ArrowLeft"].includes(e.key) && slideIndex > 0) slideIndex -= 1
    if (e.key === "Escape") close()
  }
</script>

<svelte:window on:click={onClick} on:keydown={onKeyDown} />

{#if !$userState.hasBeenWelcomed}
  <Modal id="welcome-screen" fullscreen durationOut={800}>
    <div
      class="welcome-wrapper slide-{slideIndex}"
      role="button"
      tabindex="0"
      in:fade={{ duration: 2000, delay: 100, easing }}
    >
      <div class="slide-wrap">
        <div out:fade class="backing-screen">
          <div class="welcome-farm-wrapper">
            <Farm levitate />
          </div>
        </div>
        {#if slideIndex === 0}
          <div class="slide" out:fade in:fly={flyIn}>
            <h1 class="title slide-title slide-title-0">The Food Gap Challenge</h1>
            <p>
              The world faces a food gap. By {$gameState.year.end}, we must produce {prettyPercent(
                $gameSettings.gap
              )} more calories to feed a growing and developing population.
            </p>
            <p>Can you reimagine agriculture to feed the future sustainably?</p>
            <p class="label text-tertiary-1">Click anywhere to begin</p>
          </div>
        {:else if slideIndex === 1}
          <div class="slide" out:fade in:fly={flyIn}>
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
          </div>
        {:else if slideIndex === 2}
          <div class="slide" out:fade in:fly={flyIn}>
            <h3 class="slide-title slide-title-2">This is our global farm</h3>
            <p>
              Each square on this 10&hairsp;×&hairsp;10 plot represents 1% of global land used for
              agriculture. 77% is used for livestock farming, and 23% for crops for human
              consumption, such as fruit, vegetables, and grains.
            </p>
          </div>
        {:else if slideIndex === 3}
          <div class="slide" out:fade in:fly={flyIn}>
            <h3 class="slide-title slide-title-3">You decide how to feed the future</h3>
            <p>
              You have {$gameState.year.end - $gameState.year.current} years to close the food gap by
              changing what food we grow. You are allowed one move per year.
            </p>
            <p>
              Your must continually deliver a nutritionally-balanced diet to a growing population,
              while meeting market demands and keeping environmental impacts in check.
            </p>
            <p>
              <b class="text-tertiary-1"> Let's play! </b>
            </p>
          </div>
        {/if}
      </div>
    </div>
    {#if slideIndex > 0 && slideIndex < slides.length - 1}
      <div transition:fade class="pager-wrap">
        <div class="label text-secondary-1">Click anywhere to continue</div>
        <div class="pagers">
          {#each slides as s, i}
            <button
              class="pager"
              class:active={slideIndex === i}
              on:click|stopPropagation={() => (slideIndex = i)}
            />
          {/each}
        </div>
      </div>
    {/if}
  </Modal>
{/if}

<style lang="sass">
.welcome-wrapper
  display: flex
  height: 100%

.slide-wrap
  position: relative
  flex-grow: 1

.slide
  position: absolute
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  text-align: center
  top: 0
  left: 0
  right: 0
  bottom: 0
  font-size: 0.875rem
  font-size: 1.125rem
  line-height: 1.3

.slide-title
  padding-top: 8rem

  &.slide-title-1
    padding-top: 0

.pager-wrap
  position: relative
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  position: fixed
  bottom: 2rem
  width: 100%
  left: 0
  gap: 1rem

.pagers
  display: flex
  align-items: center
  position: relative
  gap: 0.5rem

  .label
    left: calc(100% + 1rem)
    position: absolute
    width: 4ch

.pager
  width: 1em
  height: 1em
  cursor: pointer
  border-radius: 100%
  border: none
  transition: background 0.2s ease-in-out
  background: var(--color-primary-1)

  &.active
    background: var(--color-primary-3)

.welcome-farm-wrapper
  margin: 0 auto
  max-width: 420px
  width: 100%
  top: 0
  transition: all 0.6s ease-in-out
  transform-origin: center
  transform-style: preserve-3d
  -webkit-transform-origin: center
  -webkit-transform-style: preserve-3d
  transform: scale(0.7) translate(0, 75%)

  .slide-0 &
    transition: all 0.8s ease
    transform: scale(0.5) translate(0, 0%)

  .slide-1 &
    transform: scale(2) translate(0, -30%)
    opacity: 1

  .slide-2 &
    transform: scale(0.9) translate(0, 10%)

  .slide-3 &
    transform: scale(0.6) translate(0, 0%)

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

:global(#welcome-screen)
  user-select: none
:global(#welcome-screen .scroller-contents.scroller-y)
  overflow: hidden

</style>
