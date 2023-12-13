<script lang="ts">
  import { paths, type IconName } from "$lib/data/icon"

  export let type: IconName = "default"
  export let stroke = false
  export let classList = ""
  export let onClick: () => void = () => {}

  const viewBox = "0 0 24 24"

  $: d = paths[type] ?? paths.default
</script>

<svg
  {viewBox}
  class:stroke
  class="icon icon-{type} {classList}"
  role="button"
  tabindex="-1"
  on:click={onClick}
  on:keydown={(e) => {
    if (e.key === "Enter") onClick()
  }}
>
  <path {d} />
</svg>

<style lang="sass">
.icon
  height: 1em
  width: 1em
  fill: currentColor
  display: inline-flex
  align-items: center
  justify-content: center

</style>
