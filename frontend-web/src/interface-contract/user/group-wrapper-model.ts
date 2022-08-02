import { GroupModel } from "../group-model"
import { IGroupCall } from "./group-call-model"

export interface IGroupWrapper {
  group: GroupModel
  groupCall: IGroupCall
}
