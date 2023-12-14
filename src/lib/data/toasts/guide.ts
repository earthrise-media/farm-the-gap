import { get } from "svelte/store"
import { gameSettings, gameState } from "$lib/stores/state"
import { prettyPercent } from "$lib/utils/written"

const $gameSettings = get(gameSettings)
const $gameState = get(gameState)

export const guide = [
  {
    id: 0,
    img: "guide.png",
    title: "Welcome to the farm",
    message: `Your job is to increase food production by ${prettyPercent(
      $gameSettings.gap
    )} in the next ${
      $gameState.year.end - $gameState.year.start
    } years. Keep an eye on your progress here as you play.`,
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
    message:
      "These are the foods available to you. Close the food gap by swapping these with the foods on your global farm. To maintain nutritional and market balance, you only have <b class='food-item-avatar bg-animal-1'>3</b> of each item to use. You must keep at least <b class='food-item-avatar bg-animal-1'>1</b> of each item on the farm at all times.",
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
      "Monitor your impact and nutrition metrics here. Be careful – it's game over if you fail on any one of these!",
    button: "Next",
    target: ".block-game-state",
    next: 3,
    onEnter: () => {},
    onDismiss: () => {}
  },
  {
    id: 3,
    img: "guide.png",
    title: "Know your foods",
    message:
      "<p>This game is based on real-world data. Study the attributes of each food in this table. Some are more resource-intensive and nutritonally-beneficial than others, especially when compared on a per-hectare basis.</p><p>Use this table to inform your decisions – your success depends on mastering the balance of these properties.</p>",
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
    message:
      "Select <b>Corn</b> and replace it with <b>Lamb</b>. Watch how that impacts your key metrics.",
    task: (gameState) => gameState.year.current > gameState.year.start,
    next: 5,
    onEnter: () => {},
    onDismiss: () => {}
  },
  {
    id: 5,
    img: "guide.png",
    title: "You made your first move!",
    message:
      "Well done, you significantly increased the global calorie <em>and</em> protein supply with that move. Now it's over to you to close the food gap. Good luck!",
    button: "Close",
    onEnter: () => {},
    onDismiss: () => {}
  }
]
