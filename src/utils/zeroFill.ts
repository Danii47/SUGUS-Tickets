export const zeroFill = (number: number, width: number): string => {
  return number.toString().padStart(width, "0")
}
