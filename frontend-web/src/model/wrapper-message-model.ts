import {FullMessageModel} from "./full-message-model";

export class WrapperMessageModel {

    lastMessage: boolean;

    messages: FullMessageModel[]


    constructor(lastMessage: boolean, messages: FullMessageModel[]) {
        this.lastMessage = lastMessage;
        this.messages = messages;
    }
}
