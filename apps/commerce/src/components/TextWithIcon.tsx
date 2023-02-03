import { Stack, SxProps, Typography } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import Image from 'next/image'
import { FC, ReactNode, useState } from 'react'

const TextWithIcon: FC<{
  icon?: string | ReactNode
  text?: string
  sx?: SxProps
  varient?: Variant
  size?: number
  spacing?: number
}> = ({ icon, text, sx, varient = 'body2', size = 16, spacing = 1 }) => {
  const [settedIcon, setSettedIcon] = useState<string>(typeof icon === 'string' ? icon : '')
  return (
    <Stack direction="row" alignItems="center" spacing={spacing} sx={sx}>
      {icon && typeof icon === 'string' && (
        <Image
          width={size}
          height={size}
          src={settedIcon}
          onError={() => {
            setSettedIcon('/assets/svg/attribute-default.svg')
          }}
        />
      )}
      {icon && typeof icon !== 'string' && icon}
      {text && <Typography variant={varient}>{text}</Typography>}
    </Stack>
  )
}

export default TextWithIcon
