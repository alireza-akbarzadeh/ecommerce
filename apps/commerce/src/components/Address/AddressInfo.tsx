import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { Box, Stack, styled, Typography } from '@mui/material'
import { FC } from 'react'

export const AddressInfoClasses = {
  iconWrapper: 'icon-wrapper',
  text: 'text',
}

const WrapperStyle = styled(Stack)(({ theme }) => ({
  [`& .${AddressInfoClasses.iconWrapper}`]: {
    color: theme.palette.grey[700],
  },
  [`& .${AddressInfoClasses.text}`]: {
    color: theme.palette.text.secondary,
  },
}))

const AddressInfo: FC<{ icon: HBIconType; text: string; spacing?: number }> = ({
  icon,
  text,
  spacing = 3,
}) => {
  return (
    <WrapperStyle direction="row" alignItems="flex-start" spacing={spacing}>
      <Box className={AddressInfoClasses.iconWrapper}>
        <HBIcon type={icon} size="small" sx={{ display: 'flex' }} />
      </Box>
      <Typography
        sx={{ userSelect: 'text' }}
        className={AddressInfoClasses.text}
        variant="subtitle2"
      >
        {text}
      </Typography>
    </WrapperStyle>
  )
}

export default AddressInfo
