import { HBSubmitButton } from '@hasty-bazar/core'
import { Box, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { ReactNode } from 'react'
import { RegisterOptions } from 'react-hook-form'
import { HBAuthenticationController } from '../HBAuthenticationController'
import { HBFormHeader } from '../HBFormHeader'
import { HBAuthenticationFormItemRootStyle } from './HBAuthenticationFormItem.styles'

export type HBAuthenticationFormItemProps = {
  sx?: SxProps<Theme>
  headerTitle?: string
  headerSubTitle?: string
  formName?: string
  formLabel?: string
  formRules?: RegisterOptions
  verificationCodeTime?: number
  extraTimerText?: string
  timeoutBtnCallBack?: () => void
  timeoutText?: string
  children?: ReactNode
  firstBtnText?: string
  secondBtnText?: string
  firstBtnOnclick?: () => void
  secondBtnOnclick?: () => void
  firstBtnLoading?: boolean
  secondBtnLoading?: boolean
  inputMask?: string
  buttonType?: 'submit' | 'reset' | 'button' | undefined
  firstBtnDisable?: boolean
}

const HBAuthenticationFormItem = (props: HBAuthenticationFormItemProps) => {
  const {
    headerTitle = 'احراز هویت',
    headerSubTitle = 'کد ارسال شده به شماره xxxxxxxxx  را وارد کنید.',
    sx,
    formName,
    formLabel,
    formRules,
    verificationCodeTime,
    extraTimerText,
    timeoutBtnCallBack,
    timeoutText,
    children,
    firstBtnText = 'ورود',
    secondBtnText: backButtonText = 'بازگشت',
    firstBtnOnclick,
    secondBtnOnclick,
    firstBtnLoading,
    secondBtnLoading,
    inputMask,
    buttonType,
    firstBtnDisable,
  } = props

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      !firstBtnDisable && firstBtnOnclick?.()
    }
  }

  return (
    <HBAuthenticationFormItemRootStyle sx={sx}>
      <HBFormHeader title={headerTitle} subTitle={headerSubTitle} />
      <HBAuthenticationController
        sx={{ mt: 8 }}
        label={formLabel}
        onKeyPress={handleKeyPress}
        {...{
          formName,
          formRules,
          verificationCodeTime,
          extraTimerText,
          timeoutBtnCallBack,
          timeoutText,
          inputMask,
        }}
      />
      <Box sx={{ mt: 8 }}>{children}</Box>
      <HBSubmitButton
        buttonText={firstBtnText}
        backButtonText={backButtonText}
        buttonOnClick={firstBtnOnclick}
        backButtonOnclick={secondBtnOnclick}
        buttonLoading={firstBtnLoading}
        backButtonLoading={secondBtnLoading}
        buttonType={buttonType}
        sx={{ mt: 8 }}
        firstBtnDisable={firstBtnDisable}
      />
    </HBAuthenticationFormItemRootStyle>
  )
}

HBAuthenticationFormItem.displayName = 'HBAuthenticationFormItem'
HBAuthenticationFormItem.defaultProps = {}

export default HBAuthenticationFormItem
