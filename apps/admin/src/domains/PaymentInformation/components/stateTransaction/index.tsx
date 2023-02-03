import { PaymentStatusEnum } from '@hasty-bazar/admin-shared/core/enums'
import { Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
export default function StateTransaction({ value, data }: ICellRendererParams) {
  if (!value) return
  return (
    <Typography
      py={2}
      px={4}
      color={
        data?.paymentStatus == PaymentStatusEnum.Waiting
          ? 'primary.main'
          : data?.paymentStatus == PaymentStatusEnum.Success
          ? 'success.main'
          : data?.paymentStatus == PaymentStatusEnum.Failed ||
            data?.paymentStatus == PaymentStatusEnum.Canceled
          ? 'error.main'
          : 'grey.700'
      }
      bgcolor={
        data?.paymentStatus == PaymentStatusEnum.Waiting
          ? 'primary.lighter'
          : data?.paymentStatus == PaymentStatusEnum.Success
          ? 'success.lighter'
          : data?.paymentStatus == PaymentStatusEnum.Failed ||
            data?.paymentStatus == PaymentStatusEnum.Canceled
          ? 'error.lighter'
          : 'grey.200'
      }
      borderRadius={(theme) => theme.spacing(4)}
      component="span"
      variant={'subtitle2'}
      sx={{ display: 'flex', width: 100, justifyContent: 'center', alignItems: 'center' }}
    >
      {value}
    </Typography>
  )
}
