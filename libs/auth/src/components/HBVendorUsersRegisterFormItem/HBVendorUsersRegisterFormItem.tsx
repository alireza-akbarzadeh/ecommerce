import { HBClassesType, HBSubmitButton } from '@hasty-bazar/core'
import { Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { ReactNode, useEffect, useState } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'
import { HBCheckBoxController } from '../HBCheckBoxController'
import { HBFormHeader } from '../HBFormHeader'
import HBStringValidatorController from '../HBStringValidatorController/HBStringValidatorController'
import { HBTextFieldController } from '../HBTextFieldController'
import { HBVendorUsersRegisterFormItemRootStyle } from './HBVendorUsersRegisterFormItem.styles'
import { isOffensiveWord } from './rule'

type firstBtnOnClickProps = {
  name: string
  familly: string
  nationalCode: string
  vendorName: string
}
export type HBVendorUsersRegisterFormItemProps = {
  headerTitle?: string
  headerSubTitle?: string
  formError?: string
  formName?: string
  formLabel?: string
  firstBtnText?: string
  secondBtnText?: string
  firstBtnOnclick?: (props: firstBtnOnClickProps) => void
  secondBtnOnclick?: () => void
  firstBtnLoading?: boolean
  secondBtnLoading?: boolean
  children?: ReactNode
  firstBtnDisable?: boolean
  formRules?: RegisterOptions
  inputMask?: string

  nameFormName?: string
  nameFormLabel?: string
  famillyFormName?: string
  famillyFormLabel?: string
  nationalCodeFormName?: string
  nationalCodeFormLabel?: string
  vendorFormName?: string
  vendorFormLabel?: string
  checkBoxFormName?: string
  checkBoxText?: string
  checkBoxTextOnclick?: () => void
  sx?: SxProps<Theme>
}

const classes: HBClassesType<'common'> = {
  common: { mt: 8 },
}

const HBVendorUsersRegisterFormItem = (props: HBVendorUsersRegisterFormItemProps) => {
  const {
    headerTitle = 'ثبت نام فروشنده',
    headerSubTitle = 'نام فروشگاه خود را وارد نمایید. این نام برای کاربران دیگر نیز نمایش داده خواهد شد.',
    firstBtnText = 'مرحله بعد',
    secondBtnText = 'بازگشت',
    firstBtnOnclick,
    secondBtnOnclick,
    firstBtnLoading,
    secondBtnLoading,
    children,

    nameFormName = 'name',
    nameFormLabel = 'نام',
    famillyFormName = 'familly',
    famillyFormLabel = 'نام خانوادگی',
    nationalCodeFormName = 'nationalCode',
    nationalCodeFormLabel = 'کد ملی',
    vendorFormName = 'vendor',
    vendorFormLabel = 'نام فروشگاه',
    checkBoxFormName = 'rule',
    checkBoxText = 'قوانین و مقررات را مطالعه نموده و با همه موارد آن موافق هستم.',
    checkBoxTextOnclick,
    sx,
  } = props
  const { formState, getValues } = useFormContext()
  const [disabled, setDisabled] = useState<boolean>(true)
  useEffect(() => {
    const require = getValues([
      nameFormName,
      famillyFormName,
      nationalCodeFormName,
      vendorFormName,
      checkBoxFormName,
    ]).every((item) => (item && item !== '' ? true : false))
    Object.keys(formState.errors).length > 0 ? setDisabled(true) : setDisabled(!require)
  }, [formState])

  const onclick = () => {
    const [name, familly, nationalCode, vendorName] = getValues([
      nameFormName,
      famillyFormName,
      nationalCodeFormName,
      vendorFormName,
      checkBoxFormName,
    ])
    firstBtnOnclick && firstBtnOnclick({ name, familly, nationalCode, vendorName })
  }
  return (
    <HBVendorUsersRegisterFormItemRootStyle sx={sx}>
      <HBFormHeader title={headerTitle} subTitle={headerSubTitle} />
      <HBStringValidatorController
        sx={classes.common}
        formName={nameFormName}
        label={nameFormLabel}
        validatorFieldRules={[
          {
            isActive: false,
            text: ' عدم استفاده از کاراکتر خاص',
            validation: ({ value, resolve, reject }) => {
              const reg = new RegExp('^[^!@#$%^&*(),.?":{}|<>]+$')
              reg.test(String(value ?? '')) ? resolve() : reject()
            },
          },
          {
            isActive: false,
            text: 'عدم استفاده از کلمات نامناسب ',
            validation: ({ value, resolve, reject }) => {
              isOffensiveWord(value as string)
                .then((data) => (data == 'ok' ? resolve() : reject()))
                .catch((err) => reject())
            },
          },
        ]}
      />
      <HBStringValidatorController
        sx={classes.common}
        formName={famillyFormName}
        label={famillyFormLabel}
        validatorFieldRules={[
          {
            isActive: false,
            text: ' عدم استفاده از کاراکتر خاص',
            validation: ({ value, resolve, reject }) => {
              const reg = new RegExp('^[^!@#$%^&*(),.?":{}|<>]+$')
              reg.test(String(value ?? '')) ? resolve() : reject()
            },
          },
          {
            isActive: false,
            text: 'عدم استفاده از کلمات نامناسب ',
            validation: ({ value, resolve, reject }) => {
              isOffensiveWord(value as string)
                .then((data) => (data == 'ok' ? resolve() : reject()))
                .catch((err) => reject())
            },
          },
        ]}
      />
      <HBTextFieldController
        sx={classes.common}
        name={nationalCodeFormName}
        label={nationalCodeFormLabel}
        formRules={{
          required: true,
          pattern: /^\d{10}/,
        }}
        mask="0000000000"
      />

      <HBStringValidatorController
        sx={classes.common}
        formName={vendorFormName}
        label={vendorFormLabel}
        validatorFieldRules={[
          {
            isActive: false,
            text: ' عدم استفاده از کاراکتر خاص',
            validation: ({ value, resolve, reject }) => {
              const reg = new RegExp('^[^!@#$%^&*(),.?":{}|<>]+$')
              reg.test(String(value ?? '')) ? resolve() : reject()
            },
          },
          {
            isActive: true,
            text: ' نام منحصر به فرد',
          },
          {
            isActive: false,
            text: 'عدم استفاده از کلمات نامناسب ',
            validation: ({ value, resolve, reject }) => {
              isOffensiveWord(value as string)
                .then((data) => (data == 'ok' ? resolve() : reject()))
                .catch((err) => reject())
            },
          },
        ]}
      />
      <HBCheckBoxController
        sx={{ mt: 8 }}
        formName={checkBoxFormName}
        linkText={checkBoxText}
        linkOnclick={checkBoxTextOnclick}
      />
      {children && children}
      <HBSubmitButton
        buttonText={firstBtnText}
        backButtonText={secondBtnText}
        buttonOnClick={onclick}
        backButtonOnclick={secondBtnOnclick}
        buttonLoading={firstBtnLoading}
        backButtonLoading={secondBtnLoading}
        firstBtnDisable={disabled}
        sx={{ mt: 8 }}
      />
    </HBVendorUsersRegisterFormItemRootStyle>
  )
}

HBVendorUsersRegisterFormItem.displayName = 'HBVendorUsersRegisterFormItem'
HBVendorUsersRegisterFormItem.defaultProps = {}

export default HBVendorUsersRegisterFormItem
