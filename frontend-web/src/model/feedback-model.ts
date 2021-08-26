export class FeedbackModel {

    public id: string

    public text: string

    public alert: "warning" | "error" | "info" | "success"

    public isOpen: boolean

    constructor(id: string, text: string, alert: "warning" | "error" | "info" | "success", isOpen: boolean) {
        this.id = id;
        this.text = text;
        this.alert = alert;
        this.isOpen = isOpen;
    }
}