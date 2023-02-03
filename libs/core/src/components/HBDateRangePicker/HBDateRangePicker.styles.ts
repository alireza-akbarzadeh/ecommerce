import { makeStyles } from '@mui/styles'
import { dateRangePickerDayClasses } from '@mui/x-date-pickers-pro'

export const useHBDateRangePickerStyles = makeStyles({
  root: {
    [`& .${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: {
      padding: 2,
    },
  },
})
