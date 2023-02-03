// import validationsMessages from '@hasty-bazar-admin/core/translations/validations.messages'
import { HBTextField, HBTextFieldProps, toEnNumConverter } from '@hasty-bazar/core'
import { formHelperTextClasses, outlinedInputClasses } from '@mui/material'
import { FormPatternsEnums } from 'libs/core/src/enums'
import phrasesMessages from 'libs/core/src/translations/phrases.messages'
import { FC, memo } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'

export interface HBTextFieldControllerProps extends HBTextFieldProps {
  name: string
  formRules?: RegisterOptions
  mask?: string
  readOnly?: boolean
  inputAlign?: 'end' | 'start'
  digitMapper?: boolean
}
const HBTextFieldController: FC<HBTextFieldControllerProps> = ({
  name,
  formRules,
  label,
  mask,
  inputAlign = 'start',
  digitMapper = true,
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
      rules={{
        required: {
          value: true,
          message: formatMessage(phrasesMessages.requiredField),
        },
        ...(props.type === 'number' && {
          pattern: {
            value: RegExp(FormPatternsEnums.allowNumbers),
            message: formatMessage(phrasesMessages.justAllowNumbers),
          },
        }),
        ...formRules,
      }}
      render={({ field: { onBlur, onChange, value } }) => (
        <HBTextField
          required={!!formRules?.required}
          label={label}
          onChange={(e) =>
            digitMapper ? onChange(toEnNumConverter(e.target.value)) : onChange(e.target.value)
          }
          onBlur={onBlur}
          value={value}
          fullWidth
          helperText={errorMessage as string}
          error={!!errorMessage || hasError}
          maskOptions={{ mask }}
          readOnly={props.readOnly}
          sx={{
            // [`& .${formLabelClasses.filled}`]: {
            //   color: (theme) => theme.palette.primary.main,
            // },
            [`& .${formHelperTextClasses.root}`]: {
              mx: 0,
            },
            [`& .${outlinedInputClasses.input}`]: {
              textAlign: inputAlign,
            },
            [`& .${outlinedInputClasses.root}`]: {
              pr: inputAlign === 'end' ? 0.5 : 3.5,
            },
            // [`& .${outlinedInputClasses.root}, & .${outlinedInputClasses.root}:hover`]: {
            //   '& > fieldset': {
            //     borderColor: (theme) => theme.palette.grey[300],
            //   },
            // },
            input: {
              '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 1000px white inset',
              },
            },
          }}
          {...props}
        />
      )}
    />
  )
}

export default memo(HBTextFieldController)
