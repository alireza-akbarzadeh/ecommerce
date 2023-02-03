import AdapterDateFns from '@date-io/date-fns-jalali'
import { HBDateTimePicker, HBDateTimePickerProps, HBTextFieldProps } from '@hasty-bazar/core'
import { TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { FC, memo, useEffect, useState } from 'react'

interface HBSelectControllerProps extends Partial<HBDateTimePickerProps<Date>> {
  inputProps?: HBTextFieldProps
  onChange: (value: Date | null) => void
  disabled?: boolean
  inputDisabled?: boolean
  value: Date
}

const HBDateTimePickerController: FC<HBSelectControllerProps> = ({
  onChange,
  disabled,
  value,
  inputDisabled,
  ...props
}) => {
  const [date, setDate] = useState<Date | null>()

  useEffect(() => setDate(value), [])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <HBDateTimePicker<Date>
        disabled={disabled}
        value={date}
        ampm={false}
        onChange={(value: any) => {
          onChange(value)
          setDate(value)
        }}
        renderInput={(params: HBTextFieldProps) => (
          <TextField
            {...params}
            size="small"
            {...props.inputProps}
            helperText={''}
            onKeyDown={
              inputDisabled
                ? (event) => {
                    event.preventDefault()
                  }
                : undefined
            }
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  )
}

export default memo(HBDateTimePickerController)
