import { Box, Stack, SxProps, Typography } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'

const SippingVisuality: FC<{ text: string; image: string; sx?: SxProps }> = ({
  image,
  text,
  sx,
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ ...sx }}>
      <Box width={24} height={24} sx={{ position: 'relative' }}>
        <Image layout="fill" src={image} />
      </Box>
      <Typography variant="subtitle2">{text}</Typography>
    </Stack>
  )
}

export default SippingVisuality
