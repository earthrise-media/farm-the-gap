<script lang="ts">
  import { tweened } from "svelte/motion"
  import { quintInOut as easing } from "svelte/easing"

  export let min = 0
  export let max = 100
  export let value = 0

  const progress = tweened(0, {
    duration: 400,
    delay: 50,
    easing
  })

  $: $progress = (100 * (value - min)) / (max - min)
</script>

<div class="progress-bar">
  <div class="progress-bar-labels">
    <div class="progress-bar-label">{min}</div>
    <div class="progress-bar-label">{max}</div>
  </div>
  <div class="progress-bar-bar">
    <div class="progress-bar-value" style="width: {$progress}%">
      <div class="progress-bar-value-label" class:visible={$progress > 10}>{value}</div>
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

</style>
