import HBImg from '@hasty-bazar/admin-shared/containers/HBFileUploader/containers/HBImage.style'
import {
  AttributeDto,
  GetShipmentOrderBundleByIdQueryResult,
  SpecificAttributeDto,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { convertDateToPersian } from '@hasty-bazar/admin-shared/utils'
import { HBIconButton } from '@hasty-bazar/core'
import { Box, Grid, ListItem, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import ShipmentManagementMessage from '../../../messages'
import CommentReview from '../commentReview'
import { useAppSelector } from '@hasty-bazar/admin-shared/core/redux/hooks'
interface ShipmentItemsProps {
  bundleDetailsData: GetShipmentOrderBundleByIdQueryResult
  partyId: string
}

const Products: FC<ShipmentItemsProps> = ({ bundleDetailsData, partyId }) => {
  const { formatMessage } = useIntl()
  const defaultCurrencyTitle = useAppSelector((state) => state.app.defaultCurrencyTitle)

  const createFields = () => {
    return bundleDetailsData?.products?.map((item) => {
      return (
        <Grid item xs={12} md={6}>
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
                    {item?.product?.imageUrl && (
                      <HBImg
                        src={`${process.env.NEXT_PUBLIC_CDN}${item?.product?.imageUrl}`}
                        width="68"
                        height="68"
                      />
                    )}
                  </Box>
                  <Box sx={({ spacing }) => ({ padding: spacing(2, 6) })}>
                    <Typography sx={{ color: 'error.main' }}>
                      {formatMessage(ShipmentManagementMessage.especialOffer)}
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
                        onClick={() => {}}
                      />
                    </Box>
                    <Box>{item?.product?.quantity}</Box>
                    <Box>
                      <HBIconButton
                        variant="text"
                        icon="trashAlt"
                        iconStyle={{ color: 'primary.main' }}
                        iconSize={'small'}
                        sx={{ minWidth: 'fix-content' }}
                        disabled
                        onClick={() => {}}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid container item xs={12} md={9}>
              <Grid item xs={12}>
                <Typography sx={{ cursor: 'pointer' }}>{item?.product?.productName}</Typography>
              </Grid>
              <Grid container item xs={12}>
                <Grid item xs={12} md={8}>
                  <ListItem>
                    <Stack direction={'column'}>
                      {item?.product?.specificAttributes?.map(
                        (specificAttribute: SpecificAttributeDto) => (
                          <Typography variant="body2" pb={2}>
                            {`${specificAttribute?.valueTitle}`}
                          </Typography>
                        ),
                      )}
                      {item?.product?.attribute?.map((attribute: AttributeDto) => (
                        <Typography variant="body2" pb={2}>
                          {`${attribute?.name}: ${attribute?.value}`}
                        </Typography>
                      ))}
                    </Stack>
                  </ListItem>
                </Grid>
                <Grid item xs={12} md={4}>
                  {item?.product?.totalOriginalPrice === item?.product?.totalFinalPrice ? (
                    <Typography sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {`${item?.product?.totalFinalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                    </Typography>
                  ) : (
                    <>
                      {!!item?.product?.totalOriginalPrice && (
                        <Typography
                          sx={{
                            color: 'grey.500',
                            textDecoration: 'line-through',
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {`${item?.product?.totalOriginalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                        </Typography>
                      )}
                      {item?.product?.totalFinalPrice && (
                        <Typography
                          variant="subtitle2"
                          display={'flex'}
                          justifyContent={'flex-end'}
                        >
                          {`${item?.product?.totalFinalPrice?.toLocaleString()} ${defaultCurrencyTitle}`}
                        </Typography>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
              {!!item?.product?.quantity && (
                <Grid item xs={12} display={'flex'} alignItems={'center'}>
                  <Typography>
                    {`${item?.product?.quantity} ${formatMessage(
                      ShipmentManagementMessage.number,
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
                    {`${formatMessage(ShipmentManagementMessage.pickup)} ${convertDateToPersian(
                      item?.pickupDate?.date!,
                    )}`}
                  </Typography>
                  <Typography fontWeight={'500'}>
                    {`${formatMessage(ShipmentManagementMessage.range)} 
                    ${convertDateToPersian(item?.pickupDate?.toHour!)}-${convertDateToPersian(
                      item?.pickupDate?.fromHour!,
                    )}`}
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
                    {`${formatMessage(ShipmentManagementMessage.delivery)} ${convertDateToPersian(
                      bundleDetailsData?.deliveryDate?.date!,
                    )}`}
                  </Typography>
                  <Typography fontWeight={'500'}>
                    {`${formatMessage(ShipmentManagementMessage.range)} 
                    ${convertDateToPersian(
                      bundleDetailsData?.deliveryDate?.toHour!,
                    )}-${convertDateToPersian(bundleDetailsData?.deliveryDate?.fromHour!)}`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} mt={6}>
              <CommentReview partyId={partyId} productId={String(item?.product?.productId)} />
            </Grid>
          </Grid>
        </Grid>
      )
    })
  }
  return (
    <Grid container spacing={4}>
      {createFields()}
    </Grid>
  )
}

export default Products
