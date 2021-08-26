import {TransportActionEnum} from "../utils/transport-action-enum";

export class OutputTransportDTO {

    action: TransportActionEnum;

    object: object;

    constructor(action: TransportActionEnum, object: object) {
        this.action = action;
        this.object = object;
    }
}