export class MessageModel {

    public userId: number | string | undefined;

    public groupUrl: string | null;

    public message: string;

    constructor(userId: number | string | undefined, groupUrl: string | null, message: string) {
        this.userId = userId;
        this.groupUrl = groupUrl;
        this.message = message;
    }
}