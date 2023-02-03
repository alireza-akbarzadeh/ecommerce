import validationsMessages from '@hasty-bazar/admin-shared/core/translations/validations.messages'
import { HBTextFieldProps } from '@hasty-bazar/core'
import { FC, memo } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import HBTags from './components/HBTags'

interface HBTagsControllerProps extends Omit<HBTextFieldProps, 'label'> {
  name: string
  formRules?: RegisterOptions
  readOnly?: boolean
  label?: string
}
const HBTagsController: FC<HBTagsControllerProps> = ({ name, formRules, label, ...props }) => {
  const { formState, control, watch } = useFormContext()
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
        <HBTags
          tags={value}
          tagsArray={(tags) => {
            onChange(tags)
          }}
          label={label!}
          required={!!formRules?.required}
          hasError={hasError}
        />
      )}
    />
  )
}

export default memo(HBTagsController)
