import { camelCase, startCase } from 'lodash'
export function pascalCase(str: string) {
  return startCase(camelCase(str)).replace(/ /g, '')
}

export const appendZero = (number: number) => (number < 10 ? `0${number}` : number)

export const getFormattedTime = (time: number) => {
  const dateTime = new Date(0, 0, 0, 0, 0, time, 0)

  const dateTimeM = appendZero(dateTime.getMinutes())
  const dateTimeS = appendZero(dateTime.getSeconds())

  return `${dateTimeM}:${dateTimeS}`
}

export const clearHtmlTags = (str: string) =>
  str
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&cent;/g, '¢')
    .replace(/&pound;/g, '£')
    .replace(/&yen;/g, '¥')
    .replace(/&euro;/g, '€')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&times;/g, '×')
    .replace(/&divide;/g, '÷')

export const toDateString = ({
  date,
  locale = 'en-US',
  separator = '/',
}: {
  date: string
  locale?: string
  separator?: string
}) => {
  const d = new Date(date)
  return d
    .toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\//g, separator)
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
