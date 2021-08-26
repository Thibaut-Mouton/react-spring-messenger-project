import moment from "moment";

export function dateParser(date: string) {
    const messageDate = moment(date, "YYYY-MM-DD HH:mm:ss").fromNow();
    if (messageDate.includes("year")) {
        return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow(true);
    }
    if (messageDate.includes("month")) {
        return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow(true).replace("a", "1");
    }
    if (messageDate.includes("day")) {
        return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow(true);
    }
    if (messageDate.includes("hour")) {
        if (messageDate.includes("hours")) {
            return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow(true)
        }
        return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow(true).replace("an", "1");
    }
    if (messageDate.includes("minutes") || messageDate.includes("minute")) {
        return moment(date, "YYYY-MM-DD HH:mm:ss").fromNow(true);
    }
    if (messageDate.includes("seconds")) {
        return "1 min"
    }
}