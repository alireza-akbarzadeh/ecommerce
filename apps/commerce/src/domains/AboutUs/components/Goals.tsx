import { HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import aboutUsMessage from '../aboutUs.messages'
import { WrapperStyle } from './AboutUsComponents.styles'

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 76,
  height: 76,
  borderRadius: '50%',
  background: theme.palette.primary.main,
  marginTop: theme.spacing(-11.5),
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2.5, 6.5, 7.5),
  minHeight: 205,
  marginTop: theme.spacing(11.5),
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    minHeight: 240,
    padding: theme.spacing(1, 3, 2.5),
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: 195,
  },
  [theme.breakpoints.only('xs')]: {
    minHeight: 150,
  },
}))

const TitleTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(4.5, 0),
}))

const Goals: FC = () => {
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { formatMessage } = useIntl()
  const theme = useTheme()

  return (
    <WrapperStyle container>
      <Stack direction="row" alignItems="center" mb={8}>
        <Typography variant="h4" color="info.dark">
          {formatMessage(aboutUsMessage.goals)}
        </Typography>
        <Typography variant="h4" color="primary.main">
          {formatMessage(aboutUsMessage.companyName)}
        </Typography>
      </Stack>

      <Grid container columnSpacing={theme.spacing(3.75)} rowSpacing={theme.spacing(3.75)}>
        <Grid item sm={4} md={4} lg={4}>
          <BoxWrapper>
            <Grid container justifyContent="center">
              <IconWrapper color="common.white">
                <HBIcon type="globe" sx={{ fontSize: '30px' }} />
              </IconWrapper>
            </Grid>

            <Grid container justifyContent="flex-start">
              <TitleTypography
                variant={breakpointDownMd ? 'subtitle1' : 'h6'}
                color="info.dark"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightBold,
                  lineHeight: '23px',
                })}
              >
                {formatMessage(aboutUsMessage.smartPlatform)}
              </TitleTypography>

              <Typography variant="subtitle2" color="text.primary" align="justify">
                {formatMessage(aboutUsMessage.smartPlatformDes)}
              </Typography>
            </Grid>
          </BoxWrapper>
        </Grid>

        <Grid item sm={4} md={4} lg={4}>
          <BoxWrapper>
            <Grid container justifyContent="center">
              <IconWrapper color="common.white">
                <HBIcon type="thumbsUp" sx={{ fontSize: '30px' }} />
              </IconWrapper>
            </Grid>

            <Grid container justifyContent="flex-start">
              <TitleTypography
                variant={breakpointDownMd ? 'subtitle1' : 'h6'}
                color="info.dark"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightBold,
                })}
              >
                {formatMessage(aboutUsMessage.improvingTheQualityOfLife)}
              </TitleTypography>

              <Typography variant="subtitle2" color="text.primary" align="justify">
                {formatMessage(aboutUsMessage.improvingTheQualityOfLifeDes)}
              </Typography>
            </Grid>
          </BoxWrapper>
        </Grid>

        <Grid item sm={4} md={4} lg={4}>
          <BoxWrapper>
            <Grid container justifyContent="center">
              <IconWrapper color="common.white">
                <HBIcon type="userCircle" sx={{ fontSize: '30px' }} />
              </IconWrapper>
            </Grid>

            <Grid container justifyContent="flex-start">
              <TitleTypography
                variant={breakpointDownMd ? 'subtitle1' : 'h6'}
                color="info.dark"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightBold,
                })}
              >
                {formatMessage(aboutUsMessage.firstChoise)}
              </TitleTypography>

              <Typography variant="subtitle2" color="text.primary" align="justify">
                {formatMessage(aboutUsMessage.firstChoiseDes)}
              </Typography>
            </Grid>
          </BoxWrapper>
        </Grid>
      </Grid>
    </WrapperStyle>
  )
}

export default Goals
