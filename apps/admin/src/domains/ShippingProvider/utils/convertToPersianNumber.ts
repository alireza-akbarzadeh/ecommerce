export const convertToPersianNumber = (time: string) => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'.split('')
  const timeAfterSplit = time.split(':')

  const convertTimeNumber = timeAfterSplit?.map((number) =>
    number.toString().replace(/\d/g, (digit: string) => persianDigits[parseInt(digit)]),
  )

  return convertTimeNumber.join(':')
}
