import { HBButton } from '@hasty-bazar/core'
import { Container, Grid, Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import sellerLandingMessages from '../../SellerLanding.messages'
import InfoCard from './infoCard'

function Header() {
  const { formatMessage } = useIntl()

  const handleScrollSown = () => {
    const section = document.getElementById('seller-landing-register') as HTMLElement
    section.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  return (
    <Stack
      component="header"
      sx={{
        width: '100%',
        position: 'relative',
      }}
    >
      <Stack component={'img'} src={'/assets/sellerLandingBg.jpg'} alt="sellerLandingBg" />

      <Stack
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          zIndex: 1,
          borderRadius: 2,
          position: 'absolute',
          width: 390,
          top: {
            xs: 0,
            md: '20%',
          },
          left: {
            xs: '10%',
            md: '18%',
          },
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          {formatMessage(sellerLandingMessages.earnMoneyFromSellingInHasti)}
        </Typography>
        <Typography variant="subtitle1" color="grey.900">
          {formatMessage(sellerLandingMessages.sellYourProductsOnHasti)}
        </Typography>
        <HBButton
          sx={{
            width: 'fit-content',
            mt: 4,
            boxShadow: 'none',
          }}
          variant="contained"
          onClick={handleScrollSown}
        >
          {formatMessage(sellerLandingMessages.signUpAsSeller)}
        </HBButton>
      </Stack>
      <Container
        sx={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid
          sx={{
            position: {
              md: 'absolute',
              xs: 'relative',
            },
            bottom: -100,
            width: '100%',
          }}
          spacing={6}
          container
        >
          <Grid item xs={12} md={4}>
            <InfoCard
              icon="chartLine"
              title={formatMessage(sellerLandingMessages.growYourBusiness)}
              description={formatMessage(sellerLandingMessages.growYourBusinessDesc)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoCard
              icon="commentAlt"
              title={formatMessage(sellerLandingMessages.getCommentsOfCustomers)}
              description={formatMessage(sellerLandingMessages.getCommentsOfCustomersDesc)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoCard
              icon="thumbsUp"
              title={formatMessage(sellerLandingMessages.staySuccessful)}
              description={formatMessage(sellerLandingMessages.staySuccessfulDesc)}
            />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  )
}

export default Header
