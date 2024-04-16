export const getPayloadSize = (value: string): number => {
    return new Blob([value]).size
}
