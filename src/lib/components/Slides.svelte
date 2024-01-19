<script lang="ts">
  import { fade } from "svelte/transition"

  export let slideIndex = 0
  export let slides: string[] = []
  export let close = () => {}
  export let showPagers = true
  export let pagersText = "Click anywhere to continue"

  const onClick = (e: InteractionEvent) => {
    const target = e.target as HTMLElement
    if (target?.tagName === "A" || target?.tagName === "BUTTON") return
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

<div class="slide-wrap">
  <slot />
</div>

{#if showPagers}
  <div transition:fade class="pager-wrap">
    <div class="label text-secondary-1">{pagersText}</div>
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

<style lang="sass">
.slide-wrap
  position: relative
  flex-grow: 1

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

</style>
