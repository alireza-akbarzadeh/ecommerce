import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import {
  AttributeDto,
  GetAllShipmentOrderBundleProductsByBundleIdQeuryResult,
  SpecificAttributeDto,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { Box, Grid, List, ListItem, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../../messages'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
interface ProductsProps {
  productsData: GetAllShipmentOrderBundleProductsByBundleIdQeuryResult[] | null
  deliveryDateTime: Date
  deliveryHours: Date
}

const Products: FC<ProductsProps> = ({ productsData, deliveryDateTime, deliveryHours }) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const renderRelatedProducts = (
    bundleProduct: GetAllShipmentOrderBundleProductsByBundleIdQeuryResult,
  ) => (
    <Grid item xs={12} md={6}>
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
              src={`${process.env.NEXT_PUBLIC_CDN}${bundleProduct?.product?.imageUrl}`}
              sx={{ objectFit: 'contain', width: '100%', height: '100%' }}
              alt="shipmetProduct"
            />
          </Box>
          {bundleProduct?.product?.quantity && (
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
              {bundleProduct.product.quantity}
            </Box>
          )}
        </Box>
        <Box width={'100%'}>
          <Typography variant={'subtitle2'}>{bundleProduct?.product?.productName}</Typography>
          <List>
            <ListItem
              sx={{ dispaly: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
            >
              {bundleProduct?.product?.discountPercent ? (
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
                  {`${bundleProduct.product.discountPercent}%-`}
                </Box>
              ) : (
                <Box></Box>
              )}
              {!!bundleProduct?.product?.totalFinalPrice && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                    {`${bundleProduct.product.totalFinalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                  </Typography>
                </Box>
              )}
            </ListItem>
            {bundleProduct?.product?.totalFinalPrice !==
              bundleProduct?.product?.totalOriginalPrice && (
              <ListItem sx={{ flexDirection: 'row-reverse' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'grey.500',
                    textDecoration: 'line-through',
                    textAlign: 'right',
                  }}
                >
                  {`${bundleProduct?.product?.totalOriginalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                </Typography>
              </ListItem>
            )}
            <ListItem>
              <Stack direction={'column'}>
                {bundleProduct?.product?.specificAttributes?.map(
                  (specificAttribute: SpecificAttributeDto) => (
                    <Typography variant="body2" pb={2}>
                      {`${specificAttribute?.valueTitle}`}
                    </Typography>
                  ),
                )}
                {bundleProduct?.product?.attribute?.map((attribute: AttributeDto) => (
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
                  {`${formatMessage(ShipmentManagementMessage.pickup)} ${convertDateToPersian(
                    bundleProduct?.pickupDate?.date!,
                  )}`}
                </Typography>
                <Typography variant="body2" fontWeight={'500'}>
                  {`${formatMessage(ShipmentManagementMessage.range)} ${convertDateToPersian(
                    bundleProduct?.pickupDate?.toHour!,
                  )}-${convertDateToPersian(bundleProduct?.pickupDate?.fromHour!)} `}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" mb={2} fontWeight={'500'}>
                  {`${formatMessage(ShipmentManagementMessage.delivery)} ${convertDateToPersian(
                    deliveryDateTime.toString(),
                  )}`}
                </Typography>
                <Typography variant="body2" fontWeight={'500'}>
                  {`${formatMessage(ShipmentManagementMessage.range)} ${convertDateToPersian(
                    deliveryHours.toString(),
                  )} `}
                </Typography>
              </Box>
            </ListItem>
            <Typography variant="body2" color="warning.main">
              {`${formatMessage(ShipmentManagementMessage.storeName)}: ${
                bundleProduct?.product?.storeName
              }`}
            </Typography>
          </List>
        </Box>
      </Stack>
    </Grid>
  )

  const renderItems = () => productsData?.map((item) => renderRelatedProducts(item))

  return <>{renderItems()}</>
}

export default Products
