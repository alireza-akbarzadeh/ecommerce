import OrderTrackingMessages from '@hasty-bazar-commerce/domains/Profile/orderTracking/orderTracking.messages'
import useTimer from '@hasty-bazar-commerce/hooks/useTimer'
import { HBButton } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage } from 'react-intl'

interface ITimeLeft {
  time: number
  payCallback: () => void
  loading: boolean
}

const TimeLeft: FC<ITimeLeft> = (props) => {
  const { time, payCallback, loading } = props
  const timeLeft = useTimer(Math.abs(time))
  return (
    <>
      {timeLeft ? (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" color="primary.main">
            <FormattedMessage
              {...OrderTrackingMessages.payAwaitOrder}
              values={{ time: timeLeft }}
            />
          </Typography>
          <HBButton loading={loading} onClick={() => payCallback()}>
            <FormattedMessage {...OrderTrackingMessages.pay} />
          </HBButton>
        </Stack>
      ) : null}
    </>
  )
}

export default TimeLeft
