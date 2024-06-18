import {GroupModel} from "../group-model"

export interface IUser {
    id: number
    firstName: string
    lastName: string
    firstGroupUrl: string
    wsToken: string
    color: string
    groups: GroupModel[]
}
