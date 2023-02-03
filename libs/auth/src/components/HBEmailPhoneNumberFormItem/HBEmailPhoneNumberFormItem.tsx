import { HBSubmitButton, HBTextFieldProps } from '@hasty-bazar/core'
import phrasesMessages from 'libs/core/src/translations/phrases.messages'
import { ReactNode } from 'react'
import { RegisterOptions } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { HBemailPhoneNumberController } from '../HBemailPhoneNumberController'
import { HBFormHeader } from '../HBFormHeader'
import { HBEmailPhoneNumberFormItemRootStyle } from './HBEmailPhoneNumberFormItem.styles'

export type HBEmailPhoneNumberFormItemProps = {
  headerTitle?: string
  headerSubTitle?: string
  formError?: string
  formName?: string
  formLabel?: string
  firstBtnText?: string
  secondBtnText?: string
  firstBtnOnclick?: () => void
  secondBtnOnclick?: () => void
  firstBtnLoading?: boolean
  secondBtnLoading?: boolean
  children?: ReactNode
  firstBtnDisable?: boolean
  textFieldProps?: HBTextFieldProps
  formRules?: RegisterOptions
  inputMask?: string
}

const HBEmailPhoneNumberFormItem = (props: HBEmailPhoneNumberFormItemProps) => {
  const { formatMessage } = useIntl()
  const {
    headerTitle = formatMessage(phrasesMessages.forgetPassword),
    headerSubTitle = formatMessage(phrasesMessages.forgetPasswordSubTitle),
    formError,
    formName,
    formLabel,
    firstBtnText = formatMessage(phrasesMessages.nextLevel),
    secondBtnText = formatMessage(phrasesMessages.back),
    firstBtnOnclick,
    secondBtnOnclick,
    textFieldProps,
    firstBtnLoading,
    secondBtnLoading,
    firstBtnDisable = false,
    children,
    formRules,
    inputMask,
  } = props

  return (
    <HBEmailPhoneNumberFormItemRootStyle>
      <HBFormHeader title={headerTitle} subTitle={headerSubTitle} />
      <HBemailPhoneNumberController
        sx={{
          mt: 8,
        }}
        errorMessage={formError}
        textFieldProps={textFieldProps}
        formName={formName}
        label={formLabel}
        formRules={formRules}
        inputMask={inputMask}
      />
      {children && children}
      <HBSubmitButton
        buttonText={firstBtnText}
        backButtonText={secondBtnText}
        buttonOnClick={firstBtnOnclick}
        backButtonOnclick={secondBtnOnclick}
        buttonLoading={firstBtnLoading}
        backButtonLoading={secondBtnLoading}
        firstBtnDisable={firstBtnDisable}
        sx={{ mt: 8 }}
      />
    </HBEmailPhoneNumberFormItemRootStyle>
  )
}

HBEmailPhoneNumberFormItem.displayName = 'HBEmailPhoneNumberFormItem'
HBEmailPhoneNumberFormItem.defaultProps = {}

export default HBEmailPhoneNumberFormItem
