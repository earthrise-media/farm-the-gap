import { get } from "svelte/store"
import { gameSettings, userState } from "$lib/stores/state"

import type { Toast } from "./types"

const $gameSettings = get(gameSettings)

export const tips: Toast[] = [
  {
    id: "tip-1",
    type: "tip",
    next: "tip-2",
    img: "guide.png",
    title: "Tip: Make a move",
    target: "#food-menu-wrapper",
    mobilePosition: "bottom right",
    message:
      "Click the buttons here to pick up a food item, then click a square on your farm to swap them.",
    button: "Next"
  },
  {
    id: "tip-2",
    type: "tip",
    next: "tip-3",
    img: "guide.png",
    title: "Tip: Undo your moves",
    target: "header .button-undo",
    mobileTarget: "#mobile-menu .button-undo",
    mobilePosition: "bottom right",
    message: `Did you know you can use this button to undo your last move? You have up to ${$gameSettings.undoLimit} undos per game, so use them wisely!`,
    button: "Next"
  },
  {
    id: "tip-3",
    type: "tip",
    next: "tip-4",
    img: "guide.png",
    target: ".food-items-grid",
    mobilePosition: "bottom right",
    title: "Tip: Optimise your land use",
    message:
      "The best foods to add are the ones that will give you the most calories per hectare. Swap them out with the lowest calorie per hectare foods you have on your farm.",
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
    },
    button: "Next"
  },
  {
    id: "tip-4",
    type: "tip",
    next: "tip-1",
    img: "guide.png",
    target: ".group-population",
    mobilePosition: "bottom right",
    title: "Tip: Monitor population growth",
    message:
      "The future needs a lot of food! Check how many additional people you could feed with your new farm allocations here.",
    button: "Next"
  }
]
