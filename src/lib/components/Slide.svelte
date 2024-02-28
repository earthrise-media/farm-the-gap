<script lang="ts">
  import { fly, fade } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"

  const flyIn = { y: 8, easing, delay: 600, duration: 1200 }

  export let hasPagers = true
</script>

<div class="slide" class:has-pagers={hasPagers} out:fade in:fly={flyIn}>
  <slot />
</div>

<style lang="sass">
@import "src/styles/vars/screens"

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
  max-width: 700px
  padding: 0.5rem
  margin: 0 auto

  &.has-pagers
    bottom: 4rem

@media (min-height: 700px) and (min-width: 1500px)
  .slide
    max-width: 800px

@media (max-width: $screen-sm)
  .slide
    &.has-pagers
      bottom: 2rem
</style>
