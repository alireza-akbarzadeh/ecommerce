import { Slider, SliderProps } from '@mui/material'
import { forwardRef } from 'react'

export type HBSliderProps = SliderProps

const HBSlider = forwardRef<any, HBSliderProps>((props, ref) => {
  return <Slider ref={ref} {...props} />
})

HBSlider.displayName = 'HBSlider'
HBSlider.defaultProps = {}

export default HBSlider
