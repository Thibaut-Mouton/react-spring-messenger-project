import { FullMessageModel } from "./full-message-model"

export interface WrapperMessageModel {
	lastMessage: boolean
	activeCall: boolean
	callUrl: string
	messages: FullMessageModel[]
	groupName: string
}
