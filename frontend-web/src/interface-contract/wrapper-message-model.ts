import { FullMessageModel } from "./full-message-model"

export interface WrapperMessageModel {
	lastMessage: boolean
	messages: FullMessageModel[]
}
