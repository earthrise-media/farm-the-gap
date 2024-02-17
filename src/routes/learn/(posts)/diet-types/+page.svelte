<script lang="ts">
  import { dietsByEmissions } from "./data"

  import Progress from "$lib/components/Progress.svelte"
</script>

<p>
  Ruminant meats (beef, sheep and goat) are by far the most resource-intensive foods. Per gram of
  protein, ruminant meats require 18-20 times more land and generate 3-8 times more greenhouse gas
  emissions than pork and poultry. When compared to beans, lentils, and other plant-based proteins,
  they perform even worse.
</p>

<p>
  The table below compares the greenhouse gas mitigation potential of different diets. While
  veganism offers the largest reduction, plant-forward diets like flexitarian, pescatarian, and even
  'climate carnivore' — where 75% of red meat is replaced with other meat — provide roughly half
  that potential. This highlights the significant impact achievable through even modest dietary
  shifts.
</p>

<p>
  Another way to think about it – invite a friend to join you in a plant-forward diet and your
  impact will be comparable to going vegan alone.
</p>

<figure id="diets-by-emissions">
  <div>
    <h2 class="figure-title text-xl">
      Demand-side greenhouse gas mitigation potential of different diets
    </h2>
    <h4 class="figure-subtitle label">
      Measured in gigatonnes of CO<sub>2</sub> equivalents (GtCO<sub>2</sub>-eq) mitigated per year.
    </h4>
  </div>
  <div class="diet-items flex-col">
    {#each dietsByEmissions as diet, i}
      <div class="diet-item flex-col">
        <div class="bold">{diet.label}</div>
        <div class="label">{diet.summary}</div>
        <div class="progress-bar">
          <Progress
            value={diet.value}
            max={8}
            showLabels={!i}
            errorBars={diet.error}
            showValue={false}
          />
        </div>
      </div>
    {/each}
  </div>
  <figcaption class="label">
    Adapted from the IPCC’s <a
      href="https://www.ipcc.ch/srccl/chapter/chapter-5/5-5-mitigation-options-challenges-and-opportunities/5-5-2-demand-side-mitigation-options/5-5-2-1-mitigation-potential-of-different-diets/figure-5-12/"
      target="blank">Special Report on Climate Change and Land &nearr;</a
    >. Estimates indicate technical potential only and include additional effects of carbon
    sequestration from land-sparing. Data without error bars are from one study only.
  </figcaption>
</figure>

<p>
  The <em>World Resources Institute</em> found a similar result: capping protein for the entire
  population at 60g per day would have a greater environmental impact than a quarter of that
  population going fully vegetarian.<sup
    ><a
      target="_blank"
      href="https://files.wri.org/d8/s3fs-public/Shifting_Diets_for_a_Sustainable_Food_Future_1.pdf"
      >1</a
    ></sup
  >
</p>

<p>
  This underscores the power of plant-forward choices adopted by many. Ultimately, the best diet for
  the planet is fueled by the collective. Small changes you make can be multiplied by the masses.
</p>

<p>Even with food, less can be more!</p>

<figure class="text-primary-2 label">
  <b>A note on nutrients: </b>
  Plant proteins can be combined to get the full range of required amino acids and micronutrients (aside
  from B12). Focus on iron-rich options like lentils, leafy greens, or fortified foods, and ensure adequate
  B12 intake. Seeking guidance from a registered dietitian is wise for those with specific dietary requirements
  or concerns.
</figure>

<style lang="sass">
  #diets-by-emissions
    .diet-items
      gap: 1rem

    .progress-bar
      font-size: 0.875rem
      margin-top: 0.25rem
</style>
