<script lang="ts">
  import Progress from "$lib/components/Progress.svelte"
  import { foodItems } from "$lib/data/foods"
  import FoodprintBarChart from "./FoodprintBarChart.svelte"

  const foods = foodItems.filter((o) => ["🐄", "🐓", "🫘", "🥜"].includes(o.emoji))

  const charts = {
    land: {
      title: "Land use per 100 grams of protein",
      subtitle: "Land measured in m<sup>2</sup>",
      unit: "m²",
      fv: (f: Food) => (100 * f.landPerKg) / f.proteinRatio
    },
    water: {
      title: "Water use per 100 grams of protein",
      subtitle: "Water measured in liters",
      unit: "L",
      fv: (f: Food) => (100 * f.waterPerKg) / f.proteinRatio
    },
    eutrophy: {
      title: "Water eutrophy per 100 grams of protein",
      subtitle: "Water measured in liters",
      unit: "L",
      fv: (f: Food) => (100 * f.eutrophyPerKg) / f.proteinRatio
    },
    emissions: {
      title: "Emissions per 100 grams of protein",
      subtitle: "Greenhouse gas emissions measured in kgCO<sub>2</sub>eq",
      unit: "kgCO₂eq",
      fv: (f: Food) => (100 * f.ghgPerKg) / f.proteinRatio
    }
  }
</script>

<div class="emoji-block flex-center text-2xl">
  {#each foods as { emoji, name }}
    <div class="flex-col">
      <span>{emoji}</span>
      <span class="label">{name}</span>
    </div>
  {/each}
</div>

<p class="label text-center">
  (Peanuts are technically legumes, but for simplicity we group them together in the Nuts category)
</p>

<h2>Land use</h2>

<p>
  Half the world's habitable land is used to feed humans. Beef (and other grazing animals) is a
  highly inefficient converter of land to protein because of the vast area needed for grazing and
  growing feed crops. It requires 30 times the land per gram of protein as poultry and nearly 20
  times that of legumes.
</p>

<p>
  This is important because clearing more forests to meet future demands could accelerate
  biodiversity loss, degrade soil health, intensify flood/drought risk, and contribute to climate
  change through carbon release.
</p>

<FoodprintBarChart {foods} {...charts.land} />

<hr class="spacer" />

<h2>Water use and water pollution</h2>

<p>
  Agriculture is responsible for 70% of freshwater withdrawals and 78% of ocean and freshwater
  pollution globally. Nuts are particularly thirsty: some almond varieties need about four liters
  per nut! In water-stressed California, where 80% of the world's almonds are grown, this has
  significant environmental and economic implications.
</p>

<p>
  Beef is close behind, requiring more than the average person uses for showering in a week per 100g
  of protein. In contrast, legumes are remarkably water efficient. Eating more water-efficient
  proteins is important because water-intensive agriculture intensifies scarcity, diminishes healthy
  rivers and lakes, and pollutes crucial waterways through fertilizer and pesticide runoff.
</p>

<FoodprintBarChart {foods} {...charts.water} />

<hr class="spacer" />

<h2>Greenhouse gas emissions</h2>

<p>
  Agriculture accounts for a 26% of global greenhouse gas emissions. Methane, with roughly 80 times
  the global warming potential of CO2 over a 20-year period, underscores the serious climate
  challenges posed by ruminants – methane-emitting animals like cattle and sheep.
</p>

<p>
  What we eat is more important than where it's from. Emissions from transport, processing, and
  packaging are often dwarfed by deforestation driven by agriculture, fertilizer use, methane
  emissions, and food waste. Across most foods – both plant and animal – these factors typically
  account for over 50% of total supply-chain emissions.
</p>

<FoodprintBarChart {foods} {...charts.emissions} />

<hr class="spacer" />

<h3>Conclusion</h3>

<p>
  Legumes are an efficient protein source, boasting the lowest emissions, water use, and land
  requirements. Integrate more beans, lentils, and peas into your diet for a lower footprint. Nuts,
  despite their water needs, hold advantages over animal proteins when it comes to land use and are
  almost carbon-neutral. Although animal proteins underperform environmentally, the disparity
  between poultry and beef is vast – the decision of <em>which</em> meat is important.
</p>

<p class="bold">
  To learn more about what to eat, read <a href="/learn/diet-types"
    >Which diets are best for the planet?</a
  >
</p>

<figure class="label">
  <div><b>Sources</b></div>
  <a href="https://ourworldindata.org/grapher/food-emissions-supply-chain" target="_blank"
    >Greenhouse gas emissions across the food chain</a
  > (Our World in Data)
</figure>

<style lang="sass">
.emoji-block
  gap: 0.75rem
  font-weight: bold
  margin: 3rem auto
</style>
