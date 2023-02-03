import { HBSelect, HBSelectProps } from '@hasty-bazar/core'
import { selectClasses, useTheme } from '@mui/material'
import {
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'

export interface HBSelectControllerProps<FieldValueType extends FieldValues = any>
  extends Omit<HBSelectProps, 'name'> {
  name: FieldPath<FieldValueType>
  formRules?: RegisterOptions
  noneOption?: string
  disabled?: boolean
}
function HBSelectController<FieldValueType extends FieldValues = any>({
  name,
  formRules,
  label,
  disabled,
  sx,
  ...props
}: HBSelectControllerProps<FieldValueType>) {
  const { formState, control, watch } = useFormContext()
  const { spacing } = useTheme()

  const defaultValue: any = watch(name) || ''

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={
        formRules || {
          required: { value: true, message: `${label} نمی تواند خالی بماند` },
        }
      }
      render={({ field: { onBlur, onChange, value }, fieldState }) => {
        const _value = props.multiple ? (!Array.isArray(value) ? [] : value) : value
        return (
          <HBSelect
            label={label}
            onChange={onChange}
            onBlur={onBlur}
            value={_value}
            disabled={disabled}
            SelectDisplayProps={{
              style: {
                display: 'flex',
                flexDirection: 'row',
              },
            }}
            helperText={fieldState.error?.message}
            size="small"
            error={!!fieldState.error}
            {...props}
            sx={{
              borderRadius: spacing(1),
              [`& .${selectClasses.select}`]: {
                display: 'inline-block !important',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              ...sx,
            }}
          />
        )
      }}
    />
  )
}

export default HBSelectController
