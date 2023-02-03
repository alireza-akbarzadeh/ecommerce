import { HBIcon } from '@hasty-bazar/core'
import { Avatar } from '@mui/material'
import { IconProps } from '../../types/IconProps'

export const Icon = (props: IconProps) => {
  const { labelIcon } = props
  if (labelIcon) {
    if (labelIcon?.includes('upload')) {
      return (
        <Avatar
          sx={{
            width: 30,
            height: 30,
          }}
          alt="country"
          src={process.env['NEXT_PUBLIC_CDN'] + labelIcon}
        />
      )
    }
    return <HBIcon type={labelIcon} />
  }
  return null
}
