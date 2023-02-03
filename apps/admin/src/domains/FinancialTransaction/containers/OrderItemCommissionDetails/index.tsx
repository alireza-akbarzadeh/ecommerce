import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import {
  ProductSpecificAttribute,
  useGetAdminSaleApiOrderCommissionItemByIdQuery,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import FinancialTransactionMessage from '../../financialTransaction.message'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

interface OrderItemCommissionDetailsProps {
  id: string
}

const OrderItemCommissionDetails: FC<OrderItemCommissionDetailsProps> = ({ id }) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const { data: { data: orderCommissionData } = {}, isLoading } =
    useGetAdminSaleApiOrderCommissionItemByIdQuery(
      {
        'client-name': 'Swagger on HIT.Hastim.Sale.Endpoints.AdminApi',
        'client-version': '1.0.1.100',
        id: id!,
      },
      { skip: !id },
    )

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

  const createFields = () => {
    return (
      !!orderCommissionData && (
        <>
          <Grid item xs={12} sm={2} mb={6}>
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
                src={`${process.env.NEXT_PUBLIC_CDN}${orderCommissionData?.imageUrl!}`}
                width="68"
                height="68"
              />
            </Box>
            <Box sx={({ spacing }) => ({ padding: spacing(2, 6) })}>
              <Typography sx={{ color: 'error.main' }}>
                {orderCommissionData?.isSpecialOffer &&
                  formatMessage(FinancialTransactionMessage.especialOffer)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box mb={6}>
              <Typography>{orderCommissionData?.productName}</Typography>
            </Box>
            {createSpecificAttribute(orderCommissionData?.specificAttributes!)}
            <Box mt={6}>
              <Typography>
                {`${orderCommissionData?.quantity?.toLocaleString()!} ${formatMessage(
                  FinancialTransactionMessage.number,
                )}`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography sx={{ color: 'grey.500', textDecoration: 'line-through' }}>
              {orderCommissionData?.orginalPrice !== orderCommissionData?.finalPrice &&
                `${orderCommissionData?.orginalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {`${orderCommissionData?.finalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography sx={{ color: 'info.main', mb: 6 }}>
              {`${formatMessage(
                FinancialTransactionMessage.relatedCommissionCode,
              )} ${orderCommissionData?.commissionCode?.toLocaleString()!} ${defaultCurrencyTitle}`}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {`${formatMessage(
                FinancialTransactionMessage.commissionPrice,
              )} ${orderCommissionData?.actualCommissionPrice?.toLocaleString()!} ${defaultCurrencyTitle}`}
            </Typography>
          </Grid>
        </>
      )
    )
  }

  return (
    <Grid container>
      {isLoading ? (
        <Grid item xs={12} display="flex" justifyContent="center">
          <CircularProgress color="secondary" size={20} />
        </Grid>
      ) : orderCommissionData ? (
        createFields()
      ) : (
        <Grid item xs={12} mb={6}>
          <Typography color={'grey.500'}>{`${formatMessage(
            FinancialTransactionMessage.thereIsNoData,
          )}`}</Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default OrderItemCommissionDetails
