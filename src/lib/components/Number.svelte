<script lang="ts">
  import { tweened } from "svelte/motion"
  import { quintInOut } from "svelte/easing"

  import { prettyNumber, prettyPercent, prettyPrice } from "$lib/utils/written"

  export let value = 0
  export let showSign = false
  export let isPercent = false
  export let isCurrency = false
  export let noFormatting = false
  export let precision = 0 // decimal places for rounding

  export let delay = 0
  export let duration = 400
  export let easing = quintInOut

  const tweenedNumber = tweened(value, { duration, delay, easing })

  $: $tweenedNumber = value
</script>

{#if showSign && $tweenedNumber > 0}+{/if}{#if isPercent}
  {prettyPercent($tweenedNumber, 1, precision)}
{:else if isCurrency}
  {prettyPrice($tweenedNumber)}
{:else if !noFormatting}
  {prettyNumber($tweenedNumber, precision)}
{:else}
  {$tweenedNumber}
{/if}

<style lang="sass">

</style>
