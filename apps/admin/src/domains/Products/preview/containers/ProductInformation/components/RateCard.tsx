import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../../../productDetail.messages'

const EmptyCard = () => {
  return (
    <Stack alignItems="center" spacing={6}>
      <Typography variant="caption" color="text.secondary">
        <FormattedMessage {...ProductionDetailMessages.emptyRateMessage} />
      </Typography>
      <Box>
        <Image src="/assets/svg/commentsEmpty.svg" width={125} height={105} />
      </Box>
    </Stack>
  )
}
const RateCard: FC = () => {
  return (
    <Stack alignItems={'center'} spacing={6}>
      <EmptyCard />
    </Stack>
  )
}

export default RateCard
