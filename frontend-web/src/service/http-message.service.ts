import {HttpMainService} from "./http-main.service"
import {WrapperMessageModel} from "../interface-contract/wrapper-message-model"
import {AxiosResponse} from "axios"

export class HttpMessageService extends HttpMainService {
    public constructor() {
        super()
    }

    public getMessages(groupUrl: string, offset: number): Promise<AxiosResponse<WrapperMessageModel>> {
        return this.instance.get<WrapperMessageModel>(`/messages/${offset}/group/${groupUrl}`)
    }
}
