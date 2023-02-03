import AdapterDateFns from '@date-io/date-fns-jalali'
import { TimePickerProps } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { HBTimePickerRootStyle } from './HBTimePicker.styles'

export type HBTimePickerProps<TDate = Date> = TimePickerProps<TDate> &
  React.RefAttributes<HTMLDivElement>

function HBTimePicker<TDate>(props: HBTimePickerProps<TDate>): JSX.Element {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBTimePickerRootStyle {...props} />
    </LocalizationProvider>
  )
}

export default HBTimePicker
