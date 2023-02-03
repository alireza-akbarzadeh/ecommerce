import { StaticDatePicker } from '@mui/lab'
import { styled } from '@mui/material'
import { HBStaticDatePickerProps } from './HBStaticDatePicker'

type HBStaticDatePickerComponent = <TDate = Date>(
  props: HBStaticDatePickerProps<TDate>,
) => JSX.Element

export const HBStaticDatePickerRootStyle = styled(StaticDatePicker)(({ theme }) => {
  return {}
}) as HBStaticDatePickerComponent
