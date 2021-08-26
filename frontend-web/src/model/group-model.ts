export class GroupModel {

    public id: number;

    public url: string;

    public name: string;

    public groupType: string;

    public lastMessage: string;

    public lastMessageDate: string;

    public isLastMessageSeen: boolean;

    constructor(id: number, url: string, name: string, groupType: string, lastMessage: string, lastMessageDate: string, iLastMessageSeen: boolean) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.groupType = groupType;
        this.lastMessage = lastMessage;
        this.lastMessageDate = lastMessageDate;
        this.isLastMessageSeen = iLastMessageSeen;
    }
}