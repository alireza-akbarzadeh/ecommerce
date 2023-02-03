import { Box } from '@mui/material'
import { FC } from 'react'

type StatusProps = {
  status: string
}

export enum StatusEnum {
  Active = 'فعال',
  Inactive = 'پیش نویس',
  Rejected = 'رد شده',
  Pending = 'در حال بررسی',
  Published = 'منتشرشده',
}

const Status: FC<StatusProps> = ({ status }: StatusProps) => {
  const renderColor: () => {
    bgColor: string
    color: string
  } = () => {
    switch (status) {
      case StatusEnum.Active:
        return {
          bgColor: 'warning.light',
          color: 'warning.dark',
        }
      case StatusEnum.Inactive:
        return {
          bgColor: 'error.light',
          color: 'error.dark',
        }
      case StatusEnum.Rejected:
        return {
          bgColor: 'error.light',
          color: 'error.dark',
        }
      case StatusEnum.Pending:
        return {
          bgColor: 'warning.light',
          color: 'warning.dark',
        }
      case StatusEnum.Published:
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
      {status}
    </Box>
  )
}
export default Status
