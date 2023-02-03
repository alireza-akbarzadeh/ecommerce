import { format, isValid, parse } from 'date-fns'

const handleFromToTime = (fromTime: string, toTime: string) => {
  let validType: 'HH:mm' | 'HH:mm:ss' | ''
  validType = isValid(parse(fromTime, 'HH:mm', new Date()))
    ? 'HH:mm'
    : isValid(parse(fromTime, 'HH:mm:ss', new Date()))
    ? 'HH:mm:ss'
    : ''
  if (!validType) {
    return ''
  }
  const fromTimeformat = format(parse(fromTime, validType, new Date()), 'H')
  const toTimeformat = +format(parse(toTime, validType, new Date()), 'H')

  let timePrefix = ''

  if (toTimeformat >= 6 && toTimeformat < 12) {
    timePrefix = 'صبح'
  } else if (toTimeformat >= 12 && toTimeformat < 15) {
    timePrefix = 'ظهر'
  } else if (toTimeformat >= 15 && toTimeformat < 18) {
    timePrefix = 'عصر'
  } else if (toTimeformat >= 18 && toTimeformat < 24) {
    timePrefix = 'شب'
  } else {
    timePrefix = 'بامداد'
  }

  return `${fromTimeformat} تا ${toTimeformat} ${timePrefix}`
}

export default handleFromToTime
