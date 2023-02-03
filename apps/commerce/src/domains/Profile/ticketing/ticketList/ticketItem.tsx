import { GetTicketsByPartyIdQueryResult } from '@hasty-bazar-commerce/services/crmApi.generated'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box, Stack, Typography, typographyClasses } from '@mui/material'
import { format } from 'date-fns-jalali'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { InfoItem, Status } from '../components'
import { TicketStatusEnum } from '../components/status'
import ticketingMessages from '../ticketing.messages'

export interface TicketTypeItemProps {
  data: GetTicketsByPartyIdQueryResult
}

const JALALI_DATE_FORMAT = 'yyyy/MM/dd'
function TicketItem({ data }: TicketTypeItemProps) {
  const { formatMessage } = useIntl()

  const router = useRouter()
  return (
    <Stack
      display="flex"
      sx={{
        borderRadius: '8px',
        border: ({ palette }) => `1px solid ${palette.grey[300]}`,
      }}
      width="100%"
      p={4}
    >
      <Stack
        display="flex"
        flexDirection={{ sm: 'column', md: 'row' }}
        justifyContent="space-between"
        width="100%"
      >
        <Stack display="flex" gap={1.5} flexDirection="row">
          <HBIcon type="questionCircle" size="small" sx={{ color: 'gray.900' }} />
          <Typography variant="subtitle1">{data.title}</Typography>
        </Stack>
        <Stack mt={{ xs: 3, sm: 3, md: 0 }} mb={{ xs: 1, sm: 1, md: 0 }}>
          <Status status={data?.status as unknown as TicketStatusEnum} />
        </Stack>
      </Stack>
      <Stack display="flex" pt={2} flexDirection="column" overflow="hidden">
        <InfoItem title={formatMessage(ticketingMessages.type)} value={data.type!} />
        <Box
          sx={{
            [`& .${typographyClasses.root}:last-child`]: {
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        >
          <InfoItem
            title={formatMessage(ticketingMessages.text)}
            value={data?.messageDescription?.substring(0, 30) + '...'}
          />
        </Box>
        <InfoItem title={formatMessage(ticketingMessages.ticketId)} value={data.trackingCode!} />
        <InfoItem
          title={formatMessage(ticketingMessages.date)}
          value={format(new Date(data.createDate!), JALALI_DATE_FORMAT)}
        />
        <Stack px={4} width="50%">
          <HBButton
            onClick={() => {
              router.push({
                pathname: '/profile/ticketing-ticket',
                query: {
                  id: data.id,
                },
              })
            }}
            variant="text"
            sx={{
              display: 'flex',
              gap: 3,
            }}
          >
            <Typography fontSize={14} fontWeight={500} color="info.main">
              {formatMessage(ticketingMessages.moreDetails)}
            </Typography>
            <HBIcon
              type="arrowLeft"
              size="small"
              sx={{
                color: 'info.main',
                fontSize: 14,
              }}
            />
          </HBButton>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TicketItem
