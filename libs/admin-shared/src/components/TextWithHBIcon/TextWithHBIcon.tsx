import { HBIcon, HBIconProps } from '@hasty-bazar/core'
import { Stack, Typography, TypographyTypeMap } from '@mui/material'
import { FC, ReactNode } from 'react'

interface TextProps {
  variant?: TypographyTypeMap['props']['variant']
  component?: React.ElementType
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

type TextWithHBIconProps = {
  text: ReactNode
  textColor?: string
  iconColor?: string
  bold?: boolean
  customVariant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline'
    | 'inherit'
  iconProps: HBIconProps
  textProps?: TextProps
}

const TextWithHBIcon: FC<TextWithHBIconProps> = ({
  text,
  customVariant,
  iconColor,
  textColor,
  bold,
  iconProps,
  textProps,
}) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <HBIcon sx={{ color: iconColor ?? 'inherit' }} {...iconProps} />
      <Typography
        variant={customVariant ?? 'body2'}
        color={textColor ?? 'inherit'}
        {...(bold && { fontWeight: 'bold' })}
        {...textProps}
      >
        {text}
      </Typography>
    </Stack>
  )
}

export default TextWithHBIcon
