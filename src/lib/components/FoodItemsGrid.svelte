<script lang="ts">
  import { farm, userState } from "$lib/stores/state"

  import Select from "./Select.svelte"

  let sortKey: FarmMetricKey = "yield"

  const sortKeys: FarmMetricKey[] = ["yield", "calories", "protein", "emissions"]

  $: foods = $farm[sortKey].byFood.slice(0, 5)
</script>

<div class="food-items-grid">
  <h3 class="block-title">
    <span>Your farm's top foods by</span>
    <Select
      id="top-foods-select-key"
      name="top-foods-select-key"
      options={sortKeys}
      bind:value={sortKey}
    />
  </h3>
  {#if foods.length}
    <div class="food-items-grid-body">
      {#each foods as { value, count, food, unit }, i (food.id)}
        <div
          class="food-card"
          role="button"
          tabindex="-1"
          class:is-highlighted={$userState.itemHighlighted?.id === food.id}
          on:mouseenter={() => ($userState.itemHighlighted = food)}
          on:mouseleave={() => ($userState.itemHighlighted = null)}
          on:keydown={(e) => {
            if (e.key === "Enter") $userState.itemInspecting = food
          }}
        >
          <div class="label-index text-secondary-3">{i + 1}</div>
          <strong class="name">{food.name}</strong>
          <div class="value land-value">
            <b>{count}%</b> <span class="text-secondary-3">of farm area</span>
          </div>
          <div class="value keyed-value">
            <b>{((100 * value) / $farm[sortKey].total).toFixed(0)}%</b>
            <span class="text-secondary-3">of {sortKey}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="sass">
@import "src/styles/vars/screens"

.food-items-grid
  display: flex
  flex-direction: column
  padding: 1rem
  padding-left: 0.5rem
  background: var(--color-primary-1)

.block-title
  display: flex
  align-items: center
  gap: 0.25em

.food-items-grid-body
  display: grid
  grid-template-columns: 1fr
  font-size: 0.875rem
  overflow: hidden
  gap: 1px
  border-top: 1px solid var(--color-secondary-3)
  border-bottom: 1px solid var(--color-secondary-3)
  margin-top: -0.125em
  padding: 0.25em 0

.sort-buttons
  display: grid
  grid-auto-flow: column
  grid-template-rows: 1fr auto
  gap: 0.25em
  text-align: center

.food-card
  display: flex
  gap: 0.75em
  font-size: 0.625rem
  padding: 0.25em
  height: 100%
  transition: filter 0.2s ease-in-out
  cursor: pointer
  position: relative
  background: var(--color-primary-1)
  overflow: hidden

  &.is-highlighted
    background: var(--color-primary-2)
    color: var(--color-secondary-1)
    filter: brightness(1.1)

  .name, .value
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis

  .label-index
    width: 1.5ch
    text-align: right

  .name
    flex-grow: 1

  .value
    text-align: right
  
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

@media (max-width: $screen-sm)
  .food-items-grid
    display: none

</style>
