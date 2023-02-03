import { HBTextFieldProps } from '@hasty-bazar/core'
import { TextField } from '@mui/material'
import { isNil } from 'ramda'
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form'
import { InputAttributes, NumericFormat, NumericFormatProps } from 'react-number-format'

interface HBNumericFormatControllerProps<FieldValueType extends FieldValues = any>
  extends HBTextFieldProps {
  name: FieldPath<FieldValueType>
  control?: Control<any, any>
  formRules?: RegisterOptions
}
function HBNumericFormatController<FieldValueType extends FieldValues = object>({
  name,
  control,
  formRules,
  ...props
}: HBNumericFormatControllerProps<FieldValueType> & NumericFormatProps<InputAttributes>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={formRules}
      render={({ field: { onChange, value, ...rest }, fieldState }) => {
        return (
          <NumericFormat<HBTextFieldProps>
            onValueChange={(values) => {
              onChange(values.floatValue)
            }}
            {...rest}
            value={isNil(value) ? '' : (value as string)}
            size="small"
            error={!!fieldState.error?.message}
            helperText={fieldState.error?.message}
            fullWidth
            customInput={TextField as any}
            {...props}
          />
        )
      }}
    />
  )
}

export default HBNumericFormatController
