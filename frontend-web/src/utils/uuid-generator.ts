export function UUIDv4 (): string {
  const digitArray: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  const alphanumericArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  const rx = "x"
  return "xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx".replaceAll(rx, () => {
    const array = alphanumericArray.concat(alphanumericArray)
    array.push(...digitArray)
    return array[Math.floor(Math.random() * array.length)]
  })
}

export function isStringUUIDType (str: string): boolean {
  const regex = new RegExp(/^[\da-fA-F]{8}\b-[\da-fA-F]{4}\b-[\da-fA-F]{4}\b-[\da-fA-F]{4}\b-[\da-fA-F]{12}$/)
  return regex.test(str)
}
