<script lang="ts">
  export let data: number[] = []
  export let yMax: number = 100
  export let yMin: number = 0
  export let yLimit: number | null = null
  export let yDatum: number | null = null
  export let warn: boolean = false

  const fy = (y: number) => 100 * (1 - (y - yMin) / (yMax - yMin))
  const isNumber = (n: any): boolean => typeof n === "number" && !isNaN(n)

  const yAreaBaseline: number =
    yDatum !== null && isNumber(yDatum)
      ? yDatum
      : yLimit !== null && isNumber(yLimit)
      ? yLimit
      : data[0]

  $: length = 10 * Math.ceil(data.length / 10)
  $: d = `
        M0,${fy(data[0])}
        ${data
          .slice(1)
          .map((d, i) => `L${((i + 1) * 100) / length},${fy(d)}`)
          .join(" ")}
      `.replace(/\s+/g, " ")
</script>

<svg class:warn xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
      <stop offset="5%" stop-color="#ffffff" stop-opacity="0.5" />
      <stop offset="95%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>
  <svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none">
    {#if yDatum !== null}
      <path class="datum" d="M0,{fy(yDatum)} h100" />
    {/if}
    {#if yLimit !== null}
      <path class="limit" d="M0,{fy(yLimit)} h100" />
    {/if}
    {#if data.length}
      <path class="data-area" d="{d} V{fy(yAreaBaseline)} H0 Z" fill="url(#gradient)" />
      <path class="data-line" {d} />
    {/if}
  </svg>
  <svg class="text" />
</svg>

<style lang="sass">
svg
  width: 100%
  height: 100%
  overflow: visible

path
  vector-effect: non-scaling-stroke

.data-area
  stroke: none

.data-line
  fill: none
  stroke: white

.limit,
.datum
  stroke: var(--color-secondary-3)
  stroke-opacity: 0.5

.limit
  stroke-dasharray: 0
  stroke-dasharray: 1 3

.datum
  stroke-dasharray: 1 3
  stroke-dasharray: 0
</style>
