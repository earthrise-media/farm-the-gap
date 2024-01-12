import type { GameState } from "$lib/stores/models/Game"

export type ToastType = "milestone" | "guide" | "warning" | "quote"
export type Toast = {
  id: string | number
  type: ToastType
  title: string
  message: string
  img?: string
  icon?: string
  button?: string
  target?: string
  next?: number
  task?: (gs: GameState) => boolean
  trigger?: (gs: GameState) => boolean
  onEnter?: () => void
  onDismiss?: () => void
}
