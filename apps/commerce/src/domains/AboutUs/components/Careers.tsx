import { HBButton } from '@hasty-bazar/core'
import { Box, Grid, Stack, styled, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import aboutUsMessage from '../aboutUs.messages'

const WrapperStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4, 0, 0),
}))

const TitleCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 50.72,
  height: 54,
  left: theme.spacing(-4.5),
  top: theme.spacing(-3.25),
  background: theme.palette.primary.light,
  transform: 'matrix(-1, 0, 0, 1, 0, 0)',
  borderRadius: '50%',
  zIndex: 0,
}))

const Careers: FC = () => {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const router = useRouter()

  return (
    <WrapperStyle container flexDirection={{ md: 'row', xs: 'column-reverse' }}>
      <Grid item sm={12} md={6} lg={6}>
        <Stack direction="row" alignItems="center" position="relative" mb={8} ml={4.5}>
          <TitleCircle />
          <Typography variant="h4" color="info.dark" sx={{ zIndex: 1 }}>
            {formatMessage(aboutUsMessage.opportunities)}
          </Typography>
          <Typography variant="h4" color="primary.main">
            {formatMessage(aboutUsMessage.job)}
          </Typography>
        </Stack>
        <Typography variant="subtitle2" color="text.primary" align="justify" mr={4}>
          {formatMessage(aboutUsMessage.aboutOpportunities)}
        </Typography>

        <Box display="flex" justifyContent="flex-start" mt={5}>
          <HBButton
            variant="contained"
            type="submit"
            color="primary"
            onClick={() => router.push('/careers')}
          >
            {formatMessage(aboutUsMessage.joinUs)}
          </HBButton>
        </Box>
      </Grid>

      <Grid item sm={12} md={6} lg={6} container justifyContent={{ md: 'flex-end', xs: 'center' }}>
        <Box
          width={{ md: 408, sm: 455, xs: 310 }}
          height={{ md: 273, sm: 305, xs: 195 }}
          position="relative"
          mr={theme.spacing(3)}
        >
          <Image src={'/assets/career.png'} layout="fill" alt="careers" />
        </Box>
      </Grid>
    </WrapperStyle>
  )
}

export default Careers
