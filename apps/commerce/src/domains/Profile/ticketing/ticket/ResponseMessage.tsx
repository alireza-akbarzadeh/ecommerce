import { Box, Stack, Typography } from '@mui/material'
import { format } from 'date-fns-jalali'
import { TicketType } from './ticketItem'

export interface TicketTypeItemProps {
  data: TicketType
}

const JALALI_DATE_FORMAT = 'yyyy/MM/dd HH:mm'
function ResponseMessage({ data }: TicketTypeItemProps) {
  if (!data.response) {
    return null
  }
  return (
    <Stack display="flex" width="100%" justifyContent="flex-end" flexDirection={'row'}>
      <Stack
        width={{
          sx: '90%',
          md: '40%',
        }}
      >
        <Stack
          bgcolor="grey.100"
          sx={{
            borderRadius: 4,
            borderBottomRightRadius: 1,
            overflow: 'hidden',
            p: 4,
          }}
        >
          <Typography variant="subtitle2" color="text.primary">
            <Box
              dangerouslySetInnerHTML={{
                __html: data.response.replace(/(\r\n|\n|\r)/gm, '<br />'),
              }}
            />
          </Typography>
        </Stack>
        <Stack py={1} display="flex" flexDirection="row" gap={1}>
          <Typography color="text.disabled" variant="caption">
            {data.responseDateTime && format(new Date(data.responseDateTime!), JALALI_DATE_FORMAT)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default ResponseMessage
