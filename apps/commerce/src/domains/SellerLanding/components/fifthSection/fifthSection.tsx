import { Grid, Stack } from '@mui/material'
import { useIntl } from 'react-intl'
import sellerLandingMessages from '../../SellerLanding.messages'
import Title from '../title'
import InfoCard from './infoCard'

function FifthSection() {
  const { formatMessage } = useIntl()
  return (
    <Stack display="flex" flexDirection="column">
      <Stack display="flex" width="100%" alignItems="center" mt={12} justifyContent="center">
        <Title title={formatMessage(sellerLandingMessages.amount)} />
      </Stack>

      <Grid container mt={10} spacing={6}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Grid item xs={12} md={2.4} key={index}>
            <InfoCard
              icon="mobileAndroidAlt"
              title="کالای دیجیتال"
              description="از ۱٪ تا ۱۵٪ کمیسیون"
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export default FifthSection
