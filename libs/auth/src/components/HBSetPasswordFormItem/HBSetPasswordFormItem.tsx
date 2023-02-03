import { HBSubmitButton, HBValidatorFieldRulesType } from '@hasty-bazar/core'
import { ForwardedRef, forwardRef, ReactNode } from 'react'
import { HBFormHeader } from '../HBFormHeader'
import { HBChangePasswordController } from '../HBSetPasswordController'
import { HBChangePasswordFormItemRootStyle } from './HBSetPasswordFormItem.styles'

export type HBChangePasswordFormItemProps = {
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
  validatorFieldRules?: HBValidatorFieldRulesType[]
  firstBtnDisable?: boolean
}

const HBChangePasswordFormItem = forwardRef(
  <T extends HTMLDivElement>(props: HBChangePasswordFormItemProps, ref: ForwardedRef<T>) => {
    const {
      headerTitle = 'انتخاب رمز عبور جدید',
      headerSubTitle = 'رمز عبور جدید خود را انتخاب کنید',
      formName,
      formLabel,
      firstBtnText = 'تایید رمز عبور',
      secondBtnText = 'انصراف',
      firstBtnOnclick,
      secondBtnOnclick: backButtonOnclick,
      firstBtnLoading,
      secondBtnLoading: backButtonLoading,
      children,
      validatorFieldRules,
      firstBtnDisable,
    } = props
    return (
      <HBChangePasswordFormItemRootStyle ref={ref} {...props}>
        <HBFormHeader title={headerTitle} subTitle={headerSubTitle} />
        <HBChangePasswordController
          sx={{ mt: 8 }}
          formName={formName}
          label={formLabel}
          validatorFieldRules={validatorFieldRules}
        />
        {children && children}
        <HBSubmitButton
          buttonText={firstBtnText}
          backButtonText={secondBtnText}
          buttonOnClick={firstBtnOnclick}
          backButtonOnclick={backButtonOnclick}
          buttonLoading={firstBtnLoading}
          backButtonLoading={backButtonLoading}
          firstBtnDisable={firstBtnDisable}
          sx={{ mt: 8 }}
        />
      </HBChangePasswordFormItemRootStyle>
    )
  },
)

HBChangePasswordFormItem.displayName = 'HBChangePasswordFormItem'
HBChangePasswordFormItem.defaultProps = {}

export default HBChangePasswordFormItem
