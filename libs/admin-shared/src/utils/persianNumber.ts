const persianDigits = '۰۱۲۳۴۵۶۷۸۹'.split('')
export const persianNumber = (number: number | string) => {
  return number?.toString().replace(/\d/g, (digit: string) => persianDigits[parseInt(digit)])
}
