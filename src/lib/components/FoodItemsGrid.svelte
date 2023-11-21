<script lang="ts">
  import { flip } from "svelte/animate"
  import { fade } from "svelte/transition"
  import { quintInOut as easing } from "svelte/easing"

  import { farm, userState } from "$lib/stores/state"

  import Button from "$lib/components/Button.svelte"
  import Number from "$lib/components/Number.svelte"

  let sortKey: FarmMetricKey = "yield"

  const sortKeys: FarmMetricKey[] = ["yield", "calories", "protein", "emissions"]

  $: foods = $farm[sortKey].byFood
</script>

<div class="food-items-grid">
  <h2>Your foods by {sortKey}</h2>
  <div class="label-caps">
    <div class="sort-buttons-label">Sort by</div>
    <div class="sort-buttons">
      {#each sortKeys as key}
        <Button active={sortKey === key} onClick={() => (sortKey = key)} classList="label-caps">
          {key}
        </Button>
      {/each}
    </div>
  </div>
  {#if foods.length}
    <div class="food-items-grid-body">
      {#each foods as { value, count, food, unit }, i (food.id)}
        <div
          class="food-card"
          transition:fade
          animate:flip={{ easing }}
          role="button"
          tabindex="-1"
          on:click={() => ($userState.itemInspecting = food)}
          on:keydown={(e) => {
            if (e.key === "Enter") $userState.itemInspecting = food
          }}
        >
          <div class="label-index">#{i + 1}</div>
          <div class="food-item-avatar flex-center bg-{food.colorId}">{count}</div>
          <strong class="name">{food.name}</strong>
          <div class="value percent-value">
            <Number value={(100 * value) / $farm[sortKey].total} duration={200} /><span
              class="text-secondary-3">%</span
            >
          </div>
          <!-- <div class="value absolute-value">
            <Number {value} duration={200} />
            <span class="text-secondary-3">{unit.suffix}</span>
          </div> -->
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="sass">
.food-items-grid
  display: flex
  flex-direction: column
  gap: 0.5em
  padding: 1em
  border-radius: var(--border-radius)
  background: var(--color-primary-1)

.food-items-grid-body
  display: grid
  grid-template-columns: repeat(2, minmax(0, 1fr))
  margin: 0 -0.5em -0.5em
  font-size: 0.875rem
  border-radius: 0.75rem
  overflow: hidden
  background: var(--color-primary-3)
  gap: 1px

.sort-buttons-label
  margin-bottom: 0.25rem

.sort-buttons
  display: grid
  grid-auto-flow: column
  grid-template-rows: 1fr auto
  gap: 0.25em
  text-align: center

.food-card
  display: grid
  grid-template-columns: 1fr auto
  gap: 0.125em
  font-size: 0.625rem
  padding: 0.25em
  height: 100%
  transition: filter 0.2s ease-in-out
  cursor: pointer
  position: relative
  background: var(--color-primary-1)
  overflow: hidden

  &:nth-child(1)
    border-radius: 1px 0 0 0
  &:nth-child(2)
    border-radius: 0 1px 0 0
  &:nth-last-child(1)
    border-radius: 0 0 1px 0
  &:nth-last-child(2)
    border-radius: 0 0 0 1px

  .name, .value
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis

  .name
    flex-grow: 1

  .value
    text-align: right

  .counters
    font-size: 0.4375rem

  .absolute-value
    grid-column: 1 / -1

.label-index
  font-size: 0.5rem
  
.food-item-avatar
  font-size: 0.4375rem
  width: 1.75em
  height: 1.75em
  line-height: 0
  font-weight: bold
  margin-left: auto
  color: var(--color-secondary-1)

.bar-label
  gap: 0.125rem

@media (hover: hover)
  .food-card:hover
    filter: brightness(1.05)

</style>
