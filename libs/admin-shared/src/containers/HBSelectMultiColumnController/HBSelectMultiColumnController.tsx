import { HBSelectMultiColumn, HBSelectMultiColumnProps } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'
import { FC, memo, useState } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'

export interface HBSelectMultiColumnControllerProps
  extends HBSelectMultiColumnProps<any, boolean, boolean, boolean> {
  name: string
  formRules?: RegisterOptions
  noneOption?: string
}

const HBSelectMultiColumnController: FC<HBSelectMultiColumnControllerProps> = ({
  name,
  formRules,
  label,
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const { control, watch, formState } = useFormContext()
  const { spacing } = useTheme()
  const errorMessage = formState?.errors[name]?.message
  const defaultValue = watch(name) || ''
  const hasError = !!formState?.errors[name]
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={
        formRules || {
          required: { value: true, message: `${label} is required` },
        }
      }
      render={({ field: { onBlur, onChange, value } }) => {
        const _value = props.multiple ? (!Array.isArray(value) ? [] : value) : value
        return (
          <HBSelectMultiColumn
            label={label}
            onChange={(event, newValue) => {
              onChange(newValue)
              !props.multiple && setOpen(false)
            }}
            open={open}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            value={_value}
            size="small"
            error={!!errorMessage || hasError}
            errorMessage={!!errorMessage}
            sx={{
              borderRadius: spacing(1),
              ...props?.sx,
              mb: 2.5,
            }}
            fullWidth
            onOpenClose={(value) => setOpen(value)}
            {...props}
          />
        )
      }}
    />
  )
}

export default memo(HBSelectMultiColumnController)
