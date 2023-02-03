import { CalendarPickerProps } from '@mui/lab'
import { HBLoading } from '../HBLoading'
import { HBCalendarPickerRootStyle } from './HBCalendarPicker.styles'

export type HBCalendarPickerProps<TDate = Date> = CalendarPickerProps<TDate> &
  React.RefAttributes<HTMLDivElement>

function HBCalendarPicker<TDate>(props: HBCalendarPickerProps<TDate>): JSX.Element {
  return <HBCalendarPickerRootStyle {...props} renderLoading={() => <HBLoading />} />
}

HBCalendarPicker.displayName = 'HBCalendarPicker'
HBCalendarPicker.defaultProps = {}

export default HBCalendarPicker
