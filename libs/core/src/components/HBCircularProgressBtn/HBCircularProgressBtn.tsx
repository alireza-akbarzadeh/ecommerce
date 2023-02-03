import { CircularProgressProps } from '@mui/material/CircularProgress'
import { ForwardedRef, forwardRef } from 'react'
import { HBCircularProgressBtnRootStyle } from './HBCircularProgressBtn.styles'

export type HBCircularProgressBtnProps = Omit<CircularProgressProps, 'ref'>

const HBCircularProgressBtn = forwardRef(
  <T extends HTMLElement>({ ...props }: HBCircularProgressBtnProps, ref: ForwardedRef<T>) => {
    return <HBCircularProgressBtnRootStyle ref={ref} {...props} />
  },
)

HBCircularProgressBtn.displayName = 'HBCircularProgressBtn'

export default HBCircularProgressBtn
