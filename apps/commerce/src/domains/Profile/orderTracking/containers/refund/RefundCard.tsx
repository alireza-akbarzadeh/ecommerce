import { AttributeHandler, ImageShow, TextWithHBIcon } from '@hasty-bazar-commerce/components'
import { CommerceDetailOrderItem } from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBCheckBox, HBForm } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'
import RefundCardActions from './refund-actions/RefundCardActions'
import { IRefundedProduct, useRefund } from './RefundContext'

interface IRefundCardProps {
  item: CommerceDetailOrderItem
  isSelected?: boolean
  checkedCallBack?: (lastSelectedValue: boolean, item: IRefundedProduct) => void
  updateItem?: (item: IRefundedProduct) => void
  readOnly?: boolean
  vendorName?: string
}

export interface IRefundForm {
  reason: string
  complain: string
  count: string
}

const RefundCard: FC<IRefundCardProps> = (props) => {
  const { checkedCallBack, isSelected = false, item, updateItem, readOnly, vendorName } = props
  const { formatMessage } = useIntl()
  const { productRefundation } = useRefund()

  const refundedProduct = useMemo(() => {
    const findedItem = productRefundation?.refundedProducts.some(
      (i) => i.productId === item.productId,
    )
    return findedItem
  }, [productRefundation?.refundedProducts])

  return (
    <HBForm<IRefundForm>
      defaultValues={{
        complain: item.refundComplaint ?? '',
        count: item.refundQuantity?.toLocaleString() ?? '',
        reason: item.refundReason ?? '',
      }}
      onSubmit={() => {}}
    >
      <Stack gap={4} sx={{ overflow: 'hidden' }}>
        <Stack direction="row" sx={{ overflow: 'hidden' }}>
          <Stack
            spacing={{ sm: 8, xs: 2 }}
            direction="row"
            alignItems="flex-start"
            sx={{ flex: 1, overflow: 'hidden' }}
          >
            {!readOnly && (
              <HBCheckBox
                sx={{ p: 0 }}
                checked={isSelected}
                onChange={() => {
                  if (!checkedCallBack) return
                  checkedCallBack(isSelected, {
                    complaint: '',
                    files: [],
                    productId: item.productId!,
                    quantity: item.quantity!,
                    refundedCount: 0,
                    refundReason: '',
                  })
                }}
              />
            )}
            <Stack spacing={4} alignItems="center">
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <ImageShow
                  width={120}
                  height={120}
                  type="product"
                  src={item.productDefaultImage ?? ''}
                  layout="fill"
                  objectFit="contain"
                />

                <Box
                  sx={{
                    bgcolor: 'grey.100',
                    p: 2,
                    position: 'absolute',
                    left: 8,
                    bottom: 8,
                    borderRadius: 2,
                    opacity: 0.9,
                  }}
                >
                  <Typography variant="subtitle1" color="primary.main">
                    {item.quantity}
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <Stack spacing={4} sx={{ flex: 1, overflow: 'hidden' }}>
              <Stack
                gap={4}
                direction="row"
                flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
                sx={{ flex: 1, minWidth: 0 }}
              >
                <Stack spacing={4}>
                  <Typography variant="subtitle2">{item.productName}</Typography>
                  {!!item.attribute?.length || !!item.specificAttributes?.length ? (
                    <Stack spacing={2}>
                      <AttributeHandler
                        attributes={
                          item.attribute?.map((i) => ({
                            color: i.color,
                            icon: i.icon,
                            isTop: i.isTop,
                            value: i.value,
                          })) ?? []
                        }
                        specialAttributes={
                          item.specificAttributes?.map((i) => ({
                            color: i.color,
                            icon: i.icon,
                            valueTitle: i.valueTitle,
                          })) ?? []
                        }
                      />
                      {vendorName && (
                        <TextWithHBIcon
                          customVariant="subtitle2"
                          text={vendorName}
                          size="small"
                          iconType="store"
                          textColor="text.primary"
                        />
                      )}
                    </Stack>
                  ) : null}
                </Stack>
                <Stack
                  width={{ xs: '100%', sm: 'inherit', marginLeft: 'auto' }}
                  direction="row"
                  alignItems="flex-start"
                  justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                >
                  <Typography variant="h6">
                    {item.finalPrice ? item.finalPrice?.toLocaleString() : ''}
                  </Typography>
                  <Typography variant="body1">{item.currency ?? ''}</Typography>
                </Stack>
              </Stack>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {refundedProduct && (
                  <RefundCardActions
                    product={{
                      productId: item.productId!,
                      quantity: item.quantity!,
                    }}
                    updateItem={updateItem}
                  />
                )}
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Box sx={{ display: { sm: 'none', xs: 'block' } }}>
          {refundedProduct && (
            <RefundCardActions
              product={{
                productId: item.productId!,
                quantity: item.quantity!,
              }}
              updateItem={updateItem}
            />
          )}
        </Box>
      </Stack>
    </HBForm>
  )
}

export default RefundCard
