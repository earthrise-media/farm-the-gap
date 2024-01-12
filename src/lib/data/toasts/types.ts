import type { GameState, UserState } from "$lib/stores/models/Game"

type ToastType = "milestone" | "guide" | "warning" | "quote"

export type CallBackProps = {
  farm: Farm
  userState: UserState
  gameState: GameState
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
  next?: number
  task?: (props: CallBackProps) => boolean
  trigger?: (props: CallBackProps) => boolean
  onEnter?: (props: CallBackProps) => void
  onDismiss?: (props: CallBackProps) => void
}
