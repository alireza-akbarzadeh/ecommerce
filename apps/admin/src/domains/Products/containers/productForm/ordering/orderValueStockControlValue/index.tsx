import HBNumericFormatController from '@hasty-bazar/admin-shared/containers/HBNumericFormatController'
import { Grid } from '@mui/material'
import { useCallback } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { OrderValueStockControlValueInterface } from '..'
import OrderValueStockControlValueMessages from './OrderValueStockControlValue.messages'

interface OrderValueStockControlValueProps {
  hasEditData: boolean
}
function OrderValueStockControlValue({ hasEditData }: OrderValueStockControlValueProps) {
  const { formatMessage } = useIntl()

  const { control } = useFormContext<OrderValueStockControlValueInterface>()
  const formValues = useWatch({
    control,
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={3}>
        <HBNumericFormatController<OrderValueStockControlValueInterface>
          name={'minimalForAlert'}
          label={formatMessage(OrderValueStockControlValueMessages.minimalForAlert)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBNumericFormatController
          name={'minimalPerOrder'}
          label={formatMessage(OrderValueStockControlValueMessages.minimalPerOrder)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBNumericFormatController
          name={'maximalPerOrder'}
          label={formatMessage(OrderValueStockControlValueMessages.maximalPerOrder)}
          formRules={{
            min: {
              value: formValues?.minimalPerOrder!,
              message: formatMessage(OrderValueStockControlValueMessages.maximalMinimalPerOrder),
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={3}></Grid>
      <Grid item xs={12} sm={3}>
        <HBNumericFormatController
          name={'maximalSellWithoutInventory'}
          formRules={{
            min: {
              value: 0,
              message: formatMessage(OrderValueStockControlValueMessages.fieldMin, {
                min: 0,
              }),
            },
            max: {
              value: 10,
              message: formatMessage(OrderValueStockControlValueMessages.fieldMax, {
                max: 10,
              }),
            },
          }}
          label={formatMessage(OrderValueStockControlValueMessages.maximalSellWithoutInventory)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBNumericFormatController
          formRules={{
            required: {
              value: true,
              message: formatMessage(OrderValueStockControlValueMessages.fieldRequired),
            },
            max: {
              value: formValues?.maximalPerOrder!,
              message: formatMessage(OrderValueStockControlValueMessages.multiplesMaximalOrder),
            },
            min: {
              value: 1,
              message: formatMessage(OrderValueStockControlValueMessages.fieldMin, {
                min: 1,
              }),
            },
          }}
          name={'multiplesOrder'}
          label={formatMessage(OrderValueStockControlValueMessages.multiplesOrder)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <HBNumericFormatController
          name={'numberForShowCountInventory'}
          label={formatMessage(OrderValueStockControlValueMessages.numberForShowCountInventory)}
        />
      </Grid>
      <Grid item xs={12} sm={3}></Grid>
    </Grid>
  )
}

export default OrderValueStockControlValue
