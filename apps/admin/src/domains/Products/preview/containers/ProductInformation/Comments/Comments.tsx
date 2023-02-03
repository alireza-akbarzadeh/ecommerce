import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import ProductionDetailMessages from '../../../productDetail.messages'
import { RateCard } from '../components'

const Comments: FC = () => {
  return (
    <>
      <Stack
        rowGap={4}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Typography variant="subtitle1">
          <FormattedMessage
            {...ProductionDetailMessages.commentsSectionCount}
            values={{ count: 0 }}
          />
        </Typography>
      </Stack>

      <RateCard />
    </>
  )
}

export default Comments
