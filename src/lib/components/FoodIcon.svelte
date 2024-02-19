<script lang="ts">
  import { base } from "$app/paths"

  export let food: Food
</script>

<div class="food-icon">
  {#if food.image}
    <img src="{base}/{food.image}" alt={food.name} />
  {:else}
    {food.emoji}
  {/if}
</div>

<style lang="sass">
.food-icon
  img
    width: 1em
    height: 1em
    object-fit: contain
</style>
