import { makeStyles } from '@mui/styles'
import { dateRangePickerDayClasses } from '@mui/x-date-pickers-pro'

export const useHBDateRangePickerStyles = makeStyles((theme) => ({
  root: {
    [`& .${dateRangePickerDayClasses.rangeIntervalDayPreview}`]: {
      borderWidth: 2,
      borderStyle: 'dashed',
      borderLeft: '0px!important',
      borderRight: '0px!important',
      padding: '0 2px',
      borderColor: theme.palette.grey[300],
    },
  },
}))
