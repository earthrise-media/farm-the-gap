<script lang="ts">
  import FoodIcon from "$lib/components/FoodIcon.svelte"
  import Progress from "$lib/components/Progress.svelte"

  export let foods: Food[]
  export let unit: string
  export let title: string
  export let subtitle: string
  export let caption: string | undefined = undefined
  export let callouts: Food[] | undefined = undefined
  export let fv: (item: Food) => number

  $: max = Math.ceil(Math.max(...foods.map(fv)))
</script>

<figure class="food-bar-chart">
  <div>
    <div class="figure-title">{@html title}</div>
    <div class="figure-subtitle label">{@html subtitle}</div>
  </div>
  {#each foods.sort((a, b) => fv(b) - fv(a)) as food, i}
    <div class="flex align-end" data-tooltip="{Math.round(fv(food))}&thinsp;{unit}">
      <span class="food-bar-chart-label label bold flex align-center">
        <FoodIcon {food} />
        {food.name}{#if callouts?.includes(food)}*{/if}
      </span>
      <div class="flex-grow">
        <Progress value={Math.round(fv(food))} {max} showLabels={!i} showValue={false} />
      </div>
    </div>
  {/each}
  {#if caption}
    <figcaption class="label">{@html caption}</figcaption>
  {/if}
</figure>

<style lang="sass">
  .food-bar-chart-label
    min-width: 11ch
    gap: 0.25rem
</style>
