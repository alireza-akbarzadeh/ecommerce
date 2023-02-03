import { CalendarPicker } from '@mui/lab'
import { styled } from '@mui/material'
import { HBCalendarPickerProps } from './HBCalendarPicker'

type HBCalendarPickerComponent = <TDate>(props: HBCalendarPickerProps<TDate>) => JSX.Element

export const HBCalendarPickerRootStyle = styled(CalendarPicker)(({ theme }) => {
  return {}
}) as HBCalendarPickerComponent
