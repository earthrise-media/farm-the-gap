import type { GameState, UserState, GameSettings } from "$lib/stores/models/Game"

type ToastType = "milestone" | "guide" | "warning" | "quote" | "tip"

export type CallBackProps = {
  farm: Farm
  userState: UserState
  gameState: GameState
  gameSettings: GameSettings
  successMetrics: SuccessMetrics
}

export type Toast = {
  id: string | number
  type: ToastType
  title: string
  message: string
  img?: string
  icon?: string
  button?: string
  target?: string
  next?: string | number
  mobileTarget?: string
  mobilePosition?: "top left" | "top right" | "bottom left" | "bottom right"
  task?: (props: CallBackProps) => boolean
  trigger?: (props: CallBackProps) => boolean
  onEnter?: (props: CallBackProps) => void
  onDismiss?: (props: CallBackProps) => void
}
