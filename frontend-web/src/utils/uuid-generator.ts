import {capitalize} from "@material-ui/core";

export default function UUIDv4(): string {
    let digitArray: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let alphanumericArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let alphanumericCapArray = alphanumericArray.map(letter => capitalize(letter));
    let rx = "x"
    return "xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx".replaceAll(rx, () => {
        let array = alphanumericArray.concat(alphanumericCapArray);
        array.push(...digitArray);
        return array[Math.floor(Math.random() * array.length)];
    });
}