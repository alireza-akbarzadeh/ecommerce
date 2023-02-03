import { Box } from '@mui/material'
import { FC } from 'react'

type StatusProps = {
  status: string
}

export enum StatusEnum {
  Draft = 'پیش نویس',
  Finalized = 'نهایی شده',
  Published = 'انتشار',
}

const Status: FC<StatusProps> = ({ status }: StatusProps) => {
  const renderColor: () => {
    bgColor: string
    color: string
  } = () => {
    switch (status) {
      case StatusEnum.Draft:
        return {
          bgColor: 'grey.200',
          color: 'grey.500',
        }
      case StatusEnum.Finalized:
        return {
          bgColor: 'grey.200',
          color: 'grey.500',
        }
      case StatusEnum.Published:
        return {
          bgColor: 'grey.200',
          color: 'grey.500',
        }
      default:
        return {
          bgColor: 'grey.200',
          color: 'grey.500',
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
      {status == '1' ? 'پیش نویس' : 'منتشر شده'}
    </Box>
  )
}
export default Status
