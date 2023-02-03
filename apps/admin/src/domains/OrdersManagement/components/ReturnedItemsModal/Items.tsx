import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import {
  AttributeDto,
  GetOrderBasketQueryResultApiResult,
  ShipmentProductDto,
  ShipmentTrackingDto,
  SpecificAttributeDto,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { Box, Grid, List, ListItem, Stack, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import OrdersManagementMessage from '../../ordersManagement.message'

import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'

interface ItemsProps {
  shippingOrder: GetOrderBasketQueryResultApiResult | undefined
}

const Items = ({ shippingOrder }: ItemsProps) => {
  const shipmentTrackings: ShipmentTrackingDto[] | null | undefined =
    shippingOrder?.data?.shipmentTrackings
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const renderShipmentProducts = (shipmentTracking: ShipmentTrackingDto) =>
    shipmentTracking?.shipmentProducts?.map((shipmentProducts: ShipmentProductDto) => (
      <Grid item xs={6}>
        <Stack direction={'row'} spacing={6}>
          <Box position={'relative'}>
            <Box
              sx={({ spacing }) => ({
                boxShadow: 2,
                width: 130,
                height: 160,
                borderRadius: spacing(1),
              })}
            >
              <HBImg
                src={`${process.env.NEXT_PUBLIC_CDN}${shipmentProducts?.imageUrl}`}
                sx={{ objectFit: 'contain', width: '100%', height: '100%' }}
                alt="shipmetProduct"
              />
            </Box>
            {shipmentProducts?.shoppingCartQuantity && (
              <Box
                sx={({ spacing, palette }) => ({
                  position: 'absolute',
                  top: 10,
                  left: 8,
                  bgcolor: 'common.white',
                  width: 30,
                  height: 30,
                  borderRadius: spacing(1),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: `1px solid ${palette.grey[200]}`,
                  fontSize: 12,
                })}
              >
                {shipmentProducts.shoppingCartQuantity}
              </Box>
            )}
          </Box>
          <Box width={'100%'}>
            <Typography variant={'subtitle2'}>{shipmentProducts?.productName}</Typography>
            <List>
              <ListItem
                sx={{ dispaly: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                {shipmentProducts?.discountPercent ? (
                  <Box
                    sx={({ spacing }) => ({
                      width: 30,
                      height: 30,
                      bgcolor: 'error.main',
                      borderRadius: spacing(1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'common.white',
                      fontSize: 12,
                    })}
                  >
                    {`${shipmentProducts.discountPercent}%-`}
                  </Box>
                ) : (
                  <Box />
                )}
                {!!shipmentProducts?.totalFinalPrice && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                      {`${shipmentProducts?.totalFinalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                    </Typography>
                  </Box>
                )}
              </ListItem>
              {shipmentProducts?.totalFinalPrice !== shipmentProducts?.totalOriginalPrice && (
                <ListItem sx={{ flexDirection: 'row-reverse' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'grey.500',
                      textDecoration: 'line-through',
                      textAlign: 'right',
                    }}
                  >
                    {`${shipmentProducts?.totalOriginalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                  </Typography>
                </ListItem>
              )}
              <ListItem>
                <Stack direction={'column'}>
                  {shipmentProducts?.specificAttributes?.map(
                    (specificAttribute: SpecificAttributeDto) => (
                      <Typography variant="body2" pb={2}>
                        {`${specificAttribute?.valueTitle}`}
                      </Typography>
                    ),
                  )}
                  {shipmentProducts?.attribute?.map((attribute: AttributeDto) => (
                    <Typography variant="body2" pb={2}>
                      {`${attribute?.name}: ${attribute?.value}`}
                    </Typography>
                  ))}
                </Stack>
              </ListItem>
              <ListItem
                sx={{ dispaly: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Box>
                  <Typography variant="body2" mb={2} fontWeight={'500'}>
                    {`${formatMessage(OrdersManagementMessage.pickup)} ${convertDateToPersian(
                      shipmentProducts?.pickupDate!,
                    )}`}
                  </Typography>
                  <Typography variant="body2" fontWeight={'500'}>
                    {`${formatMessage(OrdersManagementMessage.range)} ${convertDateToPersian(
                      shipmentProducts?.pickupTime!,
                    )} `}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" mb={2} fontWeight={'500'}>
                    {`${formatMessage(OrdersManagementMessage.delivery)} ${convertDateToPersian(
                      shipmentTracking?.deliveryDate!,
                    )}`}
                  </Typography>
                  <Typography variant="body2" fontWeight={'500'}>
                    {`${formatMessage(OrdersManagementMessage.range)} ${convertDateToPersian(
                      shipmentTracking?.deliveryHour!,
                    )} `}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Typography variant="body2" color="warning.main">
                  {`${formatMessage(OrdersManagementMessage.storeName)}: ${
                    shipmentProducts?.vendorName
                  }`}
                </Typography>
              </ListItem>
            </List>
          </Box>
        </Stack>
      </Grid>
    ))

  const renderItems = () =>
    shipmentTrackings?.map((shipmentTracking: ShipmentTrackingDto) =>
      renderShipmentProducts(shipmentTracking),
    )

  return <>{renderItems()}</>
}

export default Items
