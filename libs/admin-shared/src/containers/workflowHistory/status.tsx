import { Box } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import overflowHistoryMessages from './workflowHistory.messages'

type StatusProps = {
  status: number
  sx?: any
}

export const enum EnumOverflowHistoryStatus {
  Draft = 1,
  Published = 2,
  Disable = 3,
  Done = 4,
  NotDone = 5,
}

const Status: FC<StatusProps> = ({ status, sx }: StatusProps) => {
  const { formatMessage } = useIntl()

  const renderColor: () => {
    bgColor: string
    color: string
  } = () => {
    const renderColor: Record<EnumOverflowHistoryStatus, { bgColor: string; color: string }> = {
      [EnumOverflowHistoryStatus.Draft]: {
        bgColor: 'grey.200',
        color: 'grey.dark',
      },
      [EnumOverflowHistoryStatus.Disable]: {
        bgColor: 'error.light',
        color: 'error.dark',
      },
      [EnumOverflowHistoryStatus.Published]: {
        bgColor: 'success.light',
        color: 'success.dark',
      },
      [EnumOverflowHistoryStatus.Done]: {
        bgColor: 'success.light',
        color: 'success.dark',
      },
      [EnumOverflowHistoryStatus.NotDone]: {
        bgColor: 'error.light',
        color: 'error.dark',
      },
    }

    return renderColor[status as EnumOverflowHistoryStatus]
  }

  const getStatusText = (status: EnumOverflowHistoryStatus) => {
    const statusTexts: Record<EnumOverflowHistoryStatus, string> = {
      [EnumOverflowHistoryStatus.Draft]: formatMessage(overflowHistoryMessages.draft),
      [EnumOverflowHistoryStatus.Published]: formatMessage(overflowHistoryMessages.published),
      [EnumOverflowHistoryStatus.Disable]: formatMessage(overflowHistoryMessages.disable),
      [EnumOverflowHistoryStatus.Done]: formatMessage(overflowHistoryMessages.done),
      [EnumOverflowHistoryStatus.NotDone]: formatMessage(overflowHistoryMessages.notDone),
    }

    return statusTexts[status]
  }

  const { bgColor, color } = renderColor()

  return (
    <Box
      color={color}
      bgcolor={bgColor}
      borderRadius={2}
      px={3}
      py={1}
      minWidth={78}
      height={24}
      alignItems={'center'}
      justifyContent="center"
      textAlign="center"
      sx={{
        ...sx,
        fontSize: ({ typography }) => typography.caption,
      }}
      component="div"
    >
      {getStatusText(status)}
    </Box>
  )
}
export default Status
