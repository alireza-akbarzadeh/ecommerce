import validationsMessages from '@hasty-bazar/admin-shared/core/translations/validations.messages'
import { HBSelectProps, HBSelectTree, HBSelectTreeDataProps } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'
import { FC, memo } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'

export interface HBSelectTreeControllerProps extends Omit<HBSelectProps, 'defaultValue'> {
  name: string
  formRules?: RegisterOptions
  noneOption?: string
  data: HBSelectTreeDataProps[]
  defaultValue?: HBSelectTreeDataProps
}
const HBSelectTreeController: FC<HBSelectTreeControllerProps> = ({
  name,
  formRules,
  label,
  data,
  defaultValue,
  ...props
}) => {
  const { control, watch } = useFormContext()
  const { spacing } = useTheme()
  const defaultControlValue = watch(name) || ''
  const { formatMessage } = useIntl()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultControlValue}
      rules={
        formRules || {
          required: {
            value: true,
            message: formatMessage(validationsMessages.isRequired, { msg: label }),
          },
        }
      }
      render={({ field: { onBlur, onChange, value }, fieldState }: any) => {
        const _value = props['multiple'] ? (!Array.isArray(value) ? [] : value) : value
        return (
          <HBSelectTree
            defaultValue={defaultValue}
            data={data}
            label={label}
            onChange={onChange}
            onBlur={onBlur}
            value={_value}
            SelectDisplayProps={{
              style: {
                display: 'flex',
                flexDirection: 'row',
              },
            }}
            size="small"
            error={!!fieldState.error?.message}
            {...props}
            sx={{
              borderRadius: spacing(1),
              ...props['sx'],
              mb: 2.5,
            }}
          />
        )
      }}
    />
  )
}

export default memo(HBSelectTreeController)
