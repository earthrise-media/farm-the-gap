import { get } from "svelte/store"
import { gameSettings, gameState, userState } from "$lib/stores/state"
import { prettyPercent } from "$lib/utils/written"

import type { Toast } from "./types"
import { foodItems } from "../foods"
import { qs } from "martha"

const $gameSettings = get(gameSettings)
const $gameState = get(gameState)

const avatar = (cid = 1, n = "", t = "animal") =>
  `<b class="food-item-avatar bg-${t}-${cid}">${n}</b>`

export const guide: Toast[] = [
  {
    id: 0,
    img: "guide.png",
    type: "guide",
    title: "Welcome to the farm!",
    message: `Your job is to increase food production by ${prettyPercent($gameSettings.gap)} in ${
      $gameState.year.end - $gameState.year.start
    } years. Keep an eye on your progress and remaining moves here.`,
    button: "Next",
    target: "#dock",
    next: 1
  },
  {
    id: 1,
    img: "guide.png",
    type: "guide",
    title: "Your food inventory",
    // prettier-ignore
    message: `<p>These are the foods available to you. Close the food gap by swapping these with the foods on your global farm grid.</p><p>To maintain nutritional and market balance, you only have ${avatar(1,"4")} of each item to use. You must keep at least one of each item on the farm at all times.</p>`,
    button: "Next",
    target: "#food-menu-wrapper",
    next: 2
  },
  {
    id: 2,
    img: "guide.png",
    type: "guide",
    title: "Key impact metrics",
    message:
      "Monitor your environmental impact and nutritional stats here. The population changes with each move and it will be game over if you fail on any metric. Be careful!",
    button: "Next",
    target: ".panel-game-state",
    mobilePosition: "bottom right",
    next: 3
  },
  {
    id: 3,
    img: "guide.png",
    type: "guide",
    title: "Study the food table",
    message:
      "<p>This game uses real-world data.</p><p>Learn about the nutrition and resource-use of each food type in this table. The data per hectare may surprise you!</p><p>Sort by column to identify the most and least efficient foods. Your success depends on mastering this information.</p>",
    button: "Next",
    next: 4,
    mobilePosition: "bottom right",
    target: ".food-items-grid",
    onEnter: () => {
      userState.update(($u) => {
        $u.isMobileTablesOpen = true
        return $u
      })
    },
    onDismiss: () => {
      userState.update(($u) => {
        $u.isMobileTablesOpen = false
        return $u
      })
    }
  },
  {
    id: 4,
    img: "guide.png",
    type: "guide",
    title: "Make your first move",
    // prettier-ignore
    message: `<p>You're ready to get started!</p><p>Click <span class="bold">🌽&nbsp;Corn</span> in your food inventory and replace it with <span class="bold">🐏&nbsp;Lamb</span> on the farm grid.</p><p>Then watch how your key metrics change.</p>`,
    next: 5,
    target: "#food-menu-wrapper [data-food-name='Corn']",
    task: ({ userState }) => userState.itemSelectedForSwap?.name === "Corn",
    onEnter: () => {
      qs("#food-menu-wrapper [data-food-name='Corn']").scrollIntoView()
    },
    onDismiss: () => {}
  },
  {
    id: 5,
    img: "guide.png",
    type: "guide",
    title: "Finish your move",
    // prettier-ignore
    message: `Corn is selected. Now click on a <span class="bold">🐏&nbsp;Lamb</span> cell on the farm grid to complete the swap.`,
    next: 6,
    target: "#land-grid",
    task: ({ gameState }) => gameState.year.current > gameState.year.start,
    onEnter: () => {
      userState.update(($u) => {
        $u.itemSelectedForSwap = foodItems.find((f) => f.name === "Corn") ?? null
        $u.itemHighlighted = foodItems.find((f) => f.name === "Lamb") ?? null
        return $u
      })
    }
  },
  {
    id: 6,
    img: "guide.png",
    type: "guide",
    title: "You made your first move!",
    message:
      "Well done, you significantly increased total food production with that move. You are already feeding an additional 550M people! Now it's over to you to close the rest of the food gap. Good luck!",
    button: "Close",
    task: ({ gameState }) => gameState.year.current > gameState.year.start + 1,
    onEnter: () => {
      userState.update(($u) => {
        $u.itemHighlighted = null
        return $u
      })
    }
  }
]
