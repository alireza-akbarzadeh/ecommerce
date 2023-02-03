import { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker'
import { HBLoading } from '../HBLoading'
import { HBDatePickerRootStyle } from './HBDateTimePicker.styles'

export type HBDateTimePickerProps<TDate = Date> = DateTimePickerProps<TDate> &
  React.RefAttributes<HTMLDivElement>

function HBDateTimePicker<TDate>(props: HBDateTimePickerProps<TDate>): JSX.Element {
  return <HBDatePickerRootStyle {...props} renderLoading={() => <HBLoading />} />
}
export default HBDateTimePicker
