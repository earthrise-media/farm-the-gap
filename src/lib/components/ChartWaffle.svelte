<script lang="ts">
  export let data: number[]
  export let colorClasses: string[]
</script>

<div class="chart-waffle">
  {#each data as n, i}
    {#each new Array(n).fill(0) as _}
      <div class="chart-waffle-square {colorClasses?.[i]}"></div>
    {/each}
  {/each}
</div>

<style lang="sass">
.chart-waffle
  display: grid
  gap: 0.125rem
  width: 100%
  grid-template-rows: repeat(10, 1fr)
  grid-template-columns: repeat(10, 1fr)

.chart-waffle-square
  flex: 1
  aspect-ratio: 1

</style>
