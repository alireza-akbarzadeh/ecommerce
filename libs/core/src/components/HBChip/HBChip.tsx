import { Typography } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import { Variant } from '@mui/material/styles/createTypography'
import { ForwardedRef, forwardRef, ReactNode } from 'react'
import { HBBChipTextStyle, HBChipRootStyle } from './HBChip.styles'

export type color = 'primary' | 'secondary'
export interface HBChipProps {
  text: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  color?: color
  style?: React.CSSProperties
  sx?: SxProps<Theme>
  className?: string
  variant?: Variant
}

const HBChip = forwardRef(
  <T extends HTMLSpanElement>(
    { rightIcon, leftIcon, text, variant = 'subtitle1', ...props }: HBChipProps,
    ref: ForwardedRef<T>,
  ) => {
    return (
      <HBChipRootStyle ref={ref} {...props}>
        {leftIcon}
        <HBBChipTextStyle>
          <Typography variant={variant} component="span">
            {text}
          </Typography>
        </HBBChipTextStyle>
        {rightIcon}
      </HBChipRootStyle>
    )
  },
)

HBChip.displayName = 'HBChip'
HBChip.defaultProps = {}

export default HBChip
