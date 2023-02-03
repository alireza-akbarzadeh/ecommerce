import { ButtonBaseProps, ButtonProps, TooltipProps } from '@mui/material'
import { ForwardedRef, forwardRef } from 'react'
import { HBIconType } from '../HBIcon'
import HBIcon from '../HBIcon/HBIcon'
import { HBToolTip } from '../HBToolTip'
import { HBIconButtonRootStyle } from './HBIconButton.styles'

export interface HBIconButtonProps
  extends ButtonBaseProps,
    Pick<TooltipProps, 'placement'>,
    Pick<ButtonProps, 'variant'> {
  icon?: HBIconType | JSX.Element
  iconSize?: 'small' | 'medium' | 'large'
  iconStyle?: React.CSSProperties
  tooltip?: string
}

const HBIconButton = forwardRef(
  <T extends HTMLButtonElement>(
    {
      icon,
      tooltip,
      placement,
      iconSize = 'small',
      iconStyle,
      variant = 'outlined',
      ...props
    }: HBIconButtonProps,
    ref: ForwardedRef<T>,
  ) => {
    const IconComponent =
      typeof icon === 'string' ? <HBIcon type={icon} size={iconSize} style={iconStyle} /> : icon

    if (tooltip)
      return (
        <HBToolTip title={tooltip} placement={placement} arrow>
          <span>
            <HBIconButtonRootStyle variant={variant} ref={ref} {...props}>
              {IconComponent}
            </HBIconButtonRootStyle>
          </span>
        </HBToolTip>
      )
    return (
      <HBIconButtonRootStyle ref={ref} {...props} variant={variant}>
        {IconComponent}
      </HBIconButtonRootStyle>
    )
  },
)

HBIconButton.displayName = 'HBIconButton'
HBIconButton.defaultProps = {}

export default HBIconButton
