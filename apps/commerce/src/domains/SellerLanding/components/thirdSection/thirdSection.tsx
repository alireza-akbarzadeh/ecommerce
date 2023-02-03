import { Stack } from '@mui/material'
import Image from 'next/image'
import { useIntl } from 'react-intl'
import sellerLandingMessages from '../../SellerLanding.messages'
import Title from '../title'

function ThirdSection() {
  const { formatMessage } = useIntl()
  return (
    <Stack
      flexDirection={'column'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Stack mt={15} mb={10} display="flex" justifyContent="center" alignItems="center">
        <Title title={formatMessage(sellerLandingMessages.process)} />
      </Stack>

      <Stack display="flex" flexDirection="row" gap={6} p={0.5}>
        <Image src="/assets/sellerLandingStep1.png" width={260} height={48} />
        <Image src="/assets/sellerLandingStep2.png" width={260} height={48} />
        <Image src="/assets/sellerLandingStep3.png" width={260} height={48} />
      </Stack>
    </Stack>
  )
}

export default ThirdSection
