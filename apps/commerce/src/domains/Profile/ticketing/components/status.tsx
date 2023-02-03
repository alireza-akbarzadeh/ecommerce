import { Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import ticketingMessages from '../ticketing.messages'

export const enum TicketStatusEnum {
  PENDING = 0,
  FINISHED = 1,
}

export interface TicketStatusProps {
  status: TicketStatusEnum
}

function Status({ status }: TicketStatusProps) {
  const { formatMessage } = useIntl()
  const getStatusDetails: (status: TicketStatusEnum) => {
    color: string
    text: string
    bgColor: string
  } = (status) => {
    switch (status) {
      case TicketStatusEnum.PENDING:
        return {
          color: 'primary.main',
          text: formatMessage(ticketingMessages.pending),
          bgColor: 'primary.lighter',
        }
      case TicketStatusEnum.FINISHED:
        return {
          color: 'text.primary',
          text: formatMessage(ticketingMessages.finished),
          bgColor: 'grey.100',
        }
      default:
        return {
          color: 'primary.main',
          text: formatMessage(ticketingMessages.pending),
          bgColor: 'primary.lighter',
        }
    }
  }

  const { bgColor, color, text } = getStatusDetails(status)
  return (
    <Stack
      sx={{
        width: 94,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        minHeight: 22,
        bgcolor: bgColor,
      }}
    >
      <Typography color={color} variant="caption">
        {text}
      </Typography>
    </Stack>
  )
}

export default Status
