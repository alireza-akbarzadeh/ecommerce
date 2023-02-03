import { PopoverProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBPopoverRootStyle } from './HBPopover.styles'

export type HBPopoverProps = Omit<PopoverProps, 'ref'>

const HBPopover = forwardRef(
  <T extends HTMLDivElement>(props: HBPopoverProps, ref: ForwardedRef<T>) => {
    return (
      <HBPopoverRootStyle ref={ref} {...props}>
        {props.children}
      </HBPopoverRootStyle>
    )
  },
)

HBPopover.displayName = 'HBPopover'
HBPopover.defaultProps = {}

export default HBPopover
