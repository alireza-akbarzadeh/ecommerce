import { HBWorkflow } from '@hasty-bazar/admin-shared/containers'
import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
import {
  AttributeDto,
  ShipmentTrackingDto,
  SpecificAttributeDto,
  usePostAdminSaleShipmentBundleProductByShipmentOrderIdBundleProductChangeStateMutation as useChangeState,
  useGetAdminSaleOrderByOrderIdBasketQuery,
  useGetAdminSaleShipmentBundleProductGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  useGetAdminSaleShipmentBundleProductGetTransitionByEntityIdAndStateMachineCodeFactorQuery as useGetStateList,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBIconButton } from '@hasty-bazar/core'
import { Box, Grid, ListItem, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'
import CommentReview from '../commentReview'

interface ShipmentItemsProps {
  shipmentTrackings: ShipmentTrackingDto
  partyId: string
}
enum ShipmentWorkFlow {
  Shipment = 'ShipmentBundleProduct',
}
const ShipmentItems: FC<ShipmentItemsProps> = ({ shipmentTrackings, partyId }) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id?.[0]

  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)
  const { refetch, data } = useGetAdminSaleOrderByOrderIdBasketQuery({
    'client-name': 'admin',
    'client-version': '1.0.0',
    orderId: id!,
  })
  const createFields = () => {
    return shipmentTrackings?.shipmentProducts?.map((product, index) => {
      return (
        <Grid item xs={12} md={6} key={index}>
          <Grid container item>
            <Grid item xs={12} md={3}>
              <Box display={'flex'} gap={5}>
                <Box>
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
                    {product?.imageUrl && (
                      <HBImg
                        src={`${process.env.NEXT_PUBLIC_CDN}${product?.imageUrl}`}
                        width="68"
                        height="68"
                      />
                    )}
                  </Box>
                  <Box sx={({ spacing }) => ({ padding: spacing(2, 6) })}>
                    <Typography sx={{ color: 'error.main' }}>
                      {formatMessage(OrdersManagementMessage.especialOffer)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      backgroundColor: 'grey.200',
                      borderRadius: (theme) => theme.spacing(2),
                      width: 130,
                      height: 40,
                    }}
                  >
                    <Box>
                      <HBIconButton
                        variant="text"
                        icon="plus"
                        iconStyle={{ color: 'primary.main' }}
                        iconSize={'small'}
                        sx={{ minWidth: 'fix-content' }}
                        disabled
                      />
                    </Box>
                    <Box>
                      {
                        //@ts-ignore
                        product?.shoppingCartQuantity
                      }
                    </Box>
                    <Box>
                      <HBIconButton
                        variant="text"
                        icon="trashAlt"
                        iconStyle={{ color: 'primary.main' }}
                        iconSize={'small'}
                        sx={{ minWidth: 'fix-content' }}
                        disabled
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid container item xs={12} md={9}>
              <Grid item xs={12}>
                <HBWorkflow
                  entityId={String(product.bundleProductId)}
                  machineCode={StateMachineCode.ShipmentBundleProduct}
                  useGetStateList={useGetStateList}
                  useGetState={useGetStateInfo}
                  body={{ shipmentOrderId: data?.data?.shipmentOrderId }}
                  useChangeState={useChangeState}
                  onChangeState={refetch}
                  stateCode={product?.stateCode}
                  factor={String(ShipmentWorkFlow.Shipment)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ cursor: 'pointer' }}>{product?.productName}</Typography>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={12} md={8}>
                  <ListItem>
                    <Stack direction={'column'}>
                      {product?.specificAttributes?.map(
                        (specificAttribute: SpecificAttributeDto, index) => (
                          <Typography variant="body2" pb={2} key={index}>
                            {`${specificAttribute?.valueTitle}`}
                          </Typography>
                        ),
                      )}
                      {product?.attribute?.map((attribute: AttributeDto, index) => (
                        <Typography variant="body2" pb={2} key={index}>
                          {`${attribute?.name}: ${attribute?.value}`}
                        </Typography>
                      ))}
                    </Stack>
                  </ListItem>
                </Grid>
                <Grid item xs={12} md={4}>
                  {product?.totalOriginalPrice === product?.totalFinalPrice ? (
                    <Typography sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {`${product?.totalFinalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                    </Typography>
                  ) : (
                    <>
                      {!!product?.totalOriginalPrice && (
                        <Typography
                          sx={{
                            color: 'grey.500',
                            textDecoration: 'line-through',
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {`${product?.totalOriginalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                        </Typography>
                      )}

                      {product?.totalFinalPrice && (
                        <Typography
                          variant="subtitle2"
                          display={'flex'}
                          justifyContent={'flex-end'}
                        >
                          {`${product?.totalFinalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                        </Typography>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
              {!!product?.shoppingCartQuantity && (
                <Grid item xs={12} display={'flex'} alignItems={'center'}>
                  <Typography>
                    {`${product?.shoppingCartQuantity} ${formatMessage(
                      OrdersManagementMessage.number,
                    )}`}
                  </Typography>
                </Grid>
              )}
              <Grid container item xs={12} spacing={4}>
                <Grid
                  item
                  xs={12}
                  md={6}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                >
                  <Typography mb={2} fontWeight={'500'}>
                    {`${formatMessage(OrdersManagementMessage.pickup)} ${convertDateToPersian(
                      product?.pickupDate!,
                    )}`}
                  </Typography>
                  <Typography fontWeight={'500'}>
                    {`${formatMessage(OrdersManagementMessage.range)} ${convertDateToPersian(
                      product?.pickupTime!,
                    )} `}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-end'}
                >
                  <Typography mb={2} fontWeight={'500'}>
                    {`${formatMessage(OrdersManagementMessage.delivery)} ${convertDateToPersian(
                      shipmentTrackings?.deliveryDate!,
                    )}`}
                  </Typography>
                  <Typography fontWeight={'500'}>
                    {`${formatMessage(OrdersManagementMessage.range)} ${convertDateToPersian(
                      shipmentTrackings?.deliveryHour!,
                    )} `}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mt={6}>
              <CommentReview partyId={partyId} productId={String(product?.productId)} />
            </Grid>
          </Grid>
        </Grid>
      )
    })
  }

  return (
    <Grid container columnSpacing={{ xs: 1, sm: 2, md: 8 }} mt={4}>
      {createFields()}
    </Grid>
  )
}

export default ShipmentItems
