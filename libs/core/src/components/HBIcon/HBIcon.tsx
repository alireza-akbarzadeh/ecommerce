import { SxProps, Theme } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { Icons, IconTypes } from './HBIcon.data'
import { HBIconRootStyle } from './HBIcon.styles'

export type HBIconType = typeof IconTypes[number]

export interface HBIconProps {
  size?: 'small' | 'medium' | 'large'
  type: HBIconType
  style?: React.CSSProperties
  sx?: SxProps<Theme>
}

const HBIcon = forwardRef(
  <T extends HTMLElement>(
    { type, size = 'medium', ...props }: HBIconProps,
    ref: ForwardedRef<T>,
  ) => {
    return <HBIconRootStyle size={size} className={Icons[type]} ref={ref} {...props} />
  },
)

HBIcon.displayName = 'HBIcon'
HBIcon.defaultProps = {}

export default HBIcon
