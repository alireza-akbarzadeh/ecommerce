import { Box, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import aboutUsMessage from '../aboutUs.messages'
import { BlueBox, CircleIcon, WrapperStyle, YellowBox } from './AboutUsComponents.styles'

const IntroduceUs: FC = () => {
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { formatMessage } = useIntl()

  return (
    <WrapperStyle container spacing={4}>
      <Grid item xs={12} sm={5} md={6} lg={6}>
        <Stack direction="row" alignItems="center" mb={{ xs: 2, sm: 8 }}>
          <Typography variant="h4" color="info.dark">
            {formatMessage(aboutUsMessage.whoWeAre)}
          </Typography>
          <Typography variant="h4" color="primary.main">
            {formatMessage(aboutUsMessage.weAre)}
          </Typography>
        </Stack>
        <Typography variant="subtitle2" color="text.primary" align="justify" pr={{ sm: 8, xs: 0 }}>
          {formatMessage(aboutUsMessage.aboutWhoWeAre)}
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sm={7}
        md={6}
        lg={6}
        container
        justifyContent={breakpointDownMd ? 'center' : 'flex-end'}
      >
        <Box
          width={breakpointDownMd ? '100%' : 420}
          height={{ sm: 310, xs: 220 }}
          position="relative"
          mt={{ xs: 7 }}
        >
          <CircleIcon
            sx={(theme) => ({
              top: { sm: theme.spacing(-3), xs: theme.spacing(-9.5) },
              left: { sm: theme.spacing(-11.25), xs: theme.spacing(-1) },
            })}
          />
          <BlueBox />
          <Image
            src={'/assets/aboutWhoWeAre.png'}
            layout="fill"
            alt="aboutUs"
            css={{ borderRadius: 8, zIndex: 1 }}
          />
          <YellowBox />
        </Box>
      </Grid>
    </WrapperStyle>
  )
}

export default IntroduceUs
