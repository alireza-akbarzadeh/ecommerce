import { Grow, Theme } from '@mui/material'
import { SxProps } from '@mui/system'
import { FC, useState } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'
import { HBStringValidation } from '../HBStringValidation'
import { HBTextField, HBTextFieldProps } from '../HBTextField'
import { HBFormItemTextFieldRootStyle } from './HBFormItemTextField.styles'

type arrayHelperTextType = {
  [key: string]: string
}
export type HBFormItemTextFieldProps = Omit<HBTextFieldProps, 'sx' | 'error'> & {
  rules?: RegisterOptions
  sx?: SxProps<Theme>
  formName: string
  helperTextType?: 'none' | 'helperText' | 'arrayHelperText' | 'arrayHelperTextByClick'
  arrayHelperText?: arrayHelperTextType[]
  inputSx?: SxProps<Theme>
}

const HBFormItemTextField: FC<HBFormItemTextFieldProps> = (props) => {
  const {
    sx,
    inputSx,
    rules,
    formName,
    helperTextType = 'none',
    arrayHelperText,
    onChange,
    ...HBTextFieldProps
  } = props
  const form = useFormContext()
  const [focused, setFocused] = useState<boolean>(false)
  const defaultValue = form?.watch(formName) || ''
  return (
    <HBFormItemTextFieldRootStyle sx={sx}>
      {form && (
        <Controller
          name={formName}
          rules={rules}
          defaultValue={defaultValue}
          control={form.control}
          render={({ field, fieldState, formState: { errors, isValidating, isDirty } }) => {
            const { onChange: onChangeField } = field
            return (
              <>
                {/* @ts-ignore */}
                <HBTextField
                  fullWidth
                  sx={inputSx}
                  error={!!errors[formName]?.message}
                  {...field}
                  onChange={(e) => {
                    onChangeField(e.target.value)
                    onChange?.(e)
                  }}
                  {...HBTextFieldProps}
                  {...(helperTextType === 'arrayHelperTextByClick' && {
                    onFocus: () => setFocused(true),
                    onBlur: () => {
                      setFocused(false)
                      field.onBlur()
                    },
                  })}
                  {...(helperTextType === 'helperText' && {
                    helperText: fieldState?.error?.message || errors[formName]?.message,
                  })}
                />

                {Array.isArray(arrayHelperText) &&
                  (helperTextType === 'arrayHelperText' ||
                    helperTextType === 'arrayHelperTextByClick') &&
                  arrayHelperText.map((item, key) => {
                    const err = errors[formName]?.types || {}
                    if (helperTextType === 'arrayHelperTextByClick')
                      return (
                        <Grow
                          in={focused}
                          unmountOnExit
                          mountOnEnter
                          timeout={{ enter: 800, exit: 100 }}
                          key={key}
                        >
                          <HBStringValidation
                            key={key}
                            text={Object.values(item)[0]}
                            //@ts-ignore
                            isActive={!isValidating && !err[Object.keys(item)[0]] && isDirty}
                            loading={isValidating}
                          />
                        </Grow>
                      )
                    else
                      return (
                        <HBStringValidation
                          key={key}
                          text={Object.values(item)[0]}
                          //@ts-ignore

                          isActive={!isValidating && !err[Object.keys(item)[0]] && isDirty}
                          loading={isValidating}
                        />
                      )
                  })}
              </>
            )
          }}
        />
      )}
    </HBFormItemTextFieldRootStyle>
  )
}

HBFormItemTextField.displayName = 'HBFormItemTextField'
HBFormItemTextField.defaultProps = {}

export default HBFormItemTextField
