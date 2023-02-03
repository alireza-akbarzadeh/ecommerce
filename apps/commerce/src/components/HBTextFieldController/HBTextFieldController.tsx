import { HBTextField, HBTextFieldProps } from '@hasty-bazar/core'
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'

interface HBTextFieldControllerProps<FieldValueType extends FieldValues = any>
  extends HBTextFieldProps {
  name: FieldPath<FieldValueType>
  control?: Control<any, any>
  formRules?: RegisterOptions
}
function HBTextFieldController<FieldValueType extends FieldValues = object>({
  name,
  control,
  formRules,
  label,
  ...props
}: HBTextFieldControllerProps<FieldValueType>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={formRules}
      render={({ field: { onBlur, onChange, value }, fieldState, formState }) => {
        const errorMessage = fieldState.error?.message
        return (
          <HBTextField
            required={!!formRules?.required}
            label={label}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            fullWidth
            helperText={errorMessage}
            error={!!errorMessage}
            {...props}
          />
        )
      }}
    />
  )
}

export default HBTextFieldController
