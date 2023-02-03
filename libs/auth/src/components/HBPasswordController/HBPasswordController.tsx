import { HBTextField, toEnNumConverter } from '@hasty-bazar/core'
import { inputBaseClasses, Theme } from '@mui/material'
import { SxProps, SystemStyleObject } from '@mui/system'
import { ForwardedRef, forwardRef, useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import * as yup from 'yup'
import { FormPatternsEnums } from '../../../../core/src/enums'

import { HBPasswordControllerRootStyle } from './HBPasswordController.styles'

export const enum PasswordLevel {
  High = 'High',
  Low = 'Low',
  Medium = 'Medium',
}

export type HBPasswordControllerProps = {
  formName?: string
  label?: string
  sx?: SxProps<Theme>
  options?: {
    minLength?: number
    maxLength?: number
    level?: PasswordLevel
  }
}

const HBPasswordController = forwardRef(
  <T extends HTMLDivElement>(props: HBPasswordControllerProps, ref: ForwardedRef<T>) => {
    const { formatMessage } = useIntl()
    const {
      formName = 'password',
      label = 'رمز عبور',
      sx,
      options = {
        level: PasswordLevel.Medium,
        maxLength: 20,
        minLength: 6,
      },
    } = props

    const passwordLevel = (passwordLevel: PasswordLevel) => {
      const minLength = options?.minLength!
      const maxLength = options?.maxLength!
      switch (passwordLevel) {
        case PasswordLevel.High:
          return {
            password: yup
              .string()
              .required('لطفا کلمه عبور را وارد نمایید')
              .min(minLength, `حداقل طول کلمه عبور ${minLength} کارکتر می باشد`)
              .max(maxLength, `حداکثر طول کلمه عبور ${maxLength} کارکتر می باشد`)
              .matches(
                RegExp(FormPatternsEnums.containsNumber),
                'حداقل یک کاراکتر کوچک در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.containsSpecialCharacter),
                'حداقل یک کاراکتر بزرگ در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.containsLowerCase),
                'حداقل یک عدد در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.atLeastMustHaveOneCapitalLetter),
                'حداقل یک کاراکتر خاص در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.allowLetters),
                'حتما از زبان انگلیسی جهت کلمه عبور استفاده نمایید',
              ),
          }
        case PasswordLevel.Medium:
          return {
            password: yup
              .string()
              .required('لطفا کلمه عبور را وارد نمایید')
              .min(minLength, `حداقل طول کلمه عبور ${minLength} کارکتر می باشد`)
              .max(maxLength, `حداکثر طول کلمه عبور ${maxLength} کارکتر می باشد`)
              .matches(RegExp(FormPatternsEnums.containsNumber), 'حداقل یک عدد در کلمه عبور باشد')
              .matches(
                RegExp(FormPatternsEnums.containsOneEnglishLetter),
                'حداقل یک کاراکتر انگلیسی در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.containsUpperCase),
                'حداقل یک کاراکتر بزرگ در کلمه عبور باشد',
              ),
          }
        case PasswordLevel.Low:
          return {
            password: yup
              .string()
              .required('لطفا کلمه عبور را وارد نمایید')
              .min(minLength, `حداقل طول کلمه عبور ${minLength} کارکتر می باشد`)
              .max(maxLength, `حداکثر طول کلمه عبور ${maxLength} کارکتر می باشد`)
              .matches(
                RegExp(FormPatternsEnums.allowLetters),
                'حتما از زبان انگلیسی جهت کلمه عبور استفاده نمایید',
              ),
          }

        default:
          return {
            password: yup
              .string()
              .required('لطفا کلمه عبور را وارد نمایید')
              .min(minLength, `حداقل طول کلمه عبور ${minLength} کارکتر می باشد`)
              .max(maxLength, `حداکثر طول کلمه عبور ${maxLength} کارکتر می باشد`)
              .matches(
                RegExp(FormPatternsEnums.containsNumber),
                'حداقل یک کاراکتر کوچک در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.containsSpecialCharacter),
                'حداقل یک کاراکتر بزرگ در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.containsLowerCase),
                'حداقل یک عدد در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.atLeastMustHaveOneCapitalLetter),
                'حداقل یک کاراکتر خاص در کلمه عبور باشد',
              )
              .matches(
                RegExp(FormPatternsEnums.allowLetters),
                'حتما از زبان انگلیسی جهت کلمه عبور استفاده نمایید',
              ),
          }
      }
    }
    const _passwordSchema = useMemo(
      () => yup.object(passwordLevel(options.level || PasswordLevel.High)),
      [options.level],
    )

    const Form = useFormContext()

    return (
      <HBPasswordControllerRootStyle ref={ref} sx={sx}>
        {Form && (
          <Controller
            name={formName}
            control={Form.control}
            rules={{
              validate: (password) =>
                _passwordSchema.validate({ password }).catch((e) => e.message),
            }}
            render={({ field, formState: { errors } }) => (
              <HBTextField
                sx={{
                  [`& .${inputBaseClasses.input}`]: {
                    direction: 'rtl',
                  },
                }}
                label={label}
                {...field}
                onChange={(e) => field.onChange(toEnNumConverter(e.target.value))}
                fullWidth
                type={'password'}
                error={!!errors[formName]?.message}
              />
            )}
          />
        )}
      </HBPasswordControllerRootStyle>
    )
  },
)

HBPasswordController.displayName = 'HBPasswordController'
HBPasswordController.defaultProps = {}

export default HBPasswordController
