import { IUser } from "./user-model"
import { IGroupWrapper } from "./group-wrapper-model"

export interface IUserWrapper {
  user: IUser
  groupsWrapper: IGroupWrapper[]
}
