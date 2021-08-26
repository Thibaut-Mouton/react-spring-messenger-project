export default class UserModel {

    public id: number;

    public username: string;

    public wsToken: string;

    public firstGroupUrl: string;

    constructor(id: number, username: string, wsToken: string, firstGroupUrl: string) {
        this.id = id;
        this.username = username;
        this.wsToken = wsToken;
        this.firstGroupUrl = firstGroupUrl;
    }
}