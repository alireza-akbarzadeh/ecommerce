import { HBDialog, HBForm } from '@hasty-bazar/core'
import { Box, Stack } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessages from '../../ordersManagement.message'
import CommissionModalForm from './CommissionModalForm'

interface CommissionDialog {
  open: boolean
  onClose: () => void
  commissionId: string
}

const CommissionModal: FC<CommissionDialog> = ({ onClose, open, commissionId }) => {
  const { formatMessage } = useIntl()

  return (
    <HBDialog
      sx={{ maxWidth: 770, mx: 'auto' }}
      title={formatMessage(OrdersManagementMessages.commissionCalculation)}
      open={open}
      onClose={onClose}
      onReject={onClose}
    >
      <HBForm<any> onSubmit={() => {}} mode="all">
        <Box mt={6} mb={8}>
          <Stack spacing={8} alignItems="flex-start">
            <CommissionModalForm {...{ commissionId }} />
          </Stack>
        </Box>
      </HBForm>
    </HBDialog>
  )
}

export default CommissionModal
