import { ForwardedRef, forwardRef } from 'react'
import { SketchPicker, SketchPickerProps } from 'react-color'

export type HBColorPickerProps = Omit<SketchPickerProps, 'ref'>

const HBColorPicker = forwardRef(
  <T extends SketchPicker>({ ...props }: HBColorPickerProps, ref: ForwardedRef<T>) => {
    return <SketchPicker ref={ref} {...props} />
  },
)

HBColorPicker.displayName = 'HBColorPicker'
HBColorPicker.defaultProps = {}

export default HBColorPicker
