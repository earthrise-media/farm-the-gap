<script lang="ts">
  import { fly, fade } from "svelte/transition"
  import { backOut as easing } from "svelte/easing"

  const flyIn = { y: 8, easing, delay: 600, duration: 1200 }
</script>

<div class="slide" out:fade in:fly={flyIn}>
  <slot />
</div>

<style lang="sass">
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
  margin: 0 auto
</style>
