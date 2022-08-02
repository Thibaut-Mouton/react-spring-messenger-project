import { Action } from "@reduxjs/toolkit"
import { Dispatch, MiddlewareAPI } from "redux"

export const logger = (store: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
	// console.log('dispatching', action)
	// console.log('next state', store.getState())
	return next(action)
}
