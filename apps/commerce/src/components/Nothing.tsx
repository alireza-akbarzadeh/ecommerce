import { Box, Stack, SxProps, Typography } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import ComponentsMessages from './Components.message'

interface INothingProps {
  sx?: SxProps
}

const Nothing: FC<INothingProps> = (props) => {
  const { sx } = props
  return (
    <Stack spacing={3} alignItems="center" sx={{ ...sx }}>
      <Box sx={{ width: 126.5, height: 105.7, position: 'relative' }}>
        <Image src="/assets/svg/noThing.svg" layout="fill" />
      </Box>
      <Typography variant="subtitle2" color="text.secondary">
        <FormattedMessage {...ComponentsMessages.noResult} />
      </Typography>
    </Stack>
  )
}

export default Nothing
