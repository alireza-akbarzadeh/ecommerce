import { HBSubmitButton, HBTextFieldProps } from '@hasty-bazar/core'
import { Button, Grid, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import phrasesMessages from 'libs/core/src/translations/phrases.messages'
import { ForwardedRef, forwardRef, ReactNode } from 'react'
import { RegisterOptions } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { HBemailPhoneNumberController } from '../HBemailPhoneNumberController'
import { HBFormHeader } from '../HBFormHeader'
import { HBPasswordController } from '../HBPasswordController'
import { HBLoginFormItemRootStyle } from './HBLoginFormItem.styles'
export type HBLoginFormItemProps = {
  headerTitle?: string
  headerSubTitle?: string
  children?: ReactNode
  firstBtnText?: string
  secondBtnText?: string
  firstBtnDisable?: boolean
  secondBtnDisable?: boolean
  secondBtnOnclick?: () => void
  firstBtnOnclick?: () => void
  firstBtnLoading?: boolean
  secondBtnLoading?: boolean
  firstLinkText?: string
  secondLinkText?: string
  firstLinkOnclick?: () => void
  secondLinkOnclick?: () => void
  emailFormName?: string
  emailFormLabel?: string
  passwordFormName?: string
  passwordFormLabel?: string
  emailFormErrorMessage?: string
  sx?: SxProps<Theme>
  usernamePattern?: RegExp
  textFieldProps?: HBTextFieldProps
  emailFormRules?: RegisterOptions
  emailFormInputMask?: string
  emailFormDisabled?: boolean
}

const HBLoginFormItem = forwardRef(
  <T extends HTMLDivElement>(props: HBLoginFormItemProps, ref: ForwardedRef<T>) => {
    const { formatMessage } = useIntl()
    const {
      headerTitle = formatMessage(phrasesMessages.login),
      headerSubTitle = formatMessage(phrasesMessages.loginSubTitle),
      firstBtnText = formatMessage(phrasesMessages.login),
      secondBtnText,
      textFieldProps,
      firstBtnOnclick,
      secondBtnOnclick,
      firstBtnDisable,
      usernamePattern,
      secondBtnDisable,
      firstBtnLoading,
      secondBtnLoading,
      firstLinkText = formatMessage(phrasesMessages.loginWithCode),
      secondLinkText = formatMessage(phrasesMessages.forgetPassword),
      firstLinkOnclick,
      secondLinkOnclick,
      children,
      emailFormName = 'username',
      emailFormLabel,
      emailFormErrorMessage,
      passwordFormName = 'password',
      passwordFormLabel,
      sx,
      emailFormRules,
      emailFormInputMask,
      emailFormDisabled,
    } = props
    return (
      <HBLoginFormItemRootStyle ref={ref} {...props} sx={sx}>
        <HBFormHeader title={headerTitle} subTitle={headerSubTitle} />
        <HBemailPhoneNumberController
          // sx={{ mt: 6 }}
          formName={emailFormName}
          label={emailFormLabel}
          errorMessage={emailFormErrorMessage}
          formRules={emailFormRules}
          pattern={usernamePattern}
          inputMask={emailFormInputMask}
          textFieldProps={textFieldProps}
          disabled={emailFormDisabled}
        />
        <HBPasswordController
          sx={{ mt: 6 }}
          formName={passwordFormName}
          label={passwordFormLabel}
        />
        {children && children}
        <Grid container justifyContent={'space-between'} sx={{ mt: 8 }}>
          {secondLinkOnclick && (
            <Button color="info" onClick={secondLinkOnclick}>
              {secondLinkText}
            </Button>
          )}
          {firstLinkOnclick && (
            <Button color="info" onClick={firstLinkOnclick}>
              {firstLinkText}
            </Button>
          )}
        </Grid>
        <HBSubmitButton
          buttonText={firstBtnText}
          backButtonText={secondBtnText}
          buttonOnClick={firstBtnOnclick}
          backButtonOnclick={secondBtnOnclick}
          buttonLoading={firstBtnLoading}
          backButtonLoading={secondBtnLoading}
          firstBtnDisable={firstBtnDisable}
          secondBtnDisable={secondBtnDisable}
          sx={{ mt: 11 }}
        />
      </HBLoginFormItemRootStyle>
    )
  },
)

HBLoginFormItem.displayName = 'HBLoginFormItem'
HBLoginFormItem.defaultProps = {}

export default HBLoginFormItem
