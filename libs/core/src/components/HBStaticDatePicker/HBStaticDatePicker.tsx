import { StaticDatePickerProps } from '@mui/lab'
import { HBLoading } from '../HBLoading'
import { HBStaticDatePickerRootStyle } from './HBStaticDatePicker.styles'

export type HBStaticDatePickerProps<TDate = Date> = StaticDatePickerProps<TDate>
function HBStaticDatePicker<TDate = Date>(props: HBStaticDatePickerProps<TDate>): JSX.Element {
  return <HBStaticDatePickerRootStyle {...props} renderLoading={() => <HBLoading />} />
}
HBStaticDatePicker.displayName = 'HBStaticDatePicker'
HBStaticDatePicker.defaultProps = {}
export default HBStaticDatePicker
