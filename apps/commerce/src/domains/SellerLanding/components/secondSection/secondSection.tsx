import { HBIconProps } from '@hasty-bazar/core'
import { Grid, Stack } from '@mui/material'
import { useIntl } from 'react-intl'
import sellerLandingMessages from '../../SellerLanding.messages'
import Title from '../title'
import InfoCard from './infoCard'

function SecondSection() {
  const { formatMessage } = useIntl()

  const infoCards: {
    icon: HBIconProps['type']
    title: string
    description: string
  }[] = [
    {
      icon: 'clockNine',
      title: formatMessage(sellerLandingMessages.whySellOnHastiSection1Title),
      description: formatMessage(sellerLandingMessages.whySellOnHastiSection1Description),
    },
    {
      icon: 'usersAlt',
      title: formatMessage(sellerLandingMessages.whySellOnHastiSection2Title),
      description: formatMessage(sellerLandingMessages.whySellOnHastiSection2Description),
    },
    {
      icon: 'moneyBill',
      title: formatMessage(sellerLandingMessages.whySellOnHastiSection3Title),
      description: formatMessage(sellerLandingMessages.whySellOnHastiSection3Description),
    },
    {
      icon: 'truck',
      title: formatMessage(sellerLandingMessages.whySellOnHastiSection4Title),
      description: formatMessage(sellerLandingMessages.whySellOnHastiSection4Description),
    },
    {
      icon: 'fileCheck',
      title: formatMessage(sellerLandingMessages.whySellOnHastiSection5Title),
      description: formatMessage(sellerLandingMessages.whySellOnHastiSection5Description),
    },
    {
      icon: 'megaphone',
      title: formatMessage(sellerLandingMessages.whySellOnHastiSection6Title),
      description: formatMessage(sellerLandingMessages.whySellOnHastiSection6Description),
    },
  ]

  return (
    <Stack
      display="flex"
      flexDirection="column"
      width="100%"
      sx={{
        width: 'calc(100% + -100px)',
        margin: '0 auto',
      }}
    >
      <Stack
        mt={12}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Title title={formatMessage(sellerLandingMessages.whySellOnHasti)} />
      </Stack>

      <Grid container mt={8} spacing={6}>
        {infoCards.map((infoCard, index) => (
          <Grid item xs={12} md={4} key={index}>
            <InfoCard
              title={infoCard.title}
              description={infoCard.description}
              icon={infoCard.icon}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export default SecondSection
