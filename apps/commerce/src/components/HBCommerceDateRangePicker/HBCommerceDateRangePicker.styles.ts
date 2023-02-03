import { makeStyles } from '@mui/styles'

export const useCommerceDateRangePickerStyles = makeStyles((theme) => ({
  filterDatePicker: {
    '& .MuiPickersDay-root': {
      borderRadius: theme.spacing(2),
    },
    '& .MuiDateRangePickerDay-rangeIntervalDayHighlight': {
      borderRadius: 0,
    },
    '& .MuiDateRangePickerDay-rangeIntervalDayHighlightStart': {
      borderRadius: theme.spacing(0, 2, 2, 0),
    },
    '& .MuiDateRangePickerDay-rangeIntervalDayHighlightEnd': {
      borderRadius: theme.spacing(2, 0, 0, 2),
    },
  },
}))
