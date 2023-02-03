import { TextFieldProps } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { HTMLInputTypeAttribute } from 'react'
import { ForwardedRef, forwardRef, useState } from 'react'
import { FormPatternsEnums } from '../../enums'
import { HBIcon } from '../HBIcon'
import { HBInputBase, maskOptionsType } from '../HBInputBase'
import {
  HBHelperTextStyle,
  HBHelperTextWrapperStyle,
  HBTextFieldRootStyle,
} from './HBTextField.styles'

export type HBTextFieldProps = Omit<TextFieldProps, 'ref'> & {
  maskOptions?: maskOptionsType
  helperTextIcon?: boolean
}

const HBTextField = forwardRef(
  <T extends HTMLInputElement>(
    {
      type,
      helperText,
      InputProps,
      inputProps,
      maskOptions,
      size = 'small',
      multiline,
      helperTextIcon = true,
      ...props
    }: HBTextFieldProps,
    ref: ForwardedRef<T>,
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => {
      setShowPassword(!showPassword)
    }

    const typeSelector = (type?: HTMLInputTypeAttribute): HTMLInputTypeAttribute => {
      if (!type) return 'text'
      switch (type) {
        case 'number':
          return 'text'
        case 'password':
          if (showPassword) return 'text'
          return 'password'
        default:
          return type
      }
    }
    const needInputBase = !!maskOptions?.mask || props.disabled
    return (
      <HBTextFieldRootStyle
        size={size}
        type={typeSelector(type)}
        inputProps={{
          ...(type === 'number' && {
            inputMode: 'numeric',
            pattern: FormPatternsEnums.allowNumbers,
          }),
          ...inputProps,
          maskOptions,
        }}
        multiline={multiline}
        InputProps={{
          ...InputProps,
          inputComponent: needInputBase ? HBInputBase : undefined,
          endAdornment: (
            <InputAdornment position="end">
              {type === 'password' && (
                <IconButton size="small" onClick={handleClickShowPassword}>
                  <HBIcon size="medium" type={showPassword ? 'eye' : 'eyeSlash'} />
                </IconButton>
              )}
              {InputProps?.endAdornment}
            </InputAdornment>
          ),
          startAdornment: InputProps?.startAdornment,
        }}
        ref={ref}
        helperText={
          helperText && (
            <HBHelperTextWrapperStyle sx={{ color: props.error ? 'error.main' : 'grey.900' }}>
              {helperTextIcon && <HBIcon size="small" type="infoCircle" />}
              <HBHelperTextStyle>{helperText}</HBHelperTextStyle>
            </HBHelperTextWrapperStyle>
          )
        }
        {...props}
      />
    )
  },
)

HBTextField.displayName = 'HBTextField'
HBTextField.defaultProps = {}

export default HBTextField
