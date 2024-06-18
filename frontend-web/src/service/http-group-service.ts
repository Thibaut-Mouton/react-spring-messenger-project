import {AxiosResponse} from "axios"
import {GroupModel} from "../interface-contract/group-model"
import {IUserWrapper} from "../interface-contract/user/user-wrapper"
import {JwtModel} from "../interface-contract/jwt-model"
import {IUser} from "../interface-contract/user/user-model"
import {GroupUserModel} from "../interface-contract/group-user-model"
import {HttpMainService} from "./http-main.service"
import {Csrf} from "../interface-contract/csrf/csrf.type"
import {FullTextSearchResponseType} from "../interface-contract/search-text/search-text.type"

export class HttpGroupService extends HttpMainService {

    public constructor() {
        super()
    }

    public getCsrfToken(): Promise<AxiosResponse<Csrf>> {
        return this.instance.get("csrf")
    }

    public authenticate(jwtModel: JwtModel): Promise<AxiosResponse<IUser>> {
        return this.instance.post("auth", jwtModel)
    }

    public async pingRoute(): Promise<AxiosResponse<IUserWrapper>> {
        return this.instance.get("fetch")
    }

    public async ensureRoomExists(roomId?: string): Promise<AxiosResponse<boolean>> {
        return this.instance.get(`room/ensure-room-exists/${roomId}`)
    }

    public logout(): Promise<AxiosResponse> {
        return this.instance.get("logout")
    }

    public createGroup(groupName: string): Promise<AxiosResponse<GroupModel>> {
        return this.instance.post("create", {name: groupName})
    }

    public addUserToGroup(userId: number | string, groupUrl: string): Promise<AxiosResponse> {
        return this.instance.get("user/add/" + userId + "/" + groupUrl)
    }

    public fetchAllUsersInConversation(groupUrl: string): Promise<AxiosResponse<GroupUserModel[]>> {
        return this.instance.get(`users/group/${groupUrl}`)
    }

    public fetchAllUsersWithoutAlreadyInGroup(groupUrl: string): Promise<AxiosResponse<GroupUserModel[]>> {
        return this.instance.get("users/all/" + groupUrl, {})
    }

    createUser(firstname: string, lastname: string, email: string, password: string): Promise<AxiosResponse> {
        return this.instance.post("user/register", {
            firstname,
            lastname,
            email,
            password
        })
    }

    public leaveConversation(userIdToRemove: number, groupId: string): Promise<AxiosResponse> {
        return this.instance.get("user/leave/" + userIdToRemove + "/group/" + groupId)
    }

    public removeUserFromConversation(userIdToRemove: string | number, groupUrl: string): Promise<AxiosResponse> {
        return this.instance.get("user/remove/" + userIdToRemove + "/group/" + groupUrl)
    }

    public removeAdminUserInConversation(userIdToRemove: string | number, groupUrl: string): Promise<AxiosResponse> {
        return this.instance.get("user/remove/admin/" + userIdToRemove + "/group/" + groupUrl)
    }

    public grantUserAdminInConversation(userIdToGrant: number | string, groupId: string): Promise<AxiosResponse> {
        return this.instance.get("user/grant/" + userIdToGrant + "/group/" + groupId)
    }

    public uploadFile(data: FormData): Promise<AxiosResponse> {
        return this.instance.post("upload", data)
    }

    public getMultimediaFiles(groupUrl: string) {
        return this.instance.get<string[]>(`files/groupUrl/${groupUrl}`)
    }

    public markMessageAsSeen(userId: number, groupUrl: string) {
        return this.instance.get<Date>(`messages/seen/group/${groupUrl}/user/${userId}`)
    }

    public searchInConversations(data: { text: string }) {
        return this.instance.post<FullTextSearchResponseType>("search", data)
    }
}
