import validationsMessages from '@hasty-bazar/admin-shared/core/translations/validations.messages'
import { HBTextField, HBTextFieldProps } from '@hasty-bazar/core'
import { formHelperTextClasses } from '@mui/material'
import { FC, memo } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'

interface HBTextFieldControllerProps extends HBTextFieldProps {
  name: string
  formRules?: RegisterOptions
  mask?: string
  readOnly?: boolean
}
const HBTextFieldController: FC<HBTextFieldControllerProps> = ({
  name,
  formRules,
  label,
  mask,
  ...props
}) => {
  const { formState, control, watch } = useFormContext()
  const errorMessage = formState.errors[name]?.message
  const hasError = !!formState.errors[name]
  const defaultValue = watch(name) || ''
  const { formatMessage } = useIntl()

  const ltrClasses = {
    [`& .${formHelperTextClasses.root}>div`]: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
    },
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={
        formRules || {
          required: {
            value: true,
            message: `${formatMessage(validationsMessages.isRequired, { msg: label })}`,
          },
        }
      }
      render={({ field: { onBlur, onChange, value } }) => (
        <HBTextField
          required={!!formRules?.required}
          label={label}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          fullWidth
          helperText={errorMessage as string}
          error={!!errorMessage || hasError}
          maskOptions={{ mask }}
          readOnly={props.readOnly}
          sx={(theme) => ({
            ...props.sx,
            ...(theme.direction === 'rtl' && props?.dir === 'ltr' ? ltrClasses : {}),
          })}
          {...props}
        />
      )}
    />
  )
}

export default memo(HBTextFieldController)
