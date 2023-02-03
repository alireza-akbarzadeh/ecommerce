import AdapterDateFns from '@date-io/date-fns-jalali'
import { HBIcon } from '@hasty-bazar/core'
import { Box, TextField } from '@mui/material'
import { DateRangePickerProps } from '@mui/x-date-pickers-pro/DateRangePicker'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { FC, memo, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import dateRangePickerMessages from './HBDateRangePicker.messages'
import { useHBDateRangePickerStyles } from './HBDateRangePicker.styles'
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker'

function getElementsByText(str: string, tag: string) {
  return Array.prototype.slice
    .call(document.getElementsByTagName(tag))
    .filter((el: HTMLElement) => el?.textContent?.trim() === str.trim())
}
export interface IHBDateRangePickerProps
  extends Omit<DateRangePickerProps<Date, Date>, 'renderInput'> {
  minDate?: Date
  maxDate?: Date
}

const HBDateRangePicker: FC<IHBDateRangePickerProps> = (props) => {
  const classes = useHBDateRangePickerStyles()
  const { formatMessage } = useIntl()
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false)

  useEffect(() => {
    setOpenDatePicker(false)
    getElementsByText('MUI X: Missing license key', 'div')?.[0]?.remove()
  }, [openDatePicker])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDateRangePicker
        {...props}
        renderInput={(startProps, endProps) => (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              {...startProps}
              size="small"
              label={formatMessage(dateRangePickerMessages.start)}
              InputProps={{
                endAdornment: <HBIcon sx={{ color: 'text.secondary' }} type={'calender'} />,
              }}
            />
            <TextField
              {...endProps}
              size="small"
              label={formatMessage(dateRangePickerMessages.end)}
              InputProps={{
                endAdornment: <HBIcon sx={{ color: 'text.secondary' }} type={'calender'} />,
              }}
            />
          </Box>
        )}
        onOpen={() => {
          setOpenDatePicker(true)
        }}
        className={classes.root}
      />
    </LocalizationProvider>
  )
}

export default memo(HBDateRangePicker)
