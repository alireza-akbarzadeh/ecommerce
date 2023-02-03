import { HBSelect, HBSelectProps } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'
import { FC } from 'react'
import { Control, Controller, RegisterOptions, useFormContext } from 'react-hook-form'

export interface HBSelectControllerProps extends HBSelectProps {
  name: string
  formRules?: RegisterOptions
  noneOption?: string
  customControl?: Control<any, any>
}
const HBSelectController: FC<HBSelectControllerProps> = ({
  name,
  formRules,
  label,
  customControl,
  ...props
}) => {
  const { formState, control, watch } = useFormContext()
  const { spacing } = useTheme()
  const errorMessage = formState.errors[name]?.message
  const defaultValue = watch(name) || ''

  const hasError = !!formState.errors[name]
  return (
    <Controller
      name={name}
      control={customControl || control}
      defaultValue={defaultValue}
      rules={
        formRules || {
          required: { value: true, message: `${label} نمی تواند خالی بماند` },
        }
      }
      render={({ field }) => {
        return (
          <HBSelect
            fullWidth
            label={label}
            {...field}
            size="small"
            error={!!errorMessage || hasError}
            {...props}
            sx={{
              borderRadius: spacing(1),
              ...props?.sx,
            }}
          />
        )
      }}
    />
  )
}

export default HBSelectController
