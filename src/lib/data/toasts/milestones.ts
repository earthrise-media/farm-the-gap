import type { GameState } from "$lib/stores/models/Game"

export const milestones = [
  {
    id: "milestone-5",
    img: "guide.png",
    type: "milestone",
    title: "5 year milestone!",
    trigger: (gameState: GameState) => gameState.year.current === gameState.year.start + 5,
    message: "Keep it going! Remember, your main focus is to increase calorie production.",
    button: "Dismiss"
  },
  {
    id: "milestone-10",
    img: "guide.png",
    type: "milestone",
    title: "10 year milestone!",
    trigger: (gameState: GameState) => gameState.year.current === gameState.year.start + 10,
    message:
      "Congratulations, you've made it to 10 years! You've been doing a great job so far, but the population is growing and you'll need to keep up the good work to feed everyone.",
    button: "Dismiss"
  },
  {
    id: "milestone-halfway",
    img: "guide.png",
    type: "milestone",
    title: "You're halfway there!",
    trigger: (gameState: GameState) => gameState.year.current === gameState.year.start + 10,
    message: "You are half way there! Keep it going, the world is depending on you.",
    button: "Dismiss"
  }
]

// Eat food. Not too much. Mostly plants. – Michael Pollan
// Each day, you have three votes to change the food system – Michael Pollan
// Whatever lofty things you might accomplish today, you will do them only because you first ate something that grew out of dirt – Barbara Kingsolver
