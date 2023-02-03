import { Theme, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { intervalToDuration } from 'date-fns'
import { FC, useEffect, useState } from 'react'
import { HBIcon } from '../HBIcon'
import { HBCountDownTimerRootStyle, RefreshCodeStyle } from './HBCountDownTimer.styles'

export type HBCountDownTimerProps = {
  targetDate: number | Date
  linkText: string
  onClick?: () => void
  disabledButton?: boolean
  extraTimerText?: string
  sx?: SxProps<Theme>
  maximumShowed?: 'second' | 'minute' | 'hours' | 'days'
  timerDown?: () => void
  onFinished?: () => void
}

const maximumShowedArray = ['second', 'minute', 'hours', 'days']

const HBCountDownTimer: FC<HBCountDownTimerProps> = (props) => {
  const {
    extraTimerText,
    targetDate: targetDateProds,
    linkText,
    onClick,
    sx,
    maximumShowed = 'days',
    timerDown,
    onFinished,
  } = props
  const [targetDate, setTargetDate] = useState(targetDateProds)
  const remaining = () => {
    const now = new Date()
    const end = new Date(targetDate)
    if (now < end)
      return intervalToDuration({
        start: now,
        end,
      })
    else return { hours: 0, minutes: 0, seconds: 0, days: 0 }
  }

  const maximumShowedIndex = maximumShowedArray.findIndex((i) => i === maximumShowed)
  const [timer, setTimer] = useState<Duration>(remaining())
  const { hours = 0, minutes = 0, seconds = 0, days = 0 } = timer

  if (days + hours + minutes + seconds <= 0 && onFinished) onFinished()

  const handleClick = () => {
    setTargetDate(new Date().getTime() + 1000 * 60 * 2)
    !props.disabledButton && onClick?.()
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(targetDate)
      if (now < end)
        setTimer(
          intervalToDuration({
            start: now,
            end,
          }),
        )
      else {
        setTimer({ hours: 0, minutes: 0, seconds: 0, days: 0 })
        clearInterval(timer)
        timerDown?.()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (days + hours + minutes + seconds <= 0 && linkText)
    return (
      <RefreshCodeStyle
        className={props.disabledButton ? 'refresh-btn-disabled' : 'refresh-btn'}
        onClick={handleClick}
      >
        <HBIcon size="small" type="historyAlt" />
        <Typography component="span" className="resend-code">
          {linkText}
        </Typography>
      </RefreshCodeStyle>
    )

  return (
    <HBCountDownTimerRootStyle sx={{ ...sx }}>
      {extraTimerText && (
        <Typography
          variant="overline"
          component={'span'}
          sx={{ color: (theme) => theme.palette.grey[500], ml: (theme) => theme.spacing(2) }}
        >
          {extraTimerText}
        </Typography>
      )}
      {maximumShowedIndex >= 3 && !!days && (
        <>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            {days ? days.toString() : '00'}
          </Typography>
          <Typography>: </Typography>
        </>
      )}

      {maximumShowedIndex >= 2 && !!hours && (
        <>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            {' '}
            {hours ? hours + (maximumShowed === 'hours' && !!days ? days * 24 : 0) : '00'}
          </Typography>
          <Typography>: </Typography>
        </>
      )}

      {maximumShowedIndex >= 1 && !!minutes && (
        <>
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            {' '}
            {minutes ? minutes : '00'}
          </Typography>
          <Typography>: </Typography>
        </>
      )}

      {maximumShowedIndex >= 0 && (
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {' '}
          {seconds ? seconds : '00'}{' '}
        </Typography>
      )}
    </HBCountDownTimerRootStyle>
  )
}

HBCountDownTimer.displayName = 'HBCountDownTimer'
HBCountDownTimer.defaultProps = {}

export default HBCountDownTimer
