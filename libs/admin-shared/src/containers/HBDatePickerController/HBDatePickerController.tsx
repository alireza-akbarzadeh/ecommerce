import AdapterDateFns from '@date-io/date-fns-jalali'
import { HBDateTimePickerProps, HBIcon, HBTextFieldProps } from '@hasty-bazar/core'
import { FormHelperText, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { FC, memo } from 'react'
import { RegisterOptions, useController, useFormContext } from 'react-hook-form'
interface HBSelectControllerProps extends Partial<HBDateTimePickerProps<Date>> {
  name: string
  formRules?: RegisterOptions
  inputProps?: HBTextFieldProps
  defaultValue?: Date
}
const HBDatePickerController: FC<HBSelectControllerProps> = ({ name, formRules, ...props }) => {
  const { formState, control } = useFormContext()
  const { field } = useController({
    name,
    rules: formRules,
    defaultValue: props.defaultValue || null,
    control,
  })

  const dateIsValid = (date: Date) => {
    const dateValue = new Date(date)
    return dateValue instanceof Date && !isNaN(Number(dateValue))
  }

  const error = !!formState.errors[name]
  const errorMessage = formState.errors[name]?.message

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        inputFormat="yyyy/MM/dd"
        value={field.value}
        disabled={props?.disabled}
        minDate={props?.minDateTime}
        onChange={(newValue: any) => {
          field.onChange(newValue)
          props?.onChange?.(newValue)
        }}
        renderInput={(params: any) => (
          <TextField
            fullWidth
            size="small"
            {...params}
            sx={props.inputProps?.sx}
            error={!dateIsValid(field.value) && !!field.value}
            label={props.label}
          />
        )}
      />

      {error && (
        <FormHelperText
          sx={(theme) => {
            return {
              color: theme.palette.error.main,
              fontSize: theme.typography.caption.fontSize,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }
          }}
        >
          <>
            <HBIcon size="small" type="infoCircle" />
            {errorMessage}
          </>
        </FormHelperText>
      )}
    </LocalizationProvider>
  )
}

export default memo(HBDatePickerController)
