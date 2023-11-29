export const milestones = [
  {
    id: "milestone-1",
    icon: "land",
    title: "10 year milestone!",
    trigger: (gameState) => gameState.year.current === gameState.year.start + 10,
    message:
      "Congratulations, you've made it to 10 years! You've been doing a great job so far, but the population is growing and you'll need to keep up the good work to feed everyone.",
    button: "Dismiss"
  }
]
