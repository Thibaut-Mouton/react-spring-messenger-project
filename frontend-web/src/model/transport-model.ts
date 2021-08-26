import {TransportActionEnum} from "../utils/transport-action-enum";

export class TransportModel {

    private userId: number;

    private action: TransportActionEnum;

    private wsToken: string | undefined;

    private groupUrl: string | undefined;

    private message: string | undefined;

    constructor(userId: number, action: TransportActionEnum, wsToken?: string, groupUrl?: string, message?: string) {
        this.userId = userId;
        this.action = action;
        this.wsToken = wsToken;
        this.groupUrl = groupUrl;
        this.message = message;
    }
}