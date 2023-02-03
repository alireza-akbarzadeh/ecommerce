import { HBTextField, HBTextFieldProps, toEnNumConverter } from '@hasty-bazar/core'
import { inputBaseClasses, Theme } from '@mui/material'
import { SxProps, SystemStyleObject } from '@mui/system'
import phrasesMessages from 'libs/core/src/translations/phrases.messages'
import { useRef } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { HBemailPhoneNumberControllerRootStyle } from './HBemailPhoneNumberController.styles'

export interface HBemailPhoneNumberControllerProps {
  formName?: string
  errorMessage?: string
  label?: string
  sx?: SxProps<Theme>
  formRules?: RegisterOptions
  inputMask?: string
  pattern?: RegExp
  textFieldProps?: HBTextFieldProps
  disabled?: boolean
}
const HBemailPhoneNumberController = (props: HBemailPhoneNumberControllerProps) => {
  const { formatMessage } = useIntl()
  const {
    formName = 'emailPhoneNumber',
    errorMessage: message = formatMessage(phrasesMessages.emailOrPhoneNumberIsRequired),
    label = formatMessage(phrasesMessages.emailOrPhoneNumber),
    sx,
    formRules,
    inputMask: mask,
    textFieldProps,
    disabled = false,
  } = props
  const Form = useFormContext()
  const pattern = {
    value: props.pattern ? props.pattern : /^((0\d{10})|([a-z0-9.]{1,}@\w{3,}\.\w{2,}))$/i,
    message,
  }
  const errorMessage = Form.formState.errors[formName]?.message
  const textInput = useRef(null)

  return (
    <HBemailPhoneNumberControllerRootStyle sx={sx}>
      {Form && (
        <Controller
          rules={
            formRules ?? {
              required: {
                value: true,
                message: formatMessage(phrasesMessages.emailOrPhoneNumberIsRequired),
              },
              pattern,
            }
          }
          name={formName}
          control={Form.control}
          render={({ field }) => (
            <HBTextField
              sx={{
                [`& .${inputBaseClasses.input}`]: {
                  direction: 'rtl',
                },
              }}
              disabled={disabled}
              maskOptions={{ mask }}
              inputRef={textInput}
              {...field}
              onChange={(e) => field.onChange(toEnNumConverter(e.target.value))}
              label={label}
              fullWidth
              error={!!errorMessage}
              {...textFieldProps}
            />
          )}
        />
      )}
    </HBemailPhoneNumberControllerRootStyle>
  )
}
HBemailPhoneNumberController.displayName = 'HBemailPhoneNumberController'
HBemailPhoneNumberController.defaultProps = {}

export default HBemailPhoneNumberController
