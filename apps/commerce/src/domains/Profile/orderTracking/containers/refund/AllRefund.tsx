import { HBForm, HBRadioButton } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { ConsignmentCardProducts } from '../../components'
import OrderTrackingMessages from '../../orderTracking.messages'
import { RefundActionWrapper } from '../../OrderTracking.styles'
import RefundComplaint from './refund-actions/RefundComplaint'
import RefundReasonSelect from './refund-actions/RefundReasonSelect'
import { IRefundForm } from './RefundCard'
import { useRefund, useRefundUpdater } from './RefundContext'

interface IAllRefundProps {
  checked: boolean
}

const AllRefund: FC<IAllRefundProps> = (props) => {
  const { checked } = props
  const { products, allRefundation } = useRefund()
  const { setAllRefundation } = useRefundUpdater()
  const contentFormProvider = useForm<IRefundForm>({ mode: 'all' })
  const { isValid } = contentFormProvider.formState
  const { reset, getValues } = contentFormProvider

  useEffect(() => {
    if (!checked) reset()
    if (checked && allRefundation?.orderId)
      setAllRefundation({
        ...allRefundation!,
        complaint: getValues('complain'),
        refundReason: getValues('reason'),
        formValidation: isValid,
      })
  }, [isValid, checked])

  return (
    <Stack spacing={6} sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={4}>
        <HBRadioButton value="all" checked={checked} sx={{ height: 'fit-content', p: 0 }} />

        <Typography variant="h6" color="text.primary">
          <FormattedMessage {...OrderTrackingMessages.refundAll} />
        </Typography>
      </Stack>
      {checked && (
        <Stack spacing={6}>
          <ConsignmentCardProducts
            items={products.map((product) => {
              return {
                count: product.quantity!,
                src: product.productDefaultImage,
                productClassId: product.productClassId ?? '',
                productId: product.productId ?? '',
                productName: product.productName,
              }
            })}
          />
          <HBForm<IRefundForm>
            defaultValues={{ complain: '', count: '', reason: '' }}
            onSubmit={() => {}}
            formProviderProps={contentFormProvider}
          >
            <RefundActionWrapper spacing={4}>
              <RefundReasonSelect
                onChange={(value) => {
                  if (allRefundation?.orderId)
                    setAllRefundation({ ...allRefundation!, refundReason: value })
                }}
              />
              <RefundComplaint
                onChange={(value) => {
                  if (allRefundation?.orderId)
                    setAllRefundation({ ...allRefundation!, complaint: value })
                }}
              />
            </RefundActionWrapper>
          </HBForm>
        </Stack>
      )}
    </Stack>
  )
}

export default AllRefund
