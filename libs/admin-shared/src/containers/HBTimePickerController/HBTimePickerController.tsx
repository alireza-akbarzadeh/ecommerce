import { HBTextField, HBTextFieldProps, HBTimePicker, HBTimePickerProps } from '@hasty-bazar/core'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form'

export interface HBTimePickerControllerProps<FieldValueType extends FieldValues>
  extends Omit<HBTimePickerProps, 'value' | 'renderInput' | 'onChange'> {
  noneOption?: string
  controllerProps?: Partial<ControllerProps<FieldValueType>>
  fieldName: FieldPath<FieldValueType>
  required?: boolean
  formRules?: RegisterOptions
  onChange?: (date: Date | null, keyboardInputValue?: string | undefined) => void
  textFiledProps?: Omit<Partial<HBTextFieldProps>, 'InputProps'> &
    Omit<HBTextFieldProps['inputProps'], 'startAdornment' | 'endAdornment'>
  label?: string
}

const HBTimePickerController = <FieldValueType extends FieldValues>({
  formRules,
  fieldName,
  required = false,
  disabled,
  label,
  ...props
}: HBTimePickerControllerProps<FieldValueType>) => {
  return (
    <Controller
      {...props?.controllerProps}
      name={fieldName}
      rules={{
        required,
        ...props?.controllerProps?.rules,
        ...formRules,
      }}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message
        const hasError = !!fieldState.error

        return (
          <HBTimePicker<Date>
            disabled={disabled}
            {...field}
            ampm={true}
            {...props}
            onChange={(value: any) => {
              field?.onChange(value)
              props?.onChange && props?.onChange(value)
            }}
            renderInput={(params: HBTextFieldProps) => (
              <HBTextField
                {...params}
                size="small"
                {...props.textFiledProps}
                helperText={errorMessage}
                error={!!errorMessage || hasError}
                label={label}
              />
            )}
          />
        )
      }}
    />
  )
}

export default HBTimePickerController
