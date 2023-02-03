import { ShipmentTrackingDto } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessages from '../../ordersManagement.message'

interface CreateAccordinTitleProps {
  item: ShipmentTrackingDto
}

const CreateAccordinTitle: FC<CreateAccordinTitleProps> = ({ item }) => {
  const { formatMessage } = useIntl()
  const createEachTitle = (title: string, value: number | string) => {
    return (
      <Box width="100%" display="flex" flexDirection="row">
        <Typography variant="h6" fontWeight="bold">
          {formatMessage(OrdersManagementMessages[title])}
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'info.main' }}>
          {typeof value === 'string' ? value : value}
        </Typography>
      </Box>
    )
  }

  return (
    <Box width="100%" display="flex" flexDirection="row">
      {createEachTitle('numberOfProducts', item?.shipmentProducts?.length!)}
      {createEachTitle('deliveryTypesName', item?.providerName!)}
      {createEachTitle('shipmentCode', item?.bundleNumber!)}
    </Box>
  )
}

export default CreateAccordinTitle
