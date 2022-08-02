export interface FeedbackModel {
  id?: string
  text: string
  alert: "warning" | "error" | "info" | "success"
  isOpen: boolean
}

export interface IPartialFeedBack {
  text: string
  alert: "warning" | "error" | "info" | "success"
  isOpen: boolean
}
