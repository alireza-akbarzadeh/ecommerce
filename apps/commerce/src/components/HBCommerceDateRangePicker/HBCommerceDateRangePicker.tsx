import { FC } from 'react'
import { HBDateRangePicker, IHBDateRangePickerProps } from '@hasty-bazar/core'
import { useCommerceDateRangePickerStyles } from './HBCommerceDateRangePicker.styles'

const HBCommerceDateRangePicker: FC<IHBDateRangePickerProps> = (props) => {
  const classes = useCommerceDateRangePickerStyles()

  return (
    <HBDateRangePicker
      {...props}
      PaperProps={{
        className: classes.filterDatePicker,
      }}
    />
  )
}
export default HBCommerceDateRangePicker
