import { Radio, RadioProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBSelectedRadio, HBUnSelectedRadio } from './HBRadioButton.styles'

export type HBRadioButtonProps = Omit<RadioProps, 'ref'>

const HBRadioButton = forwardRef(
  <T extends HTMLDivElement>(props: HBRadioButtonProps, ref: ForwardedRef<T>) => {
    return <Radio {...props} checkedIcon={<HBSelectedRadio />} icon={<HBUnSelectedRadio />} />
  },
)

HBRadioButton.displayName = 'HBRadioButton'
HBRadioButton.defaultProps = {}

export default HBRadioButton
