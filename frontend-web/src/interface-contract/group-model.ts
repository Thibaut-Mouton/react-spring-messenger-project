export interface GroupModel {
    id: number
    url: string
    name: string
    groupType: string
    lastMessage: string
    lastMessageDate: string
    lastMessageSeen: boolean
    lastMessageSender?: string
}
