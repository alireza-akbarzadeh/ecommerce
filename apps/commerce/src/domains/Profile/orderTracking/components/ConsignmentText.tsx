import { Stack, SxProps } from '@mui/material'
import { FC } from 'react'
import { OrderTrackingConsignmentHeaderSubText } from '../OrderTracking.styles'

interface IConsignmentTextProps {
  firstPart: string
  secondPart: string
  sx?: SxProps
}

const ConsignmentText: FC<IConsignmentTextProps> = (props) => {
  const { firstPart, secondPart, sx } = props
  return (
    <Stack sx={sx} direction="row">
      <OrderTrackingConsignmentHeaderSubText variant="subtitle2" color="grey.700">
        {firstPart}
      </OrderTrackingConsignmentHeaderSubText>

      <OrderTrackingConsignmentHeaderSubText
        sx={{ userSelect: 'text !important' }}
        variant="subtitle2"
        color="text.primary"
      >
        {secondPart}
      </OrderTrackingConsignmentHeaderSubText>
    </Stack>
  )
}

export default ConsignmentText
