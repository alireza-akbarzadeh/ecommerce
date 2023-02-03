const persianDigits = '۰۱۲۳۴۵۶۷۸۹'.split('')

export function persianNumber(number: number) {
  return number?.toString().replace(/\d/g, (digit: string) => persianDigits[parseInt(digit)])
}
