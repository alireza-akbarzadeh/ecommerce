import { OrderPaymentEnum } from '@hasty-bazar/admin-shared/core/enums/ShippingOrderType'
import { Typography } from '@mui/material'
import { ICellRendererParams } from 'ag-grid-community'
export default function ShipmentStatus({ value, data }: ICellRendererParams) {
  const { cargoStatusId } = data

  return (
    <Typography
      color={
        cargoStatusId === OrderPaymentEnum.Waiting
          ? 'warning.main'
          : cargoStatusId === OrderPaymentEnum.Success
          ? 'success.main'
          : 'error.main'
      }
      bgcolor={
        cargoStatusId === OrderPaymentEnum.Waiting
          ? 'warning.light'
          : cargoStatusId === OrderPaymentEnum.Success
          ? 'success.light'
          : 'error.light'
      }
      borderRadius={2}
      padding={1}
      component="span"
      variant={'subtitle2'}
    >
      {value}
    </Typography>
  )
}
