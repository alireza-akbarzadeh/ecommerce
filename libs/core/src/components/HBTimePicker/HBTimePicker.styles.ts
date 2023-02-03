import { styled } from '@mui/material/styles'
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker'

type HBTimePickerComponent = <TDate>(props: TimePickerProps<TDate>) => JSX.Element

export const HBTimePickerRootStyle = styled(TimePicker)(
  ({ theme }) => ({}),
) as HBTimePickerComponent
