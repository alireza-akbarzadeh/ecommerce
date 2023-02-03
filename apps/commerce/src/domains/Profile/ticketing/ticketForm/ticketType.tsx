import { Stack, Theme, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { TicketHeader } from '../components'
import ticketingMessages from '../ticketing.messages'
import TicketTypeItem from './ticketTypeItem'

interface TicketTypeItemProps {
  onClick: (type: CaseTypeCaption) => void
}

export enum CaseTypeCaption {
  Question = 1,
  Complaint = 2,
  Suggestion = 3,
  All = 4,
}
function TicketType({ onClick }: TicketTypeItemProps) {
  const breakpointDownMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { formatMessage } = useIntl()

  const router = useRouter()
  return (
    <Stack>
      <TicketHeader
        onButtonClick={() => {
          router.push('/profile/ticketing')
        }}
        title={formatMessage(ticketingMessages.createRequest)}
        buttonText={breakpointDownMd ? '' : formatMessage(ticketingMessages.back)}
        icon="arrowRight"
      />
      <Stack display="grid" py={6} gap={2}>
        <TicketTypeItem
          onClick={() => {
            onClick(CaseTypeCaption.Question)
          }}
          title={formatMessage(ticketingMessages.question)}
          icon="questionCircle"
        />
        <TicketTypeItem
          onClick={() => {
            onClick(CaseTypeCaption.Complaint)
          }}
          title={formatMessage(ticketingMessages.complaint)}
          icon="ban"
        />
        <TicketTypeItem
          onClick={() => {
            onClick(CaseTypeCaption.Suggestion)
          }}
          title={formatMessage(ticketingMessages.suggestion)}
          icon="commentAltLines"
        />
      </Stack>
    </Stack>
  )
}

export default TicketType
