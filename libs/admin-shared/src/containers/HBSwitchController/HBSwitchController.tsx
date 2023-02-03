import { HBSwitch, HBSwitchProps } from '@hasty-bazar/core'
import { Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { FC } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'

interface HBSwitchControllerProps extends HBSwitchProps {
  name: string
  formRules?: RegisterOptions
  disabled?: boolean
  sx?: SxProps<Theme>
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

const HBSwitchController: FC<HBSwitchControllerProps> = ({
  name,
  formRules,
  disabled,
  sx,
  onChange,
  ...props
}) => {
  const { control, watch } = useFormContext()
  const defaultValue = watch(name) || false

  return (
    <Controller
      control={control}
      name={name}
      rules={formRules}
      defaultValue={defaultValue}
      render={({ field }) => (
        <HBSwitch
          sx={sx}
          {...field}
          disabled={disabled}
          checked={field.value}
          onChange={(event, newValue) => {
            field.onChange(newValue)
            onChange && onChange(event, newValue)
          }}
          {...props}
        />
      )}
    />
  )
}

export default HBSwitchController
