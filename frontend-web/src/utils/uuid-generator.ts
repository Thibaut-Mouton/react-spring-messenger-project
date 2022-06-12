import { capitalize } from '@mui/material';

export default function UUIDv4 (): string {
    const digitArray: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const alphanumericArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const alphanumericCapArray = alphanumericArray.map(letter => capitalize(letter));
    const rx = 'x';
    return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replaceAll(rx, () => {
        const array = alphanumericArray.concat(alphanumericCapArray);
        array.push(...digitArray);
        return array[Math.floor(Math.random() * array.length)];
    });
}
