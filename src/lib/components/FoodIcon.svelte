<script lang="ts">
  import { base } from "$app/paths"

  export let food: Food
</script>

<div class="food-icon" data-food-icon-name={food.name}>
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

[data-food-icon-name="Corn"]
  transform: rotate(43deg)
  
[data-food-icon-name="Vegetables"]
  transform: rotate(-30deg)
</style>
