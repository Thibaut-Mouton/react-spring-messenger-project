import {Client} from "@stomp/stompjs";

export class ReduxModel {

    public client: Client | undefined

    public userToken: string | undefined

    public groupUrl: string | undefined

    public userId: number | undefined

    public message: string | undefined

    public messageId: number | undefined

    constructor(client?: Client, userToken?: string, groupUrl?: string, userId?: number, message?: string, messageId?: number) {
        this.client = client;
        this.userToken = userToken;
        this.groupUrl = groupUrl;
        this.userId = userId;
        this.message = message;
        this.messageId = messageId;
    }
}