import { EnumFormHeaderStatus } from '@hasty-bazar/admin-shared/containers/formContainer/formHeader'
import { Box } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import formContainerMessages from './formContainer.messages'

type StatusProps = {
  status: number
}

const Status: FC<StatusProps> = ({ status }: StatusProps) => {
  const { formatMessage } = useIntl()
  const renderColor: () => {
    bgColor: string
    color: string
  } = () => {
    switch (status) {
      case EnumFormHeaderStatus.draft:
        return {
          bgColor: 'warning.light',
          color: 'warning.dark',
        }
      case EnumFormHeaderStatus.disable:
        return {
          bgColor: 'error.light',
          color: 'error.dark',
        }
      case EnumFormHeaderStatus.published:
        return {
          bgColor: 'success.light',
          color: 'success.dark',
        }
      default:
        return {
          bgColor: 'success.light',
          color: 'success.dark',
        }
    }
  }
  const getStatusText = (status: EnumFormHeaderStatus) => {
    switch (status) {
      case EnumFormHeaderStatus.draft:
        return formatMessage(formContainerMessages.draft)
      case EnumFormHeaderStatus.ConfirmationOfContent:
        return formatMessage(formContainerMessages.confirmationOfContent)
      case EnumFormHeaderStatus.published:
        return formatMessage(formContainerMessages.published)
      case EnumFormHeaderStatus.disable:
        return formatMessage(formContainerMessages.disable)
      default:
        return status
    }
  }

  const { bgColor, color } = renderColor()
  return (
    <Box
      color={color}
      bgcolor={bgColor}
      borderRadius={2}
      padding={1}
      height={24}
      px={3}
      minWidth={'78px'}
      alignSelf="center"
      justifyContent="center"
      textAlign={'center'}
      sx={({ typography }) => ({
        fontSize: typography.caption,
      })}
      component="div"
    >
      {getStatusText(status)}
    </Box>
  )
}
export default Status
