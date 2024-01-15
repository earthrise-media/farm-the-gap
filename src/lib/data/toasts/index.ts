import { tips } from "./tips"
import { guide } from "./guide"
import { milestones } from "./milestones"
import type { Toast } from "./types"

export const toasts: Toast[] = [...guide, ...milestones, ...tips]
