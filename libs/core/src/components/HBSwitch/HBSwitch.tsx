import { SwitchProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBSwitchRootStyle } from './HBSwitch.styles'

export interface HBSwitchProps extends Omit<SwitchProps, 'ref'> {
  disabled?: boolean
  checked?: boolean
}

const HBSwitch = forwardRef(
  <T extends HTMLButtonElement>(props: HBSwitchProps, ref: ForwardedRef<T>) => {
    return <HBSwitchRootStyle ref={ref} {...props} />
  },
)

HBSwitch.displayName = 'HBSwitch'
HBSwitch.defaultProps = {}

export default HBSwitch
