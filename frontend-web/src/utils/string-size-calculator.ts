export const getPayloadSize = (value: string): number => {
    return Buffer.from(value).length
}