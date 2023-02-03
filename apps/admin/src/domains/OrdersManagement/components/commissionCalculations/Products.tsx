import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import {
  ProductSpecificAttribute,
  VendorsOrderItem,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, Divider, Grid, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'
import { CommissionModal } from '../commissionModal'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
interface ProductsProps {
  items: VendorsOrderItem[] | null | undefined
}

const Products: FC<ProductsProps> = ({ items }) => {
  const { formatMessage } = useIntl()
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [commissionId, setCommissionId] = useState<string>('')
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)
  const createRedCircle = () => {
    return (
      <Box
        sx={{
          background: (theme) => theme.palette.error.main,
          width: 12,
          height: 12,
          borderRadius: (theme) => theme.spacing(50),
        }}
        mr={2}
      ></Box>
    )
  }

  const createSpecificAttribute = (attributes: ProductSpecificAttribute[] | null) => {
    return attributes?.map((attribute) => (
      <Box display="flex" alignItems="center" mb={2}>
        {createRedCircle()}
        <Typography>{attribute?.valueTitle}</Typography>
      </Box>
    ))
  }

  const openCommissionModal = (id: string) => {
    setCommissionId(id)
    setShowDialog(true)
  }

  const createFields = () => {
    return items?.map((vendorOrder: VendorsOrderItem, index: number) => {
      return (
        <>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.200',
                borderRadius: (theme) => theme.spacing(4),
                margin: (theme) => theme.spacing(0, 3),
                width: 100,
                height: 100,
              }}
            >
              <HBImg
                src={`${process.env.NEXT_PUBLIC_CDN}${vendorOrder?.imageUrl!}`}
                width="68"
                height="68"
              />
            </Box>
            <Box sx={({ spacing }) => ({ padding: spacing(2, 6) })}>
              <Typography sx={{ color: 'error.main' }}>
                {vendorOrder?.isSpecialOffer &&
                  formatMessage(OrdersManagementMessage.especialOffer)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box mb={6}>
              <Typography>{vendorOrder?.productName}</Typography>
            </Box>
            {createSpecificAttribute(vendorOrder?.specificAttributes!)}
            <Box mt={6}>
              <Typography>
                {`${vendorOrder?.quantity?.toLocaleString()} ${formatMessage(
                  OrdersManagementMessage.quantityNumber,
                )}`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            {vendorOrder?.orginalPrice !== vendorOrder?.finalPrice && (
              <Typography sx={{ color: 'grey.500', textDecoration: 'line-through' }}>
                {`${vendorOrder?.orginalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
              </Typography>
            )}
            <Typography sx={{ fontWeight: 'bold' }}>
              {`${vendorOrder?.finalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3} onClick={() => openCommissionModal(vendorOrder?.commissionId!)}>
            <Typography sx={{ color: 'info.main', mb: 6, cursor: 'pointer' }}>
              {`${formatMessage(OrdersManagementMessage.relatedCommissionCode)} ${
                vendorOrder?.commissionCode! ?? ''
              }`}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {`${formatMessage(
                OrdersManagementMessage.commissionPrice,
              )} ${vendorOrder?.actualCommissionPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
            </Typography>
          </Grid>
          {items?.length > 1 && index !== items?.length - 1 && (
            <Grid item xs={12} sm={12} md={12} sx={{ display: 'block' }}>
              <Divider sx={{ color: 'grey.200', mt: 4, mb: 10 }} />
            </Grid>
          )}
        </>
      )
    })
  }

  return (
    <Grid container>
      {createFields()}
      <CommissionModal
        onClose={() => setShowDialog(false)}
        open={showDialog}
        {...{ commissionId }}
      />
    </Grid>
  )
}

export default Products
