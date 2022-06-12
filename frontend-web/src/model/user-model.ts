import { GroupModel } from './group-model';

export default class UserModel {
  public id: number

  public username: string

  public wsToken: string

  public firstGroupUrl: string

  public groups: GroupModel[]

  constructor (id: number, username: string, wsToken: string, firstGroupUrl: string, groups: GroupModel[]) {
      this.id = id;
      this.username = username;
      this.wsToken = wsToken;
      this.firstGroupUrl = firstGroupUrl;
      this.groups = groups;
  }
}
