<script lang="ts">
  import { flip } from "svelte/animate"
  import { fade } from "svelte/transition"
  import { quintInOut as easing } from "svelte/easing"

  import { farm } from "$lib/stores/state"

  import Number from "$lib/components/Number.svelte"
  import Progress from "$lib/components/Progress.svelte"
  import DivergingBar from "$lib/components/DivergingBar.svelte"
  import AnimatedIcon from "$lib/components/AnimatedIcon.svelte"

  export let type: "emissions" | "water" | "land" | "eutrophy" = "emissions"
  export let maxFoodItems = 3

  let total = 0
  let delta = 0
  let deltaPercent = 0
  let scaleMax = 0
  let units = ""
  let foods: FarmMetricFoodList[] = []
  let initial: FarmMetric = {
    total: 0,
    byFood: []
  }

  interface Metadata {
    key: FarmMetricKey
    title: string
    units: string
    name?: string
  }

  const data: Metadata = {
    emissions: {
      key: "emissions",
      title: "GHG Emissions",
      name: "emissions",
      units: "kg CO₂eq"
    } as Metadata,
    water: {
      key: "waterUse",
      title: "Freshwater Use",
      units: "litres"
    } as Metadata,
    land: {
      key: "landUse",
      title: "Land Use",
      name: "emissions",
      units: "m²"
    } as Metadata,
    eutrophy: {
      key: "eutrophy",
      title: "Eutrophication",
      units: "g PO₄eq"
    } as Metadata
  }[type]

  $: {
    units = data.units
    total = $farm[data.key].total
    foods = $farm[data.key].byFood.slice(0, maxFoodItems)
    scaleMax = Math.ceil(10 * Math.max(...foods.map((f) => f.value / total))) / 10 // to 1 significant figure

    initial = $farm.initialState[data.key]

    delta = total - initial.total
    deltaPercent = delta / initial.total
  }
</script>

<div class="block-impact block">
  <h2 class="block-title flex align-center">
    <AnimatedIcon name={type} />
    <span>{data.title}</span>
    <DivergingBar
      showValue
      datum={0}
      value={deltaPercent}
      scale={Math.ceil(Math.abs(deltaPercent))}
    />
  </h2>
  <div class="block-overview flex align-center">
    <div class="big-number">
      <Number isPercent showSign value={deltaPercent} />
    </div>
    <div class="block-summary">
      {#key delta === 0}
        <div in:fade>
          {#if delta === 0}
            You have not changed your <span class="lowercase">{data.name ?? data.title}</span> since
            you started farming.
          {:else}
            You have {delta > 0 ? "increased" : "decreased"} your
            <span class="lowercase">{data.name ?? data.title}</span>
            by <Number value={Math.abs(delta)} />
            {units} since you started farming.
          {/if}
        </div>
      {/key}
    </div>
  </div>
  {#if foods.length}
    <div class="by-food">
      <div class="by-food-chart-title label-caps">Major food contributors</div>
      <div class="by-food-grid">
        {#each foods as { value, count, food } (food.id)}
          <div transition:fade animate:flip={{ easing }} class="bar-chart-item">
            <div class="bar-item-bar text-{food.colorId} ">
              <Progress
                isPercent
                max={scaleMax}
                showLabels={false}
                value={value / total}
                backgroundCurrentColor
              >
                <div class="bar-label flex align-center" slot="label">
                  <div class="food-item-avatar flex-center bg-{food.colorId}">{count}</div>
                  <span>{food.name}</span>
                </div>
              </Progress>
            </div>
            <span>
              <span class="label" />
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="sass">
.block-impact
  background: var(--color-primary-1)

.block-title
  gap: 0.25em

.block-overview
  .big-number
    margin-right: 0.25em
    text-align: right
  .block-summary
    font-size: 0.5rem

.by-food-grid
  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 0.25em 0.75em
  font-size: 0.875rem

.by-food-chart-title
  margin-bottom: 0.75em

.bar-chart-item
  flex: 1
  display: flex
  flex-direction: column
  gap: 0.25em

.food-item-avatar
  font-size: 0.4375rem
  width: 1.75em
  height: 1.75em
  line-height: 0
  font-weight: bold
  color: var(--color-secondary-1)

.bar-label
  gap: 0.1875rem

</style>
