<script lang="ts">
  export let data: number[]
  export let min: number = 0
  export let max: number = 100
  export let colorClasses: string[]
  export let nTicks: number = 2
  export let height: string = "2rem"
  export let tooltip: boolean = true

  const fw = (v: number) => (100 * (v - min)) / (max - min)
</script>

<div class="chart-stacked-bar" style="height: {height}">
  {#if nTicks}
    <div class="chart-stacked-bar-axis">
      {#each new Array(nTicks - 1).fill(0) as _, i}
        <div class="chart-stacked-bar-tick">
          <div class="chart-stacked-bar-tick-label label">{(max * i) / (nTicks - 1)}</div>
          {#if i === nTicks - 2}
            <div class="chart-stacked-bar-tick-label label">{max}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  <div class="chart-stacked-bar-segments">
    {#each data as d, i}
      <div
        data-tooltip={tooltip ? d : undefined}
        class="chart-stacked-bar-segment {colorClasses[i]}"
        style="width: {fw(d)}%"
      />
    {/each}
  </div>
</div>

<style lang="sass">
.chart-stacked-bar
  width: 100%
  position: relative
  background: var(--color-secondary-3)

.chart-stacked-bar-segments
  position: relative
  display: flex
  height: 100%
  width: 100%
  z-index: 1

.chart-stacked-bar-segment
  height: 100%

.chart-stacked-bar-axis
  position: absolute
  left: 0
  right: 0
  top: -4px
  bottom: -4px
  display: flex
  z-index: 0

.chart-stacked-bar-tick
  flex: 1
  height: 100%
  color: var(--color-primary-1)
  border-left: 1px solid var(--color-secondary-3)

  &:last-child
    border-right: 1px solid var(--color-secondary-3)

.chart-stacked-bar-tick-label
  position: absolute
  bottom: calc(-1em - 4px)
  font-size: 0.5rem
  transform: translateX(-50%)

  + .chart-stacked-bar-tick-label
    right: 0
    transform: translateX(50%)
</style>
