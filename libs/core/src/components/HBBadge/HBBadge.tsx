import { BadgeProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBIcon, HBIconType } from '../HBIcon'
import { HBBadgeRootStyle } from './HBBadge.styles'

export interface HBBadgeProps extends Omit<BadgeProps, 'ref' | 'childern'> {
  children?: HBIconType | JSX.Element
}

const HBBadge = forwardRef(
  <T extends HTMLElement>({ children, ...props }: HBBadgeProps, ref: ForwardedRef<T>) => {
    return (
      <HBBadgeRootStyle {...props} ref={ref}>
        {typeof children === 'string' ? <HBIcon type={children} size="medium" /> : children}
      </HBBadgeRootStyle>
    )
  },
)

HBBadge.displayName = 'HBBadge'
HBBadge.defaultProps = {}

export default HBBadge
