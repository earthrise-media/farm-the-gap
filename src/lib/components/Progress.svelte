<script lang="ts">
  import { tweened } from "svelte/motion"
  import { quintInOut } from "svelte/easing"

  import Number from "$lib/components/Number.svelte"

  export let value = 0
  export let showValue = true
  export let showLabels = true
  export let isPercent = false
  export let isError = false
  export let backgroundCurrentColor = false
  export let min = 0
  export let max = isPercent ? 1 : 100

  export let delay = 0
  export let duration = 400
  export let easing = quintInOut

  const width = tweened(0, { duration, delay, easing })

  $: $width = +((100 * (value - min)) / (max - min))
</script>

{#if $$slots.label}
  <div class="progress-label">
    <slot name="label" />
  </div>
{/if}
<div class="progress-bar" class:is-error={isError}>
  {#if showLabels}
    <div class="progress-bar-labels">
      <div class="progress-bar-label">{(isPercent ? 100 : 1) * min}</div>
      <div class="progress-bar-label">{(isPercent ? 100 : 1) * max}</div>
    </div>
  {/if}
  <div class="progress-bar-bar">
    <div
      class="progress-bar-value"
      class:bg-current={backgroundCurrentColor}
      style="width: {$width}%"
    >
      {#if showValue}
        <div class="progress-bar-value-label" class:visible={$width > 10}>
          <Number {value} {delay} {duration} {easing} {isPercent} />
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="sass">
.progress-bar-bar
  height: 0.75em
  border-radius: 0.75em
  position: relative
  overflow: hidden
  background: var(--color-secondary-3)
  border: 1px solid var(--color-secondary-3)

  .is-error &
    background: var(--color-error-3)
    border-color: var(--color-error-3)

.progress-bar-labels
  display: flex
  justify-content: space-between
  margin-bottom: 0.25em
  font-size: 0.5em
  font-weight: bold

.progress-bar-value
  position: absolute
  top: 0
  left: 0
  height: 100%
  background: linear-gradient(-90deg, var(--color-tertiary-1), var(--color-tertiary-2))
  border-radius: inherit
  
  &.bg-current
    background: currentColor

.progress-bar-value-label
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

.progress-label
  font-size: 0.625rem
  margin-bottom: 0.125rem
  color: var(--color-secondary-1)
  white-space: nowrap
  overflow: hidden

</style>
