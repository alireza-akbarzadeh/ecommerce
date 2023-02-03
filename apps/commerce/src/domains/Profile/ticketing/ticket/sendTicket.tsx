import { HBIcon } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { Box, Stack, Typography } from '@mui/material'
import { format } from 'date-fns-jalali'
import { useIntl } from 'react-intl'
import InfoItem from '../components/infoItem'
import ticketingMessages from '../ticketing.messages'
import { TicketType } from './ticketItem'

export interface TicketInfoProps {
  data: TicketType
}

const FORMAT_DATE = 'yyyy/MM/dd'

const FORMAT_TIME = 'HH:mm'
function SendTicket({ data }: TicketInfoProps) {
  const { formatMessage, formatDate } = useIntl()

  const seen = data.adminRead
  return (
    <Stack spacing={4}>
      <Stack
        sx={{
          bgcolor: 'grey.200',
          borderRadius: 5,
          p: ({ spacing }) => spacing(1, 2),
          m: '0 auto',
        }}
        flexDirection="row"
        alignItems="center"
        gap={2}
      >
        <HBIcon
          size="small"
          type="calendarAlt"
          sx={{
            color: 'grey.500',
          }}
        />
        <Typography variant="subtitle2" fontWeight={fontWeights.fontWeightMedium}>
          {formatDate(data.createDate ?? '', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
      </Stack>

      <Stack display="flex" width="100%" justifyContent="flex-start">
        <Stack
          bgcolor="info.lighter"
          sx={{
            borderRadius: 4,
            borderBottomLeftRadius: 1,
            height: 'auto',
            overflow: 'hidden',
            p: 4,
            width: {
              sx: '90%',
              md: '40%',
            },
          }}
        >
          <InfoItem title={formatMessage(ticketingMessages.type)} value={data.type!} />
          <InfoItem
            title={formatMessage(ticketingMessages.text)}
            value={
              <Box
                dangerouslySetInnerHTML={{
                  __html: data?.messageDescription?.replace(/(\r\n|\n|\r)/gm, '<br />') ?? '',
                }}
              />
            }
          />
          <InfoItem title={formatMessage(ticketingMessages.ticketId)} value={data.trackingCode!} />
          <InfoItem
            title={formatMessage(ticketingMessages.date)}
            value={format(new Date(data.createDate!), FORMAT_DATE)}
          />
        </Stack>

        <Stack py={1} display="flex" flexDirection="row" gap={1}>
          <Stack display={'flex'} flexDirection="row">
            <HBIcon
              type="check"
              size="small"
              sx={{ color: seen ? 'success.main' : 'grey.300', fontSize: 14 }}
            />
            <HBIcon
              type="check"
              size="small"
              sx={{ color: seen ? 'success.main' : 'grey.300', fontSize: 14, ml: -2 }}
            />
          </Stack>
          <Typography color="text.disabled" variant="caption">
            {format(new Date(data.createDate!), FORMAT_TIME)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default SendTicket
