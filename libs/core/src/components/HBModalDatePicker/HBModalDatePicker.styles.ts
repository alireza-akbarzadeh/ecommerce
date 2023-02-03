import { MobileDatePicker } from '@mui/lab'
import { styled } from '@mui/material'
import { HBModalDatePickerProps } from './HBModalDatePicker'
export type HBModalDatePickerComponent = <TDate = Date>(
  props: HBModalDatePickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element

export const HBModalDatePickerRootStyle = styled(MobileDatePicker)(({ theme }) => {
  return {}
}) as HBModalDatePickerComponent
