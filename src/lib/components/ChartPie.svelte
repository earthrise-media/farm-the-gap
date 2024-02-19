<script lang="ts">
  import { pie } from "shown"

  export let title: string
  export let data: number[]
  export let donutWidth: number = 0.5
  export let label: boolean = true
  export let color: string[] | [] = []
</script>

<div class="chart-pie-wrap">
  {@html pie({
    title,
    data,
    map: {
      width: donutWidth,
      color,
      label
    }
  })}
</div>

<style lang="sass">
.chart-pie-wrap
  display: flex
  width: 100%
  position: relative
  flex-direction: column

</style>
