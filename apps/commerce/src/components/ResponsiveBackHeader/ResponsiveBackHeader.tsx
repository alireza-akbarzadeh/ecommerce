import { HBIcon } from '@hasty-bazar/core'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import CommerceIconButton from '../CommerceIconButton'
import ComponentsMessages from '../Components.message'
import HBLink from '../HBLink'

const ResponsiveBackHeader: FC = () => {
  const { back } = useRouter()

  return (
    <Stack
      sx={{
        backgroundColor: 'common.white',
        height: 48,
        p: 4,
      }}
      direction="row"
      alignItems="center"
    >
      <Stack direction="row" spacing={2}>
        <Stack direction="row" spacing={0.5}>
          <Box>
            <HBLink href="/" sx={{ display: 'flex' }}>
              <Box
                component="img"
                sx={{ objectFit: 'contain' }}
                src="/assets/logo.png"
                height={32}
                width={32}
              />
            </HBLink>
          </Box>
          <Divider sx={{ borderColor: 'grey.300' }} orientation="vertical" flexItem />
        </Stack>
        <Stack alignItems="center" direction="row">
          <CommerceIconButton
            onClick={() => back()}
            icon={<HBIcon type="arrowRight" sx={{ color: 'common.black' }} />}
          />
          <Typography variant="button" color="text.primary">
            <FormattedMessage {...ComponentsMessages.back} />
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ResponsiveBackHeader
