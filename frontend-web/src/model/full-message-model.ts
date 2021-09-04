export class FullMessageModel {
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

    constructor(id: number, type: string, message: string, userId: number, groupId: number, groupUrl: string, sender: string, time: string, initials: string, color: string, name: string, fileUrl: string, isMessageSeen: boolean, lastMessage: boolean) {
        this.id = id;
        this.type = type;
        this.message = message;
        this.userId = userId;
        this.groupId = groupId;
        this.groupUrl = groupUrl;
        this.sender = sender;
        this.time = time;
        this.initials = initials;
        this.color = color;
        this.name = name;
        this.fileUrl = fileUrl;
        this.lastMessage = lastMessage;
        this.isMessageSeen = isMessageSeen;
    }
}