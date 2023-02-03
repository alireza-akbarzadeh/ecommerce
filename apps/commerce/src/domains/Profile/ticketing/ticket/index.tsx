import { CommerceLoading } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useGetWebCrmTicketsByIdQuery } from '@hasty-bazar-commerce/services/crmApi.generated'
import { Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { Status, TicketHeader } from '../components'
import { TicketStatusEnum } from '../components/status'
import ticketingMessages from '../ticketing.messages'
import TicketItem from './ticketItem'

function Ticket() {
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id as string
  const ticket = useGetWebCrmTicketsByIdQuery(
    {
      ...ApiConstants,
      id,
    },
    {
      skip: !id,
    },
  )

  return (
    <Stack>
      {ticket.isLoading && <CommerceLoading />}
      <TicketHeader
        title={ticket?.data?.type!}
        buttonText={breakpointDownMd ? '' : formatMessage(ticketingMessages.back)}
        icon="arrowRight"
        onButtonClick={() => {
          router.push('/profile/ticketing')
        }}
      />

      <Stack
        sx={{
          bgcolor: 'common.white',
          borderRadius: '8px',
          mt: 4,
          p: 5,

          border: ({ palette }) => `1px solid ${palette.grey[200]}`,
        }}
      >
        <Stack
          width="100%"
          display="flex"
          sx={{
            borderBottom: ({ palette }) => `1px solid ${palette.grey[200]}`,
            pb: 4,
          }}
          flexDirection="row"
          justifyContent="space-between"
        >
          <Stack display="flex" flexDirection="row" gap={8}>
            <Stack display="flex" flexDirection="row">
              <Typography variant="subtitle1" color="text.primary">
                {formatMessage(ticketingMessages.shop)}
              </Typography>
              <Typography variant="subtitle1" color="info.main">
                {formatMessage(ticketingMessages.hasti)}
              </Typography>
            </Stack>
            <Stack display="flex" flexDirection="row">
              <Typography variant="subtitle1" color="text.secondary">
                {formatMessage(ticketingMessages.ticketNumber)}
              </Typography>
              <Typography variant="subtitle1" color="info.main">
                {ticket.data?.shippingCode}
              </Typography>
            </Stack>
          </Stack>

          <Stack>
            <Status status={ticket.data?.status as unknown as TicketStatusEnum} />
          </Stack>
        </Stack>
        {ticket.data && (
          <Stack pt={4}>
            <TicketItem data={ticket.data} />
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default Ticket
