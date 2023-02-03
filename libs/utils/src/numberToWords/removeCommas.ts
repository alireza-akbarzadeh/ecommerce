export function removeCommas(str: string): number {
  if (typeof str !== 'string') {
    throw new TypeError('PersianTools: removeCommas - The input must be string')
  }

  let result = '' + str
  if (result.indexOf(',') !== -1) {
    result = result.replace(/,\s?/g, '')
  }

  return Number(result)
}
