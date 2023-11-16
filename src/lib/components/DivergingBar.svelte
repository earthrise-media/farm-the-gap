<script lang="ts">
  import { tweened } from "svelte/motion"
  import { quintInOut } from "svelte/easing"

  import Number from "$lib/components/Number.svelte"

  export let datum = 0 // the center value
  export let scale = 100 // +- each side
  export let value = 0 // current value

  export let delay = 0
  export let duration = 400
  export let easing = quintInOut

  const left = tweened(0, { duration, delay, easing })
  const width = tweened(0, { duration, delay, easing })

  $: difference = value - datum
  $: percent = difference / scale
  $: $left = 100 * (difference >= 0 ? 0.5 : 0.5 - (datum - value) / (2 * scale))
  $: $width = 100 * Math.abs(difference / (2 * scale))
</script>

<div class="diverging-bar" class:is-negative={difference < 0}>
  <div class="diverging-bar-axis diverging-bar-axis-x" />
  <div class="diverging-bar-bar">
    <div class="diverging-bar-value" style="left: {$left}%; width: {$width}%">
      <div class="diverging-bar-value-label" class:visible={$width > 10}>
        <Number value={percent} isPercent showSign {delay} {duration} {easing} />
      </div>
    </div>
  </div>
  <div class="diverging-bar-axis diverging-bar-axis-y">
    <!-- <div class="datum-label">{datum}</div> -->
  </div>
</div>

<style lang="sass">
.diverging-bar
  position: relative
  margin: 1rem 0

.diverging-bar-axis
  position: absolute
  background: var(--color-secondary-3)

.diverging-bar-axis-x
  left: 0
  transform: translateY(-50%)
  height: 1px
  width: 100%
  top: 50%

.diverging-bar-axis-y
  top: 0
  width: 1px
  height: 100%
  transform: translateX(-50%)
  left: 50%

.diverging-bar-bar
  height: 0.75em
  border-radius: 0.75em
  position: relative
  overflow: hidden

.diverging-bar-value
  position: absolute
  top: 0
  left: 0
  height: 0.75em
  background: linear-gradient(-90deg, var(--color-tertiary-1), var(--color-tertiary-2))
  border-radius: 0 0.5em 0.5em 0
  
  .is-negative &
    border-radius: 0.5em 0 0 0.5em

.diverging-bar-value-label
  position: absolute
  font-size: 0.5em
  font-weight: bold
  top: 50%
  transform: translateY(-50%)
  color: var(--color-secondary-1)
  right: 0.5em
  opacity: 0
  transition: opacity 0.2s

  &.visible
    opacity: 1

.datum-label
  display: flex
  justify-content: space-between
  margin-bottom: 0.25em
  font-size: 0.5em
  font-weight: bold
  position: absolute
  z-index: 1
  top: 0%
  left: 50%
  transform: translate(-50%, -50%)
  text-shadow: 0 0 0.25em var(--color-primary-1)

</style>
