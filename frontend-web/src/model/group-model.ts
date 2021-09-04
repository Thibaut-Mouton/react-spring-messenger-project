export class GroupModel {

    public id: number;

    public url: string;

    public name: string;

    public groupType: string;

    public lastMessage: string;

    public lastMessageDate: string;

    public lastMessageSeen: boolean;

    public lastMessageSender: string;

    constructor(id: number, url: string, name: string, groupType: string, lastMessage: string, lastMessageDate: string, iLastMessageSeen: boolean, lastMessageSender: string) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.groupType = groupType;
        this.lastMessage = lastMessage;
        this.lastMessageDate = lastMessageDate;
        this.lastMessageSeen = iLastMessageSeen;
        this.lastMessageSender = lastMessageSender;
    }
}