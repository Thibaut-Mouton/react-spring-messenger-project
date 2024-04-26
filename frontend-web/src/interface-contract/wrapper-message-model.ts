import { FullMessageModel } from "./full-message-model"

export interface WrapperMessageModel {
	lastMessage: boolean
	isActiveCall: boolean
	callUrl: string
	messages: FullMessageModel[]
	groupName: string
}
