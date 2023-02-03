export function persianNumber(number: number | string) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'.split('')
  return number?.toString().replace(/\d/g, (digit: string) => persianDigits[parseInt(digit)])
}
