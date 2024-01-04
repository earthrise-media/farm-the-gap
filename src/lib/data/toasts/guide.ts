import { get } from "svelte/store"
import { gameSettings, gameState, userState } from "$lib/stores/state"
import { prettyPercent } from "$lib/utils/written"
import { activeToastId } from "$lib/stores/toast"
import { once, qs } from "martha"

import type { GameState } from "$lib/stores/models/Game"
import { foodItems } from "../foods"

const $gameSettings = get(gameSettings)
const $gameState = get(gameState)

const avatar = (cid = 1, n = "", t = "animal") =>
  `<b class="food-item-avatar bg-${t}-${cid}">${n}</b>`

// const foodLabel = () => `<span class="inline-flex align-center bold">${avatar(6,"","plant")}&nbsp;Corn</span>`

export const guide = [
  {
    id: 0,
    img: "guide.png",
    title: "Welcome to the farm!",
    message: `Your job is to increase food production by ${prettyPercent($gameSettings.gap)} in ${
      $gameState.year.end - $gameState.year.start
    } years. Keep an eye on your progress and remaining moves here.`,
    button: "Next",
    target: "#dock",
    next: 1,
    onEnter: () => {},
    onDismiss: () => {}
  },
  {
    id: 1,
    img: "guide.png",
    title: "Your food inventory",
    // prettier-ignore
    message: `<p>These are the foods available to you. Close the food gap by swapping these with the foods on your global farm grid.</p><p>To maintain nutritional and market balance, you only have ${avatar(1,"3")} of each item to use. You must keep at least ${avatar(1,"1")} of each item on the farm at all times.</p>`,
    button: "Next",
    target: "#food-menu-wrapper",
    next: 2,
    onEnter: () => {},
    onDismiss: () => {}
  },
  {
    id: 2,
    img: "guide.png",
    title: "Key impact metrics",
    message:
      "Monitor your environmental impact and nutritional stats here. The population grows each year and it will be game over if you fail any metric. Be careful!",
    button: "Next",
    target: ".panel-1-3",
    next: 3,
    onEnter: () => {},
    onDismiss: () => {}
  },
  {
    id: 3,
    img: "guide.png",
    title: "Study the food table",
    message:
      "<p>This game uses real-world data.</p><p>Learn about the nutrition and resource-use of each food type in this table. The data per hectare may surprise you!</p><p>Sort by column to identify the most and least efficient foods. Your success depends on mastering this information.</p>",
    button: "Next",
    next: 4,
    target: ".food-items-grid",
    onEnter: () => {},
    onDismiss: () => {}
  },
  {
    id: 4,
    img: "guide.png",
    title: "Make your first move",
    // prettier-ignore
    message: `<p>You're ready to get started!</p><p>Click <span class="bg-primary-2 inline-flex align-center bold">${avatar(6,"","plant")}&nbsp;Corn</span> from your food inventory and replace it with <span class="bg-primary-2 inline-flex align-center bold">${avatar(2)}&nbsp;Lamb</span> on the farm grid.</p><p>Then watch how your key metrics change.</p>`,
    next: 5,
    target: ".button-group.group-plant button:nth-child(6)",
    onEnter: () => {
      once(qs(".button-group.group-plant button:nth-child(6)"), "click", () => {
        activeToastId.set(5)
      })
    },
    onDismiss: () => {}
  },
  {
    id: 5,
    img: "guide.png",
    title: "Finish your move",
    // prettier-ignore
    message: `Corn is selected. Now click on a <span class="bg-primary-2 inline-flex align-center bold">${avatar(2)}&nbsp;Lamb</span> cell on the farm grid to complete the swap.`,
    next: 6,
    target: "#land-grid",
    task: ($gameState: GameState) => $gameState.year.current > $gameState.year.start,
    onEnter: () => {
      userState.update(($u) => {
        $u.itemHighlighted = foodItems.find((f) => f.name === "Lamb") ?? null
        return $u
      })
    },
    onDismiss: () => {}
  },
  {
    id: 6,
    img: "guide.png",
    title: "You made your first move!",
    message:
      "Well done, you significantly increased the global calorie <em>and</em> protein supply with that move. Now it's over to you to close the rest of the food gap. Good luck!",
    button: "Close",
    onEnter: () => {
      userState.update(($u) => {
        $u.itemHighlighted = null
        return $u
      })
    },
    onDismiss: () => {}
  }
]
