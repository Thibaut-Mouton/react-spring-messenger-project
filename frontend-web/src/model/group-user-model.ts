export default class GroupUserModel {

    public userId: number | string;

    public firstName: string;

    public lastName: string;

    public admin: boolean;

    constructor(id: number | string, firstName: string, lastName: string, admin: boolean) {
        this.userId = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.admin = admin;
    }
}