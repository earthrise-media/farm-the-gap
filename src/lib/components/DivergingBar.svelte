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

  export let showSign = true
  export let showValue = true
  export let isPercent = true

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
      <div class="diverging-bar-value-label" class:visible={true || $width > -0.5}>
        {#if showValue}
          {#if isPercent}
            <Number value={percent} isPercent {showSign} {delay} {duration} {easing} />
          {:else}
            <Number {value} {showSign} {delay} {duration} {easing} />
          {/if}
        {/if}
      </div>
    </div>
  </div>
  <div class="diverging-bar-axis diverging-bar-axis-y" />
</div>

<style lang="sass">
.diverging-bar
  position: relative
  flex-grow: 1

.diverging-bar-axis
  position: absolute
  background: var(--color-secondary-3)

.diverging-bar-axis-x
  left: 0
  transform: translateY(-50%)
  height: 1px
  width: 100%
  top: 50%
  opacity: 0

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
  top: calc(50% - 1px)
  left: 0
  height: 0.75em
  height: 2px
  background: linear-gradient(-90deg, var(--color-tertiary-1), var(--color-tertiary-2))
  
  .is-negative &
    border-radius: 0.5em 0 0 0.5em

.diverging-bar-value-label
  position: absolute
  top: 50%
  left: 100%
  transform: translate(0, -50%)
  color: var(--color-secondary-1)
  opacity: 0
  transition: all 0.2s
  padding: 0.25em
  background: inherit
  border-radius: 0.5em
  font-size: 0.5em
  font-weight: bold
  min-width: 0.75em
  min-height: 0.75em

  .is-negative &
    left: 0
    transform: translate(-100%, -50%)

  &.visible
    opacity: 1

</style>
