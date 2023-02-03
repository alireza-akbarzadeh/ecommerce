import { InputBaseComponentProps } from '@mui/material'
import { forwardRef } from 'react'
import { HBInputBaseRootStyle } from './HBInputBase.styles'
type IMaskInputProps = any
export interface maskOptionsType extends Omit<IMaskInputProps, 'mask'> {
  mask: any
  valueType?: 'maskedValue' | 'unmaskedValue'
}
export interface HBInputBaseProps extends Omit<InputBaseComponentProps, 'ref'> {
  maskOptions?: maskOptionsType
}

const HBInputBase = forwardRef((props: HBInputBaseProps, ref: any) => {
  const { maskOptions, value, onChange, ...otherProps } = props
  const { valueType = 'unmaskedValue' } = maskOptions || {}
  return (
    <HBInputBaseRootStyle
      {...otherProps}
      {...maskOptions}
      inputRef={ref}
      value={String(value || '')}
      onAccept={(value: any, input) =>
        onChange(
          {
            target: {
              value: valueType === 'maskedValue' ? value : input?.unmaskedValue,
            },
          },
          input?.unmaskedValue,
        )
      }
      mask={maskOptions?.mask ?? String}
      definitions={{
        '0': /[0-9۰-۹]/,
        '*': /[A-Za-z0-9۰-۹]/,
      }}
    />
  )
})
HBInputBase.displayName = 'HBInputBase'
HBInputBase.defaultProps = {}

export default HBInputBase
