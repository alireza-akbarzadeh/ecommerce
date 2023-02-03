import {
  AttributeHandler,
  CommerceIconButton,
  HBLink,
  ImageShow,
  Nothing,
} from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { persianNumber } from '@hasty-bazar-commerce/core/utils/persianConvert'
import { useGetWebSaleOrdersByOrderIdCargoAndCargoIdItemsQuery } from '@hasty-bazar-commerce/services/saleApi.generated'
import {
  GetCommentPartyByProductIdQueryResult,
  useLazyGetWebSocialCommentsProductByProductIdQuery,
} from '@hasty-bazar-commerce/services/socialApi.generated'
import { HBButton, HBDivider, HBIcon, HBLoading, HBRadioButton } from '@hasty-bazar/core'
import {
  Box,
  Dialog,
  dialogClasses,
  DialogContent,
  dialogContentClasses,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { FC, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import OrderTrackingMessages from '../../orderTracking.messages'

export interface ICargoProducts {
  comment: GetCommentPartyByProductIdQueryResult | null
  productId: string
}

interface IOrderTrackingCargoProductsProps {
  onClose: (commentOptions?: ICargoProducts) => void
  cargoId: string
  partyId: string
  shoppingCartId: string
}

const OrderTrackingCargoProducts: FC<IOrderTrackingCargoProductsProps> = (props) => {
  const { onClose, cargoId, partyId, shoppingCartId } = props
  const { formatMessage } = useIntl()
  const [selctedProduct, setSelectedProduct] = useState<string>('')
  const { isFetching, data } = useGetWebSaleOrdersByOrderIdCargoAndCargoIdItemsQuery(
    {
      ...ApiConstants,
      cargoId,
      orderId: shoppingCartId,
    },
    { skip: !cargoId || !partyId || !shoppingCartId },
  )
  const [getQuery, { isFetching: gettingCommentLoading }] =
    useLazyGetWebSocialCommentsProductByProductIdQuery()

  const selectItem = (id: string) => {
    setSelectedProduct(id)
  }

  const handleGetComment = async () => {
    const result = await getQuery({
      ...ApiConstants,
      productId: selctedProduct,
    }).unwrap()

    if (result.success) {
      onClose({ comment: result.data ?? null, productId: selctedProduct })
    }
  }

  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
      onClose={() => onClose()}
      sx={(theme) => ({
        [`& .${dialogClasses.paper}`]: {
          [theme.breakpoints.down('sm')]: {
            margin: 0,
            width: 'calc(100% - 20px)',
          },
          [theme.breakpoints.between('sm', 'md')]: {
            width: 'calc(100% - 44px)',
            margin: 0,
          },
        },
        [`& .${dialogContentClasses.root}`]: {
          [theme.breakpoints.down('sm')]: {
            p: theme.spacing(5, 4),
          },
        },
      })}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            <FormattedMessage {...OrderTrackingMessages.addComment} />
          </Typography>
          <CommerceIconButton
            onClick={() => onClose()}
            icon={<HBIcon type="multiply" size="small" />}
            sx={{ color: (theme) => `${theme.palette.text.secondary}!important` }}
          />
        </Stack>
      </DialogTitle>
      <DialogContent>
        {isFetching && (
          <Stack alignItems="center">
            <HBLoading />
          </Stack>
        )}
        {!isFetching && !!data?.data?.shoppingCartItems?.length && (
          <Stack spacing={6}>
            <Typography variant="subtitle1" color="text.secondary">
              <FormattedMessage {...OrderTrackingMessages.selectProductForComment} />
            </Typography>
            {data?.data?.shoppingCartItems?.map((item, index) => (
              <>
                <Grid container columns={3} rowGap={6}>
                  <Grid item sm={2} xs={3}>
                    <Stack direction="row" spacing={8}>
                      <Stack alignItems="flex-start" direction="row" spacing={2}>
                        <HBRadioButton
                          onChange={() => selectItem(item.productId!)}
                          checked={selctedProduct === item.productId}
                          sx={{
                            p: 0,
                          }}
                        />
                        <Box
                          sx={(theme) => ({
                            [theme.breakpoints.down('sm')]: {
                              mt: `${theme.spacing(2.5)}!important`,
                            },
                          })}
                        >
                          <HBLink href={`/product/${item.hsin}/${item.slug}`} target="_blank">
                            <ImageShow
                              width={120}
                              height={120}
                              src={item.imageUrl ?? ''}
                              objectPosition="center"
                              layout="fill"
                              type="product"
                              objectFit="contain"
                            />
                          </HBLink>
                        </Box>
                      </Stack>

                      <Stack spacing={4}>
                        <Typography variant="subtitle2">{item.productName}</Typography>
                        <Stack spacing={2}>
                          <AttributeHandler
                            attributes={
                              item?.attribute?.map((i) => ({
                                color: i.color,
                                icon: i.icon,
                                isTop: i.isTop,
                                value: i.value,
                              })) ?? []
                            }
                            specialAttributes={
                              item?.specificAttributes?.map((i) => ({
                                color: i.color,
                                icon: i.icon,
                                valueTitle: i.valueTitle,
                              })) ?? []
                            }
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={3} sm={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {item.finalPrice && (
                      <>
                        <Typography variant="h6">
                          {persianNumber(item?.finalPrice?.toLocaleString())}
                        </Typography>
                        <Typography variant="body1">{item.currency ?? ''}</Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
                {index !== data?.data?.shoppingCartItems?.length && <HBDivider />}
              </>
            ))}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <HBButton variant="outlined" onClick={() => onClose()}>
                <FormattedMessage {...OrderTrackingMessages.cancel} />
              </HBButton>
              <HBButton
                disabled={!selctedProduct}
                variant="contained"
                onClick={() => handleGetComment()}
                loading={gettingCommentLoading}
              >
                <FormattedMessage {...OrderTrackingMessages.addCommentForProduct} />
              </HBButton>
            </Stack>
          </Stack>
        )}
        {!isFetching && !data?.data?.shoppingCartItems && <Nothing />}
      </DialogContent>
    </Dialog>
  )
}

export default OrderTrackingCargoProducts
