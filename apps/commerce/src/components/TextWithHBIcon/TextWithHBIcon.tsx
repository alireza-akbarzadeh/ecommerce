import { HBIcon, HBIconProps, HBIconType } from '@hasty-bazar/core'
import { Stack, StackProps, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import { FC, ReactNode } from 'react'

interface TextWithHBIconProps extends StackProps, Pick<HBIconProps, 'size'> {
  iconType: HBIconType
  text: ReactNode
  textColor?: string
  iconColor?: string
  bold?: boolean
  customVariant?: Variant
}

const TextWithHBIcon: FC<TextWithHBIconProps> = ({
  text,
  iconType,
  bold,
  spacing = 2,
  size = 'medium',
  customVariant = 'body2',
  iconColor = 'inherit',
  textColor = 'inherit',
  alignItems = 'center',
  direction = 'row',
  ...rest
}) => {
  return (
    <Stack {...{ direction, spacing, alignItems }} {...rest}>
      <HBIcon type={iconType} size={size} sx={{ color: iconColor }} />
      <Typography variant={customVariant} color={textColor} {...(bold && { fontWeight: 'bold' })}>
        {text}
      </Typography>
    </Stack>
  )
}

export default TextWithHBIcon
