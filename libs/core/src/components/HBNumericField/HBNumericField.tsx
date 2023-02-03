import {
  FilledInputProps,
  InputProps,
  OutlinedInputProps,
  SxProps,
  TextField,
  Theme,
} from '@mui/material'
import React, { FocusEvent, ForwardedRef, forwardRef } from 'react'
import { NumericFormat } from 'react-number-format'

export interface HBNumericFieldProps {
  allowNegative?: boolean
  separator?: string
  placeholder?: string
  fullWidth?: boolean
  required?: boolean
  label?: string
  size?: 'small' | 'medium'
  style?: React.CSSProperties
  sx?: SxProps<Theme>
  onChange?: (value: number) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  value?: number
  error?: boolean
  helperText?: string
  readOnly?: boolean
  disabled?: boolean
  InputProps?:
    | Partial<InputProps>
    | Partial<FilledInputProps>
    | Partial<OutlinedInputProps>
    | undefined
}

const HBNumericField = forwardRef(
  <T extends HTMLElement>(
    {
      separator = ',',
      size = 'small',
      placeholder = '',
      fullWidth = true,
      onChange,
      onBlur,
      value,
      error,
      helperText,
      readOnly,
      disabled,
      InputProps,
      ...props
    }: HBNumericFieldProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <NumericFormat
        {...{
          placeholder,
          onBlur,
          value,
          error,
          helperText,
          readOnly,
          disabled,
          InputProps,
        }}
        onValueChange={(values) => onChange?.(values?.floatValue!)}
        fullWidth
        thousandSeparator={separator}
        customInput={TextField}
        size={size}
        {...props}
      />
    )
  },
)

HBNumericField.displayName = 'HBNumericField'
HBNumericField.defaultProps = {}

export default HBNumericField
