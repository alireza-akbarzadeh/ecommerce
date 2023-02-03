import { ButtonProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBCircularProgressBtn } from '../HBCircularProgressBtn'
import { HBButtonRootStyle } from './HBButton.styles'

export interface HBButtonProps extends Omit<ButtonProps, 'ref'> {
  loading?: boolean
}

const HBButton = forwardRef(
  <T extends HTMLButtonElement>(
    { children, loading, ...props }: HBButtonProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <HBButtonRootStyle {...props} ref={ref} disabled={props.disabled || loading}>
        {loading ? <HBCircularProgressBtn size={20} /> : children}
      </HBButtonRootStyle>
    )
  },
)

HBButton.displayName = 'HBButton'
HBButton.defaultProps = {
  variant: 'contained',
  color: 'primary',
}

export default HBButton
