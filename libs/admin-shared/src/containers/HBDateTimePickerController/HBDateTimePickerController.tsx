import AdapterDateFns from '@date-io/date-fns-jalali'
import { HBDateTimePickerProps, HBIcon, HBTextFieldProps } from '@hasty-bazar/core'
import { FormHelperText, TextField } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { FC, memo } from 'react'
import { RegisterOptions, useController, useFormContext } from 'react-hook-form'
interface HBSelectControllerProps extends Partial<HBDateTimePickerProps<Date>> {
  name: string
  formRules?: RegisterOptions
  inputProps?: HBTextFieldProps
  defaultValue?: Date
  inputDisabled?: boolean
}
const HBDateTimePickerController: FC<HBSelectControllerProps> = ({
  name,
  inputDisabled,
  formRules,
  ...props
}) => {
  const { formState, control } = useFormContext()
  const { field } = useController({
    name,
    rules: formRules,
    defaultValue: props.defaultValue || null,
    control,
  })
  const error = !!formState.errors[name]

  const errorMessage = formState.errors[name]?.message
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker<Date>
        value={field.value as Date | null}
        disabled={props.disabled}
        ampm={false}
        onChange={(value: any) => field.onChange(value)}
        renderInput={(params: HBTextFieldProps) => (
          <TextField
            {...params}
            error={!!formState.errors[name]}
            size="small"
            onKeyDown={inputDisabled ? (event) => event.preventDefault() : undefined}
            sx={{
              width: '100%',
            }}
            {...props.inputProps}
          />
        )}
        {...props}
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

export default memo(HBDateTimePickerController)
