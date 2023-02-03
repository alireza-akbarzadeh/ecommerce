import { Checkbox, CheckboxProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBCheckBoxCheckedStyle, HBCheckBoxUncheckedStyle } from './HBCheckBox.styles'

export type HBCheckBoxProps = Omit<CheckboxProps, 'ref'>

const HBCheckBox = forwardRef(
  <T extends HTMLButtonElement>(props: CheckboxProps, ref: ForwardedRef<T>) => {
    return (
      <Checkbox
        disableRipple
        checkedIcon={<HBCheckBoxCheckedStyle />}
        icon={<HBCheckBoxUncheckedStyle />}
        ref={ref}
        {...props}
      />
    )
  },
)

HBCheckBox.displayName = 'HBCheckBox'
HBCheckBox.defaultProps = {}

export default HBCheckBox
