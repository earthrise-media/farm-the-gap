export const guide = [
  {
    id: 0,
    icon: "water",
    title: "Make your first move",
    message: "Select a new food item from the top menu and swap it with a food on your farm.",
    task: (gameState) => gameState.year.current > gameState.year.start,
    target: "#food-menu-wrapper .group-plant",
    next: 1,
    onEnter: () => {},
    onDismiss: () => {}
  },
  {
    id: 1,
    icon: "water",
    title: "Monitor your farm statistics",
    message: "Notice how  a new food item from the menu and swap it with a food on your farm.",
    button: "Dismiss",
    target: "#food-menu-wrapper .group-plant button",
    onEnter: () => {},
    onDismiss: () => {}
  }
]
