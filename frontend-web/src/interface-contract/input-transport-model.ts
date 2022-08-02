import { TransportActionEnum } from "../utils/transport-action-enum"

export class OutputTransportDTO {
  public action: TransportActionEnum

  public object: object

  constructor (action: TransportActionEnum, object: object) {
    this.action = action
    this.object = object
  }
}
