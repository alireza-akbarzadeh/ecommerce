import { HBTextField, HBValidatorField, HBValidatorFieldRulesType } from '@hasty-bazar/core'
import { Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { ForwardedRef, forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import * as yup from 'yup'
import { HBChangePasswordControllerRootStyle } from './HBSePasswordController.styles'

export type HBChangePasswordControllerProps = {
  formName?: string
  label?: string
  sx?: SxProps<Theme>
  validatorFieldRules?: HBValidatorFieldRulesType[]
}

const _validatorFieldRules = [
  // {
  //   isActive: false,
  //   text: ' حداقل یک کاراکتر خاص',
  //   name: 'Special',
  //   validator: RegExp('[!@#$%^&*(),.?":{}|<>]'),
  // },
  {
    isActive: false,
    text: 'حداقل  یک عدد',
    name: 'Number',
    validator: RegExp('(.*\\d.*)'),
  },
  {
    isActive: false,
    text: ' حداقل  یک حرف بزرگ انگلیسی',
    name: 'Uppercase',
    validator: RegExp('(.*[A-Z].*)'),
  },
  {
    isActive: false,
    text: 'عدم استفاده از حروف فارسی',
    name: 'OtherLanguage',
    // eslint-disable-next-line no-control-regex
    validator: RegExp('^[\\x00-\\x7f]+$'),
  },
  {
    isActive: false,
    text: 'حداقل ۸ کاراکتر',
    name: 'min',
    validator: RegExp('^.{8,}$'),
  },
  {
    isActive: false,
    text: 'حداکثر 20 کاراکتر',
    name: 'max',
    validator: RegExp('^.{1,20}$'),
  },
]
const _passwordSchema = yup.object({
  password: yup
    .string()
    .required('Require')
    .min(8, 'min')
    .max(20, 'max')
    .matches(RegExp('(.*[a-z].*)'), 'Lowercase')
    .matches(RegExp('(.*[A-Z].*)'), 'Uppercase')
    .matches(RegExp('(.*\\d.*)'), 'Number')
    // .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), 'Special')
    // eslint-disable-next-line no-control-regex
    .matches(RegExp('^[\\x00-\\x7f]*$'), 'OtherLanguage'),
})
const HBChangePasswordController = forwardRef(
  <T extends HTMLDivElement>(props: HBChangePasswordControllerProps, ref: ForwardedRef<T>) => {
    const { formName = 'password', label = 'رمز عبور', sx, validatorFieldRules } = props
    const Form = useFormContext()
    return (
      <HBChangePasswordControllerRootStyle ref={ref} sx={sx}>
        {Form && (
          <Controller
            name={formName}
            control={Form.control}
            rules={{
              validate: (password) =>
                _passwordSchema.validate({ password }).catch((e) => e.message),
            }}
            render={({ field }) => (
              <>
                <HBTextField label={label} {...field} fullWidth type={'password'} />
                <HBValidatorField
                  value={field.value || ''}
                  rules={validatorFieldRules ?? _validatorFieldRules}
                />
              </>
            )}
          />
        )}
      </HBChangePasswordControllerRootStyle>
    )
  },
)

HBChangePasswordController.displayName = 'HBChangePasswordController'
HBChangePasswordController.defaultProps = {}

export default HBChangePasswordController
