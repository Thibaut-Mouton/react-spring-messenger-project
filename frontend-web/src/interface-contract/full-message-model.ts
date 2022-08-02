export interface FullMessageModel {
	id: number
	type: string
	message: string
	userId: number
	groupId: number
	groupUrl: string
	sender: string
	time: string
	initials: string
	color: string
	name: string
	fileUrl: string
	lastMessage: boolean
	isMessageSeen: boolean
}
