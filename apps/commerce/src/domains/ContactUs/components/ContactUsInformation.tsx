import { HBMap } from '@hasty-bazar-commerce/containers/HBMap'
import { HBIcon } from '@hasty-bazar/core'
import { Box, Grid, Stack, styled, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import contactUsMessage from '../contactUs.messages'

const WrapperStyle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0, 0),
}))

const TitleStyle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}))

const ContactUsInformation: FC = () => {
  const { formatMessage } = useIntl()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down(767))

  return (
    <WrapperStyle>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={5} md={5} lg={5}>
          <Box
            sx={(theme) => ({
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: 2,
              py: 4,
              px: { md: 4, sm: 2.5, xs: 4 },
            })}
          >
            <Stack
              direction="row"
              mb={8}
              pb={3}
              borderBottom={(theme) => `1px solid ${theme.palette.grey[300]}`}
            >
              <Typography component="h1" variant="h4" color="primary.main">
                {formatMessage(contactUsMessage.relationship)}
              </Typography>
              <Typography variant="h4" color="info.dark">
                {formatMessage(contactUsMessage.us)}
              </Typography>
            </Stack>

            <Box mb={5}>
              <TitleStyle variant="subtitle1">
                <Box color="primary.main" mr={2}>
                  <HBIcon type="locationPoint" size="small" />
                </Box>
                {formatMessage(contactUsMessage.centralOffice)}:
              </TitleStyle>
              <Typography variant="subtitle2">
                {formatMessage(contactUsMessage.companyAddress)}
              </Typography>
            </Box>

            <Box mb={5}>
              <TitleStyle variant="subtitle1">
                <Box color="primary.main" mr={2}>
                  <HBIcon type="phone" size="small" />
                </Box>
                {formatMessage(contactUsMessage.phoneCallAndFax)}:
              </TitleStyle>
              <Typography
                variant="subtitle2"
                component={isMobile ? 'a' : 'div'}
                color="text.primary"
                href="tel:+98-21-45171000"
              >
                {formatMessage(contactUsMessage.phone)}
              </Typography>
            </Box>

            <Box mb={5}>
              <TitleStyle variant="subtitle1">
                <Box color="primary.main" mr={2}>
                  <HBIcon type="envelopeMinus" size="small" />
                </Box>
                {formatMessage(contactUsMessage.email)}:
              </TitleStyle>
              <Typography variant="subtitle2">
                {formatMessage(contactUsMessage.emailAddress)}
              </Typography>
            </Box>

            <Box mb={5}>
              <TitleStyle variant="subtitle1">
                <Box color="primary.main" mr={2}>
                  <HBIcon type="mailbox" size="small" />
                </Box>
                {formatMessage(contactUsMessage.postalCode)}:
              </TitleStyle>
              <Typography variant="subtitle2">
                {formatMessage(contactUsMessage.postalCodeValue)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={7} md={7} lg={7}>
          <HBMap
            sx={{ height: { sm: 400, xs: 300 }, borderRadius: ({ spacing }) => spacing(4) }}
            center={[35.72817461601115, 51.41554830329497]}
            isShowMarker
            dragging={false}
            hasZoomBox={false}
            scrollWheelZoom={false}
          />
        </Grid>
      </Grid>
    </WrapperStyle>
  )
}

export default ContactUsInformation
