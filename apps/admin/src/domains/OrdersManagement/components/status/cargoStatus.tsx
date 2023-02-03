import { ICellRendererParams } from 'ag-grid-community'
import { Typography } from '@mui/material'
import { OrderStatusEnum } from '@hasty-bazar/admin-shared/core/enums/ShippingOrderType'

export default function CargoStatus({ value, data }: ICellRendererParams) {
  const { cargoStatusId } = data
  return value ? (
    <Typography
      color={
        cargoStatusId === OrderStatusEnum.waiting
          ? 'warning.main'
          : cargoStatusId === OrderStatusEnum.delivered
          ? 'success.main'
          : 'error.main'
      }
      bgcolor={
        cargoStatusId === OrderStatusEnum.waiting
          ? 'warning.light'
          : cargoStatusId === OrderStatusEnum.delivered
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
  ) : (
    '-'
  )
}
