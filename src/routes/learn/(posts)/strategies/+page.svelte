<script lang="ts">
  import {
    landPerUnitCrop,
    productionStrategies,
    consumptionStrategies,
    type TimeseriesData
  } from "./data"
  import LineChart from "$lib/components/LineChart.svelte"
  import StrategyCards from "./StrategyCards.svelte"
</script>

<p>
  Historically, feeding our growing population has hinged on boosting production levels and
  increasing efficiency – that is, reducing the input resources needed to produce a certain output
  yield.
</p>

<p>
  Today, we are able to grow the same quantity of crops using only one-fourth of the land that was
  needed in 1961:
</p>

<!-- <figure class="bg-primary-1 text-secondary-2"> -->
<figure>
  <div class="figure-title">Land needed to produce a fixed quantity of crops</div>
  <div class="figure-subtitle label">
    Shows improved land efficiency from 1961 to 2020. Land per crop quantity calculated by dividing
    arable land by the crop production index (1961 = 1).
  </div>
  <LineChart
    labels
    isDark
    xLabels={[1961, 2020]}
    yMax={1}
    yLimit={1}
    yDatum={0}
    showEndPointValue
    endPointValuePrecision={2}
    data={landPerUnitCrop.map(({ v }) => v)}
  ></LineChart>
  <figcaption class="label">
    Source: Food and Agriculture Organization of the UN – processed by <a
      href="https://ourworldindata.org/grapher/arable-land-pin?time=earliest..latest"
      target="_blank">Our World in Data &nearr;</a
    >
  </figcaption>
</figure>

<p>
  However, over the same time period, we have expanded our agrigultural footprint by 490 million
  hectares – an area 1.5 times the size of India.<sup
    ><a
      href="https://ourworldindata.org/grapher/total-agricultural-area-over-the-long-term?time=1820..latest&country=~OWID_WRL"
      target="_blank">1</a
    ></sup
  >
</p>

<p>
  With finite land, a changing climate, and diminishing returns from improved farming techniques,
  feeding the future will require more than just increasing outputs.
</p>

<h3>Strategies to increase production</h3>

<StrategyCards cards={productionStrategies} />

<h3>Strategies to shift consumption</h3>

<StrategyCards cards={consumptionStrategies} />

<h3>It's not "either/or"</h3>

<p>
  Technological breakthroughs will undeniably contribute, but a combination of increased efficiency
  with thoughtful, smarter consumption that will feed our future sustainably. What we decide to eat
  will shape what we produce and what landscapes and water we save.
</p>
