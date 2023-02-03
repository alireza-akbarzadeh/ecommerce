import { format } from 'date-fns-jalali'

const convertDateToPersian = (date: string) => {
  try {
    return date ? format(new Date(date), 'yyyy/MM/dd ') : date
  } catch (e) {
    return date
  }
}
const convertDateTimeToPersian = (date: string) => {
  try {
    return date ? format(new Date(date), 'HH:mm:ss - yyyy/MM/dd ') : null
  } catch (e) {
    return date
  }
}
export { convertDateToPersian, convertDateTimeToPersian }
