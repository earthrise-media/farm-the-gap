<script lang="ts">
  import { tweened } from "svelte/motion"
  import { fly } from "svelte/transition"
  import { linear } from "svelte/easing"

  import { userState, gameState, successMetrics } from "$lib/stores/state"

  import Modal from "$lib/components/Modal.svelte"
  import Button from "$lib/components/Button.svelte"
  import Progress from "$lib/components/Progress.svelte"

  let slideIndex = 0
  let slides = ["Welcome", "Context", "Gameplay"]

  const numberTween = tweened($gameState.population.start, { duration: 4000 })

  $: {
    if (slideIndex === 2) $numberTween = $gameState.population.end
    else numberTween.set($gameState.population.start, { duration: 0, delay: 400 })
  }

  const close = () => {
    $userState.hasBeenWelcomed = true
  }
</script>

{#if !$userState.hasBeenWelcomed}
  <Modal {close}>
    <h2 slot="title">{slides[slideIndex]}</h2>
    <div class="wrapper">
      <div class="slide-wrap">
        {#if slideIndex === 0}
          <div class="slide" in:fly={{ x: 1000 }} out:fly={{ x: -1000 }}>
            <p>
              Welcome to The Protein Plant by the Plotline. This is an interactive online game about
              building a sustainable food future.
            </p>
          </div>
        {:else if slideIndex === 1}
          <div class="slide" in:fly={{ x: 1000 }} out:fly={{ x: -1000 }}>
            <p>
              By 2060, the world will need to produce 70% more calories to feed a growing and
              developing world.
            </p>
            <p>
              Some context here about the impact of food systems in climate change and land use.
            </p>
          </div>
        {:else if slideIndex === 2}
          <div class="slide" in:fly={{ x: 1000 }} out:fly={{ x: -1000 }}>
            <p>
              You start with a 10 x 10 grid, where each square represents one hectare of land. These
              100 hectares are populated with crops and animal typical of our global agricultural
              land use.
            </p>
            <p>
              Your 100 hectares feeds {$gameState.population.start} people. By Over the next 50 years,
              due to growing population and development, you will need to feed 150 people. To do this,
              you can change how your land is used.
            </p>
            <Progress
              min={$gameState.population.start}
              max={$gameState.population.end}
              value={$numberTween}
              easing={linear}
            />
          </div>
        {/if}
      </div>
      <div class="pager-wrap">
        <div class="pagers">
          {#each slides as s, i}
            <button
              class="pager"
              class:active={slideIndex === i}
              on:click={() => (slideIndex = i)}
            />
          {/each}
          <div class="label">{slideIndex + 1} / {slides.length}</div>
        </div>
        <div class="arrows">
          <Button disabled={slideIndex === 0} onClick={() => (slideIndex -= 1)}>&larr;</Button>
          <Button
            color="secondary"
            onClick={() => (slideIndex === slides.length - 1 ? close() : (slideIndex += 1))}
          >
            {slideIndex === slides.length - 1 ? "Enter" : "Next"}
            &rarr;</Button
          >
        </div>
      </div>
    </div>
  </Modal>
{/if}

<style lang="sass">
.wrapper
  display: flex
  flex-direction: column
  height: 50svh
  height: 50vh

.slide-wrap
  position: relative
  flex-grow: 1

.slide
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  font-size: 0.875rem

.pager-wrap
  position: relative
  display: flex
  justify-content: space-between
  align-items: flex-end

.pagers
  display: flex
  gap: 0.25rem

  .label
    margin-left: 0.25rem

.pager
  width: 1em
  height: 1em
  cursor: pointer
  border-radius: 100%
  border: none
  transition: background 0.2s ease-in-out
  background: var(--color-primary-3)

  &.active
    background: var(--color-primary-1)

p
  margin-bottom: 1rem

</style>
