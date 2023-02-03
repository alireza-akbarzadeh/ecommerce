import { CommissionTypeOfEachProduct } from '@hasty-bazar/admin-shared/core/enums'
import { GetCommissionQueryResult } from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'

interface CreateCommissionTypeProps {
  data: GetCommissionQueryResult | undefined
}

const CreateCommissionType: FC<CreateCommissionTypeProps> = ({ data }) => {
  const { formatMessage } = useIntl()

  const creteTitleAndValueTypography = (commissionType: number) => {
    switch (commissionType) {
      case CommissionTypeOfEachProduct.Brand:
        return (
          <>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.productBrand,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.brandTitle!}</Typography>
          </>
        )
      case CommissionTypeOfEachProduct.ProductCategory:
        return (
          <>
            <Typography pr={1}>{`${formatMessage(
              OrdersManagementMessage.productCategory,
            )}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.categoryTitle!}</Typography>
          </>
        )
      case CommissionTypeOfEachProduct.Seller:
        return (
          <>
            <Typography pr={1}>{`${formatMessage(OrdersManagementMessage.seller)}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.vendorTitle!}</Typography>
          </>
        )
      case CommissionTypeOfEachProduct.Product:
        return (
          <>
            <Typography pr={1}>{`${formatMessage(OrdersManagementMessage.product)}`}</Typography>
            <Typography sx={{ color: 'grey.500' }}>{data?.productTitle!}</Typography>
          </>
        )
    }
  }
  return (
    <Box sx={{ display: 'flex', alignItem: 'center' }}>
      {creteTitleAndValueTypography(data?.commissionType!)}
    </Box>
  )
}

export default CreateCommissionType
