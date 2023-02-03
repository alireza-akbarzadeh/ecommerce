import { TooltipProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBToolTipRootStyle } from './HBToolTip.styles'

export type HBToolTipProps = Omit<TooltipProps, 'ref'>

const HBToolTip = forwardRef(
  <T extends HTMLButtonElement>({ children, ...props }: HBToolTipProps, ref: ForwardedRef<T>) => {
    return <HBToolTipRootStyle {...props}>{children}</HBToolTipRootStyle>
  },
)

HBToolTip.displayName = 'HBToolTip'
HBToolTip.defaultProps = {}

export default HBToolTip
