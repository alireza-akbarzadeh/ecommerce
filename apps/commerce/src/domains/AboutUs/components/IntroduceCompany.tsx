import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import aboutUsMessage from '../aboutUs.messages'
import { IconWrapper, InfoWrapper, WrapperStyle } from './AboutUsComponents.styles'

const IntroduceCompany: FC = () => {
  const breakpointDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { formatMessage } = useIntl()
  const router = useRouter()

  return (
    <WrapperStyle container flexDirection={{ sm: 'row', xs: 'column-reverse' }}>
      <Grid item xs={12} sm={5} md={6} lg={6}>
        <Stack
          direction={breakpointDownMd ? 'column' : 'row'}
          alignItems={breakpointDownMd ? 'flex-start' : 'center'}
          mb={{ xs: 2, sm: 8 }}
          mt={10}
        >
          <Typography variant="h4" color="info.dark">
            {formatMessage(aboutUsMessage.companyName)}
          </Typography>
          <Typography component="h1" variant={breakpointDownSm ? 'h5' : 'h4'} color="primary.main">
            ({formatMessage(aboutUsMessage.fullCompanyName)})
          </Typography>
        </Stack>
        <Typography variant="subtitle2" color="text.primary" align="justify" pr={{ sm: 5, xs: 0 }}>
          {formatMessage(aboutUsMessage.aboutCompany)}
        </Typography>

        <Box display="flex" justifyContent="flex-start" mt={5}>
          <HBButton
            variant="contained"
            type="submit"
            color="primary"
            onClick={() => router.push('/careers')}
            sx={{ boxShadow: 'none' }}
          >
            {formatMessage(aboutUsMessage.joinUs)}
          </HBButton>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={7}
        md={6}
        lg={6}
        container
        justifyContent={{ md: 'flex-end', xs: 'center' }}
      >
        <Box
          width={{ md: 420, sm: 320, xs: 260 }}
          height={{ md: 380, sm: 300, xs: 247 }}
          position="relative"
        >
          <Image src={'/assets/aboutUsCompany.png'} layout="fill" alt="aboutCompany" />
          <InfoWrapper
            direction="row"
            alignItems="center"
            spacing={3}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.error.main}`,
              right: { md: theme.spacing(63.5), sm: '55%', xs: '54%' },
              top: { md: theme.spacing(45.5), sm: theme.spacing(25.5), xs: theme.spacing(25.5) },
            })}
          >
            <IconWrapper
              color="common.white"
              sx={(theme) => ({ backgroundColor: 'error.main', borderRadius: theme.spacing(2) })}
              minWidth={breakpointDownMd ? 30 : 40}
              minHeight={breakpointDownMd ? 30 : 40}
            >
              <HBIcon
                type="userCircle"
                size={breakpointDownMd ? 'small' : 'medium'}
                sx={{ display: 'flex' }}
              />
            </IconWrapper>
            <Stack direction="column" spacing={2}>
              <Typography
                color="text.primary"
                whiteSpace="nowrap"
                variant={breakpointDownSm ? 'caption' : 'subtitle2'}
              >
                {formatMessage(aboutUsMessage.expertForce)}
              </Typography>
              <Typography
                color="error.main"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightBold,
                })}
                variant={breakpointDownSm ? 'caption' : 'h6'}
                align="center"
              >
                {/* TODO_ROXANA: api service is not ready yet */}
                124
              </Typography>
            </Stack>
          </InfoWrapper>

          <InfoWrapper
            direction="row"
            alignItems="center"
            spacing={3}
            sx={(theme) => ({
              border: `1px solid ${theme.palette.info.main}`,
              right: { sm: theme.spacing(0.5), xs: theme.spacing(-2.5) },
              top: { md: theme.spacing(77.5), sm: theme.spacing(65.5), xs: theme.spacing(45.5) },
            })}
          >
            <IconWrapper
              color={'common.white'}
              sx={(theme) => ({ backgroundColor: 'info.main', borderRadius: theme.spacing(2) })}
              minWidth={breakpointDownMd ? 30 : 40}
              minHeight={breakpointDownMd ? 30 : 40}
            >
              <HBIcon
                type="fileBookmarkAlt"
                size={breakpointDownMd ? 'small' : 'medium'}
                sx={{ display: 'flex' }}
              />
            </IconWrapper>
            <Stack direction="column" spacing={2}>
              <Typography
                color="text.primary"
                whiteSpace="nowrap"
                variant={breakpointDownSm ? 'caption' : 'subtitle2'}
              >
                {formatMessage(aboutUsMessage.doingProject)}
              </Typography>
              <Typography
                color="info.main"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightBold,
                })}
                variant={breakpointDownSm ? 'caption' : 'h6'}
                align="center"
              >
                {/* TODO_ROXANA: api service is not ready yet */}4
              </Typography>
            </Stack>
          </InfoWrapper>
        </Box>
      </Grid>
    </WrapperStyle>
  )
}

export default IntroduceCompany
