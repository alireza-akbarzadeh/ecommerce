import validationsMessages from '@hasty-bazar/admin-shared/core/translations/validations.messages'
import { HBNumericField, HBNumericFieldProps } from '@hasty-bazar/core'
import { FC, memo } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'

interface HBNumericFieldControllerProps extends HBNumericFieldProps {
  name: string
  label?: string
  formRules?: RegisterOptions
  readOnly?: boolean
}
const HBNumericFieldController: FC<HBNumericFieldControllerProps> = ({
  name,
  formRules,
  label,
  ...props
}) => {
  const { formState, control, watch } = useFormContext()
  const errorMessage = formState.errors[name]?.message
  const hasError = !!formState.errors[name]
  const defaultValue = watch(name) || ''
  const { formatMessage } = useIntl()

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
        <HBNumericField
          required={!!formRules?.required}
          label={label}
          onChange={(value) => {
            onChange(value)
          }}
          onBlur={onBlur}
          value={value}
          fullWidth
          helperText={errorMessage as string}
          error={!!errorMessage || hasError}
          readOnly={props.readOnly}
          disabled={props.disabled}
          {...props}
        />
      )}
    />
  )
}

export default memo(HBNumericFieldController)
