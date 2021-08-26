export default class MessageModel {
    groupId;
    name;
    url;

    constructor(groupId, name, url) {
        this.groupId = groupId;
        this.name = name;
        this.url = url;
    }
}