import { get } from "svelte/store"
import { gameSettings } from "$lib/stores/state"

import type { GameState } from "$lib/stores/models/Game"

const $gameSettings = get(gameSettings)

export const milestones = [
  {
    id: "tip-1",
    img: "guide.png",
    title: "Undo your moves",
    trigger: (gameState: GameState) => gameState.year.current === gameState.year.start + 3,
    target: "header .button-undo",
    message: `Did you know you can use this button to undo your last move? You have up to ${$gameSettings.undoLimit} undos per game, so use them wisely!`,
    button: "Dismiss"
  }
]
