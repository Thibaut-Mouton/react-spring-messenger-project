import {TransportActionEnum} from "../utils/transport-action-enum";

export class TransportModel {

    private userId: number;

    private action: TransportActionEnum;

    private wsToken: string | undefined;

    private groupUrl: string | undefined;

    private message: string | undefined;

    private messageId: number | undefined;

    constructor(userId: number, action: TransportActionEnum, wsToken?: string, groupUrl?: string, message?: string, messageId?: number) {
        this.userId = userId;
        this.action = action;
        this.wsToken = wsToken;
        this.groupUrl = groupUrl;
        this.message = message;
        this.messageId = messageId;
    }
}