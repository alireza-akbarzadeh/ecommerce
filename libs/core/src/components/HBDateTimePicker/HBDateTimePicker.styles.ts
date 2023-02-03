import { styled } from '@mui/material'
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker'

type HBDatePickerComponent = <TDate>(props: DateTimePickerProps<TDate>) => JSX.Element

export const HBDatePickerRootStyle = styled(DateTimePicker)(
  ({ theme }) => ({}),
) as HBDatePickerComponent
