import { Action } from "@reduxjs/toolkit"
import { Dispatch, MiddlewareAPI } from "redux"

// You can uncomment for debug purpose
export const logger = (store: MiddlewareAPI) => (next: Dispatch) => (action: Action): Action => {
  console.log("dispatching", action)
  console.log("next state", store.getState())
  return next(action)
}
