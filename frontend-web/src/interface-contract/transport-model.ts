import {TransportActionEnum} from "../utils/transport-action-enum"
import {TypeMessageEnum} from "../utils/type-message-enum"

export class TransportModel {
    private userId: number

    private action: TransportActionEnum

    private wsToken: string | undefined

    private groupUrl: string | undefined

    private message: string | undefined

    private messageType: TypeMessageEnum | undefined

    private messageId: number | undefined

    constructor(userId: number, action: TransportActionEnum, wsToken?: string, groupUrl?: string, message?: string, messageType?: TypeMessageEnum, messageId?: number) {
        this.userId = userId
        this.action = action
        this.wsToken = wsToken
        this.groupUrl = groupUrl
        this.message = message
        this.messageType = messageType
        this.messageId = messageId
    }
}
