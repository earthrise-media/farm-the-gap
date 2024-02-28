<script>
  import { footprints } from "./data"

  import Number from "$lib/components/Number.svelte"
  import ChartPie from "$lib/components/ChartPie.svelte"
  import ChartWaffle from "$lib/components/ChartWaffle.svelte"
  import ChartStackedBar from "$lib/components/ChartStackedBar.svelte"

  const colors = ["#00827E", "#edaf00", "#fc6e91", "#ed4752"]
  const colorClasses = ["bg-primary-1", "bg-plant-8", "bg-animal-3", "bg-animal-1"]
</script>

<p>
  It's important to remember that diet is profoundly shaped by culture, tradition, and economic
  forces. Yet, food choices carry global implications our planet's resources. Data reveals
  significant disparity in the 'food footprint' of different nations: the land, water, and
  greenhouse gas emissions required to sustain different lifestyles.
</p>

<p>
  Compared to the global average, the average US diet requires double the agricultural land and
  generates twice the emissions per person. Animal-based foods, especially beef, drive this
  difference. For instance, in an average US diet, beef provides just 5% of the calories but
  accounts for 50% of the resources used:
</p>

<figure class="figure-diet-compare">
  <div class="figure-title">The US diet is twice as resource-intensive as the global average</div>
  <div class="figure-subtitle label">
    Per-capita values, 2009. Charts adapted from <a
      href="https://files.wri.org/d8/s3fs-public/Shifting_Diets_for_a_Sustainable_Food_Future_1.pdf"
      target="_blank">World Resources Institute &nearr;</a
    >.
  </div>
  <legend class="flex">
    {#each footprints[0].calories as { label }, i}
      <div class="legend-item bold text-secondary-1 {colorClasses[i]}">
        {label}
      </div>
    {/each}
  </legend>
  <div class="comparative-charts-wrap flex justify-between">
    {#each footprints as o}
      <div class="country-column flex-col flex-1">
        <div class="country-column-title bold">{o.title}</div>
        <div class="flex justify-between">
          <div class="label bold">
            Daily calories consumed<br /><span class="text-primary-3"
              ><Number value={o.totals.calories} />&thinsp;cal</span
            >
          </div>
          <div class="pie-wrap flex-1">
            <ChartPie
              title="Calories"
              data={o.calories.map((o) => o.value)}
              color={colors}
              label={false}
            />
          </div>
        </div>
        <div class="flex justify-between">
          <div class="label bold">
            Land use<br /><span class="text-primary-3">{o.totals.landUse}&thinsp;ha</span>
          </div>
          <ChartWaffle data={o.landUse.map((o) => o.value)} {colorClasses} />
        </div>
        <div class="flex justify-between">
          <div class="label bold">
            Emissions
            <br />
            <span class="text-primary-3"
              ><Number value={o.totals.emissions} />&thinsp;kgCO<sub>2</sub>eq</span
            >
          </div>
          <ChartStackedBar
            height="2.5rem"
            max={1.5}
            nTicks={6}
            data={o.emissions.map((o) => o.value)}
            {colorClasses}
          />
        </div>
      </div>
    {/each}
  </div>
  <figcaption class="label">
    Emissions shows emissions from agricultural production only and does not include emissions from
    land-use change. "US" data includes both United States and Canada. “Other animal-based foods”
    includes pork, poultry, eggs, fish (aquatic animals), sheep, and goat.
  </figcaption>
</figure>

<p>
  Crucially, dietary transitions aren't about dictating what the world's most vulnerable populations
  can eat. The emphasis falls on populations consuming excess calories, protein, and those heavily
  reliant on resource-intensive foods like beef. These changes also don't mean eliminating
  livestock. In many locations, small farmers rely on sustainable animal agriculture traditions for
  both livelihood and local food security.
</p>

<p>
  High-consuming nations – those with diets consistently exceeding both recommended caloric and
  protein intakes – hold major responsibility and potential for change. Adjustments in developing
  nations are less about restriction, and more about guiding the rising affluence towards
  sustainable consumption. Supporting sustainable local production methods is crucial as well.
</p>

<p>
  To address the food gap, we must understand our food footprint in a global context and make smart
  choices with equity, growth, and sustainability front of mind.
</p>

<style lang="sass">
@import "src/styles/vars/screens.sass"

legend
  gap: 0.25rem
  margin: 1.5rem 0
  font-size: 0.75rem
    
.legend-item
  border-radius: 0.25rem
  padding: 0.125rem 0.5rem

.comparative-charts-wrap
  gap: 4rem

  .label
    min-width: 11.5ch
    width: 11.5ch

  .country-column
    display: flex
    flex-direction: column
    gap: 2rem

    > .flex
      gap: 0.5rem

  .country-column-title
    margin-bottom: -1.5rem

  .pie-wrap
    position: relative

figcaption
  margin-top: 3.5rem

@media (min-height: 700px) and (min-width: 1500px)

  legend
    font-size: 0.625rem

  .comparative-charts-wrap
    gap: 2rem

@media (max-width: $screen-sm)

  .comparative-charts-wrap
    gap: 1rem
    .country-column
      > .flex
        flex-direction: column
</style>
