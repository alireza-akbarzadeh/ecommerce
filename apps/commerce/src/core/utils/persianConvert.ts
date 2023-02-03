export const persianNumber = (number: string) => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'.split('')
  return number.toString().replace(/\d/g, (m: string) => persianDigits[parseInt(m)])
}

export const englishNumber = (number: string) => {
  return number.replace(/([۰-۹])/g, (token) => String.fromCharCode(token.charCodeAt(0) - 1728))
}
