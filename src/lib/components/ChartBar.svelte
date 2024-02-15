<script>
  // This component can be used to render a bar chart with a flexible data structure.

  import { quartInOut as easing } from "svelte/easing"
  import { fade } from "svelte/transition"
  import { flip } from "svelte/animate"
  import { sum } from "$lib/utils/helpers"

  export let data // Flat array of values or objects
  export let value = (o) => o
  export let label = (o, i) => o.label
  export let color = (o, i) => o.color
  export let sort = (a, b) => value(b) - value(a)
  export let identifier = (o, i) => o.label
  export let groups = undefined // array of groups
  export let barHeight = groups?.length ? 10 : 4
  export let barClassList = "text-3xs pr-8"
  export let showAxisLines = false
  export let colorLabels = false
  export let maxItems = data.length
  export let onClick = () => {}
  export let onMouseEnter = () => {}
  export let onMouseLeave = () => {}

  const fw = (o, i, g) => (value(o, i, g) - min) / (max - min)
  const fn_color = (o, i, g) =>
    typeof color === "string" ? color : color(o, i, g)

  let barElements = []

  $: min = data.xAxis?.min || 0
  $: max = groups?.length
    ? Math.max(
        ...data.map((o, i) => groups.map((g, j) => value(o, i, j))).flat()
      )
    : Math.max(...data.map(value))
  $: sortedData = data.sort(sort)

  // Rather than slicing the data itself, limit the chart height so that excluded bars aren't visible. Enables prettier sorting animations.
  $: maxHeight =
    maxItems && barElements.length
      ? sum(
          barElements.slice(0, maxItems).map((el) => {
            const style = window.getComputedStyle(el)
            const height =
              parseInt(style.getPropertyValue("height")) +
              parseInt(style.getPropertyValue("margin-top")) +
              parseInt(style.getPropertyValue("margin-bottom"))
            return height
          })
        ) + "px"
      : "none"
</script>

<div
  class="bar-chart font-sans"
  class:axis-lines={showAxisLines}
  class:grouped={groups?.length}
  style="max-height: {maxHeight}"
>
  {#each sortedData as o, i (label(o, i))}
    <button
      class="bar {barClassList}"
      style={colorLabels ? `color: ${fn_color(o, i)}` : ""}
      data-identifier={identifier(o, i)}
      bind:this={barElements[i]}
      on:click={onClick}
      on:mouseenter={onMouseEnter}
      on:mouseleave={onMouseLeave}
      animate:flip={{ duration: 800, easing }}
      transition:fade
    >
      <div class:opacity-75={!colorLabels}>{@html label(o, i)}</div>
      {#if groups?.length}
        {#each groups as _, g}
          <div class="w-full relative flex align-center">
            <div
              class="rect"
              style="transform: scale3d({fw(
                o,
                i,
                g
              )},1,1); height: {barHeight}px; color: {fn_color(o, i, g)};"
            />
            <div
              class="value"
              class:opacity-75={!colorLabels}
              style="transform: translate3d({100 * fw(o, i, g)}%,0,0);"
            >
              {value(o, i, g)}
            </div>
          </div>
        {/each}
      {:else}
        <div class="w-full relative flex align-center">
          <div
            class="rect"
            style="transform: scale3d({fw(
              o
            )},1,1); height: {barHeight}px; color: {fn_color(o, i)};"
          />
          <div
            class="value"
            class:opacity-75={!colorLabels}
            style="transform: translate3d({100 * fw(o)}%,0,0);"
          >
            {value(o, i)}
          </div>
        </div>
      {/if}
    </button>
  {/each}
</div>

<style lang="sass">
  .bar-chart
    overflow: hidden
    
  .bar
    .axis-lines &
      border-top: 1px solid #ccc
      margin-top: 0.25em
      margin-bottom: 0.25em
      padding-top: 0.25em
      padding-bottom: 0.25em

</style>
