<script lang="ts">
  export let isDark: boolean = false
  export let data: number[] = []
  export let yMax: number = 100
  export let yMin: number = 0
  export let yLimit: number | null = null
  export let yDatum: number | null = null
  export let warn: boolean = false
  export let length: number = 0
  export let labels: boolean = false
  export let pulseEndPoint: boolean = false
  export let showEndPointValue: boolean = false
  export let endPointValuePrecision: number = 0
  export let xLabels: number[] | [] = []
  export let labelFormat: (n: number) => string = (n) => n.toFixed(0)

  const fy = (y: number) => 100 * (1 - (y - min) / (max - min))
  const isNumber = (n: any): boolean => typeof n === "number" && !isNaN(n)

  const yAreaBaseline: number =
    yDatum !== null && isNumber(yDatum)
      ? yDatum
      : yLimit !== null && isNumber(yLimit)
        ? yLimit
        : data[0]

  $: xTicks = length ? length : 10 * Math.ceil(data.length / 10) - 1
  $: min = Math.min(yMin, ...data)
  $: max = Math.max(yMax, ...data)
  $: d = `
        M0,${fy(data[0])}
        ${data
          .slice(1)
          .map((d, i) => `L${((i + 1) * 100) / xTicks},${fy(d)}`)
          .join(" ")}
      `.replace(/\s+/g, " ")
</script>

<svg
  class:warn
  xmlns="http://www.w3.org/2000/svg"
  class:dark={isDark}
  class:has-x-labels={xLabels.length}
>
  <defs>
    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
      <stop offset="5%" stop-color="#ffffff" stop-opacity="0.5" />
      <stop offset="95%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="gradient-dk" x1="0" x2="0" y1="0" y2="1">
      <stop offset="5%" stop-color="#00827E" stop-opacity="0.5" />
      <stop offset="95%" stop-color="#00827E" stop-opacity="0" />
    </linearGradient>
  </defs>
  {#key min * max * data.length}
    <svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none">
      {#if yDatum !== null}
        <path class="datum" d="M0,{fy(yDatum)} h100" />
      {/if}
      {#if yLimit !== null}
        <path class="limit" d="M0,{fy(yLimit)} h100" />
      {/if}
      {#if data.length}
        <path
          class="data-area"
          d="{d} V{fy(yAreaBaseline)} H0 Z"
          fill="url(#{isDark ? 'gradient-dk' : 'gradient'})"
        />
        <path class="data-line" {d} />
      {/if}
    </svg>
  {/key}
  {#if labels || xLabels.length}
    <svg class="text">
      {#if labels && yDatum !== null}
        <text x="-4" y="{fy(yDatum)}%" text-anchor="end">
          {yDatum === 0 ? 0 : labelFormat(yDatum)}
        </text>
      {/if}
      {#if labels && yLimit !== null}
        <text x="-4" y="{fy(yLimit)}%" text-anchor="end">
          {labelFormat(yLimit)}
        </text>
      {/if}
      {#each xLabels as l, i}
        <text
          x="{(100 * i) / (xLabels.length - 1)}%"
          y="100%"
          dy="6"
          text-anchor={i === xLabels.length - 1 ? "end" : i ? "middle" : "start"}
          alignment-baseline="hanging"
        >
          {l}
        </text>
      {/each}
    </svg>
  {/if}
  {#if showEndPointValue}
    <svg x="{((data.length - 1) * 100) / xTicks}%" y="{fy(data[data.length - 1])}%" class="text">
      <circle r="1.75" class:warn />
      <text text-anchor="middle" dy="-10"
        >{data[data.length - 1].toFixed(endPointValuePrecision)}</text
      >
    </svg>
  {/if}
  {#if pulseEndPoint}
    <svg class="pulses">
      {#each [3, 1.75] as r}
        <circle
          {r}
          class="pulse"
          class:warn
          cx="{((data.length - 1) * 100) / xTicks}%"
          cy="{fy(data[data.length - 1])}%"
        />
      {/each}
    </svg>
  {/if}
</svg>

<style lang="sass">
svg
  width: 100%
  height: 100%
  overflow: visible

  &.has-x-labels
    margin-bottom: 1rem

path
  vector-effect: non-scaling-stroke

.data-area
  stroke: none

.data-line
  fill: none
  stroke: var(--color-secondary-1)

  .dark &
    stroke: var(--color-primary-1)

.limit,
.datum
  stroke: var(--color-secondary-3)
  stroke-opacity: 0.5

  .dark &
    stroke: var(--color-primary-1)

.limit
  stroke-dasharray: 0
  stroke-dasharray: 1 3

.datum
  stroke-dasharray: 1 3
  stroke-dasharray: 0

.text
  fill: currentColor
  font-weight: bold
  font-size: 7px
  dominant-baseline: central

.pulse
  fill: currentColor
  transform-box: fill-box
  transform-origin: center

  &.warn:first-child
    fill: var(--color-error-2)
  &:not(.warn):first-child
    fill: var(--color-tertiary-1)
    
  &:first-child
    animation: pulse 1.5s ease-out infinite

</style>
