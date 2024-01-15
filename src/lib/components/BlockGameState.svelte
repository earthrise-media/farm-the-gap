<script lang="ts">
  import {
    sparklineData,
    gameSettings,
    gameState,
    userState,
    gameHistory,
    successMetrics
  } from "$lib/stores/state"

  import Number from "$lib/components/Number.svelte"
  import LineChart from "$lib/components/LineChart.svelte"
  import { largeNumber } from "$lib/utils/written"
</script>

<div class="block-game-state lock">
  <div class="group group-metrics">
    <div class="group-title label-caps">Game metrics</div>
    <div class="items">
      {#each $sparklineData as { value, history, label, suffix, objective, warn, foodMetricKey, chartSettings }}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="item"
          class:warn
          on:mouseenter={() => ($userState.gameMetricHovering = foodMetricKey)}
          on:mouseleave={() => ($userState.gameMetricHovering = null)}
        >
          <div class="column-number flex-col">
            <div class="label">
              {label}
            </div>
            <div class="big-number flex align-center">
              {#if suffix === "%"}
                <span class="label sign">{value >= 0 ? "+" : "-"}</span>
                <Number value={100 * Math.abs(Math.floor(100 * value) / 100)} />
                <span class="label suffix text-secondary-2">{suffix}</span>
              {:else}
                <Number {value} />
                <span class="label suffix text-secondary-2">{suffix}</span>
              {/if}
            </div>
          </div>
          <div class="column-chart flex-col">
            <div class="line-chart label flex-center">
              <LineChart data={history} {warn} {...chartSettings} />
            </div>
            <div class="label objective text-secondary-3">{objective}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="group group-population">
    <div class="group-title label-caps">Population fed</div>
    <div class="items">
      <div class="line-chart label flex-center">
        <LineChart
          length={$gameState.year.end - $gameState.year.start}
          data={$gameHistory.map((o) => o.calorieProductionChange)}
          yDatum={0}
          yLimit={$gameSettings.gap}
          yMax={$gameSettings.gap}
          yMin={-0.1}
        />
      </div>
      <div class="label text-center">
        You are sustainably feeding an additional <span
          class="bold {$successMetrics.calorieProductionChange >= 0
            ? 'text-tertiary-1'
            : 'text-error-3'}"
          >{largeNumber($successMetrics.currentPopulationFed - $gameSettings.populationStart)}</span
        >
        people a nutritional diet in <b>{$gameState.year.current}</b>.
      </div>
    </div>
  </div>
</div>

<style lang="sass">
.block-game-state
  gap: 0
  height: 100%
  display: flex
  flex-direction: column
  justify-content: space-between
  
.block-title
  grid-column: 1 / -1

.group
  display: flex
  flex-direction: column
  gap: 0.125rem

  &:first-child
    margin-top: 0

  &.group-population
    .line-chart
      height: 2rem
      margin-top: 0.5rem

.items
  display: flex
  flex-direction: column
  justify-content: space-around
  gap: 0.75rem

.item
  display: flex
  padding: 0.5rem 0.5rem
  margin: 0 -0.5rem
  transition: all 0.3s
  color: var(--color-secondary-1)
  background: var(--color-primary-2)
  border-radius: 0.25rem
  cursor: pointer
  border: 1px solid transparent

  &.warn
    .label
      &.objective
        color: var(--color-secondary-1)
        background: var(--color-error-1)

    .line-chart
        border-color: var(--color-error-1)

.item
  gap: 0.375rem 0.5rem

.column-number,
.column-chart
  position: relative
  gap: 0.25rem

.column-number
  width: 25ch

.label
  transition: color 0.3s, background 0.3s
  &.sign
    font-size: 1.25rem
  &.suffix
    font-size: 0.75rem
    line-height: 1.3
    margin-left: 0.125rem
    align-self: flex-end
  &.objective
    font-size: 8px
    margin-left: -0.125rem
    margin-bottom: -0.125rem
    padding: 0.125rem
    border-radius: 0.125rem
    text-align: center

.line-chart
  height: 2rem
  width: 100%
  position: relative
  flex-grow: 1

@media (hover: hover)
  .item:hover
    background: var(--color-primary-3)

</style>
