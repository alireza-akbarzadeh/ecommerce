import { PaymentStatusEnum } from '@hasty-bazar/admin-shared/core/enums'
import { Box, Typography } from '@mui/material'

interface IPaymentStatusType {
  paymentStatusId: string | undefined
  paymentStatusName: string | undefined | null
}

export default function PaymentStatus({ paymentStatusId, paymentStatusName }: IPaymentStatusType) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Typography
        color={
          paymentStatusId == PaymentStatusEnum.Waiting
            ? 'warning.lighter'
            : paymentStatusId == PaymentStatusEnum.Success
            ? 'success.lighter'
            : paymentStatusId == PaymentStatusEnum.None
            ? 'grey.200'
            : 'error.lighter'
        }
        bgcolor={
          paymentStatusId == PaymentStatusEnum.Waiting
            ? 'warning.main'
            : paymentStatusId == PaymentStatusEnum.Success
            ? 'success.light'
            : paymentStatusId == PaymentStatusEnum.None
            ? 'grey.500'
            : 'error.light'
        }
        borderRadius={2}
        padding={paymentStatusId ? 2 : 0}
        component="span"
        variant={'subtitle2'}
      >
        {paymentStatusName}
      </Typography>
    </Box>
  )
}
