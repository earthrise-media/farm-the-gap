<script lang="ts">
  import { foodItems } from "$lib/data/foods"

  import FoodIcon from "$lib/components/FoodIcon.svelte"
  import FoodprintBarChart from "./FoodprintBarChart.svelte"

  const foods = foodItems.filter((o) => ["🐄", "🐓", "🐖", "🫘", "🥜", "🍞"].includes(o.emoji))

  const charts = {
    land: {
      title: "Land use per 100g of protein",
      subtitle: "Land measured in m<sup>2</sup>",
      callouts: foodItems.filter((o) => o.emoji === "🐓" || o.emoji === "🐖"),
      caption:
        "*The land efficiency of poultry and pork depends largely on living conditions. Land efficiency can come at a significant cost to animal welfare. Almost all the chickens consumed in the United States come from factory farms – massive, concentrated, enclosed chicken sheds. To learn more about this, visit <a target='_blank' href='https://stories.theplotline.org/cafo-explorer/'>The Plotline's CAFO Explorer &nearr;</a>.",
      unit: "m²",
      fv: (f: Food) => (100 * f.landPerKg) / f.proteinRatio
      // fv: (f: Food) => 1 / ((f.yieldPerHa / 10000) * (100 * f.proteinRatio))
    },
    water: {
      title: "Water use per 100g of protein",
      subtitle: "Water measured in liters",
      unit: "L",
      fv: (f: Food) => (100 * f.waterPerKg) / f.proteinRatio
    },
    eutrophy: {
      title: "Water eutrophy per 100g of protein",
      subtitle: "Water measured in liters",
      unit: "L",
      fv: (f: Food) => (100 * f.eutrophyPerKg) / f.proteinRatio
    },
    emissions: {
      title: "Emissions per 100g of protein",
      subtitle: "Greenhouse gas emissions measured in kgCO<sub>2</sub>eq",
      unit: "kgCO₂eq",
      fv: (f: Food) => (100 * f.ghgPerKg) / f.proteinRatio
    }
  }
</script>

<div class="emoji-block flex-center text-2xl">
  {#each foods as food}
    <div class="flex-col">
      <FoodIcon {food} />
      <span class="label">{food.name}</span>
    </div>
  {/each}
</div>

<p class="label text-center">
  Peanuts are technically legumes, but for clarity we categorise them under Nuts. Legumes include
  foods like beans, lentils, and peas.
</p>

<h2>Land use</h2>

<p>
  Half the world's habitable land is used to feed humans. Beef and other grazing animals are highly
  inefficient converters of land to protein because of the vast area needed for grazing and growing
  feed crops. Beef requires over 50 times the land per gram of protein as wheat, 30 times more than
  poultry and nearly 20 times more than legumes.
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
  Beef is similar, requiring more water than the average person uses for showering in a week per
  100g of protein. In contrast, legumes are remarkably water efficient. Eating more water-efficient
  proteins is important because water-intensive agriculture intensifies drought, diminishes healthy
  rivers and lakes, and pollutes crucial waterways through fertilizer and pesticide runoff.
</p>

<FoodprintBarChart {foods} {...charts.water} />

<hr class="spacer" />

<h2>Greenhouse gas emissions</h2>

<p>
  Agriculture accounts for a 26% of global greenhouse gas emissions. Methane, with roughly 80 times
  the global warming potential of CO2 over a 20-year period, underscores the climate challenges
  posed by ruminant animals – methane-burpers like cattle and sheep.
</p>

<p>
  What we eat is more important than where it's from. Emissions from transport, processing, and
  packaging are often dwarfed by deforestation driven by agriculture, fertilizer use, methane
  emissions, and food waste. Across most foods – both plant and animal – these factors typically
  account for over 50% of total supply-chain emissions.<sup
    ><a href="https://ourworldindata.org/grapher/food-emissions-supply-chain" target="_blank">1</a
    ></sup
  >
</p>

<FoodprintBarChart {foods} {...charts.emissions} />

<hr class="spacer" />

<h3>Conclusion</h3>

<p>
  Legumes and whole wheat are efficient protein sources, boasting low emissions, water use, and land
  requirements. Nuts, despite their water needs, are almost carbon-neutral. The disparity of pork
  and poultry compared to beef is vast – the decision of <em>which</em> animal proteins you choose to
  eat is critical.
</p>

<style lang="sass">
.emoji-block
  gap: 0.75rem
  font-weight: bold
  margin: 3rem auto
</style>
