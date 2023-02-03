import { SxProps, Theme } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBCircularProgressBtn } from '../HBCircularProgressBtn'
import {
  HBStringValidationIconStyle,
  HBStringValidationRootStyle,
  HBStringValidationTextStyle,
} from './HBStringValidation.styles'

export type HBStringValidationProps = {
  text: string
  isActive: boolean
  sx?: SxProps<Theme>
  loading?: boolean
}

const HBStringValidation = forwardRef(
  <T extends HTMLDivElement>(props: HBStringValidationProps, ref: ForwardedRef<T>) => {
    const { text, isActive = false, loading = false } = props
    return (
      <HBStringValidationRootStyle ref={ref} {...props}>
        <HBStringValidationIconStyle isValid={isActive}>
          {loading ? (
            <HBCircularProgressBtn size={10} sx={{ color: 'white' }} />
          ) : (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="white">
              <path d="M11.5917 1.00822C11.5142 0.93011 11.4221 0.868115 11.3205 0.825808C11.219 0.7835 11.11 0.761719 11 0.761719C10.89 0.761719 10.7811 0.7835 10.6796 0.825808C10.578 0.868115 10.4858 0.93011 10.4084 1.00822L4.20004 7.22488L1.59171 4.60822C1.51127 4.53052 1.41632 4.46942 1.31227 4.42842C1.20823 4.38742 1.09713 4.36731 0.985308 4.36924C0.873491 4.37118 0.76315 4.39512 0.660584 4.43969C0.558019 4.48427 0.465238 4.54862 0.387539 4.62905C0.309841 4.70949 0.248746 4.80444 0.207742 4.90848C0.166739 5.01253 0.14663 5.12363 0.148565 5.23545C0.150499 5.34727 0.174439 5.45761 0.219017 5.56017C0.263595 5.66274 0.327938 5.75552 0.408373 5.83322L3.60837 9.03322C3.68584 9.11132 3.77801 9.17332 3.87956 9.21563C3.98111 9.25793 4.09003 9.27971 4.20004 9.27971C4.31005 9.27971 4.41897 9.25793 4.52052 9.21563C4.62207 9.17332 4.71424 9.11132 4.79171 9.03322L11.5917 2.23322C11.6763 2.15518 11.7438 2.06047 11.79 1.95506C11.8361 1.84964 11.86 1.7358 11.86 1.62072C11.86 1.50563 11.8361 1.39179 11.79 1.28638C11.7438 1.18096 11.6763 1.08625 11.5917 1.00822Z" />
            </svg>
          )}
        </HBStringValidationIconStyle>
        <HBStringValidationTextStyle isValid={isActive} variant="h6">
          {text}
        </HBStringValidationTextStyle>
      </HBStringValidationRootStyle>
    )
  },
)

HBStringValidation.displayName = 'HBStringValidation'
HBStringValidation.defaultProps = {}

export default HBStringValidation
