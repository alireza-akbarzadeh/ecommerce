import { GetTicketQueryResult } from '@hasty-bazar-commerce/services/crmApi.generated'
import ImageTicket from './imageTicket'
import ResponseMessage from './ResponseMessage'
import SendTicket from './sendTicket'

export type TicketType = GetTicketQueryResult
interface TicketTypeItemProps {
  data: TicketType
}

function TicketItem({ data }: TicketTypeItemProps) {
  return (
    <>
      <SendTicket data={data} />
      <ImageTicket data={data} />
      <ResponseMessage data={data} />
    </>
  )
}

export default TicketItem
