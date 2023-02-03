import { AttributeHandler, ImageShow, TextWithHBIcon } from '@hasty-bazar-commerce/components'
import {
  CancelType,
  CommerceDetailOrderItem,
} from '@hasty-bazar-commerce/services/saleApi.generated'
import { HBCheckBox, HBForm } from '@hasty-bazar/core'
import { Box, Stack, Typography } from '@mui/material'
import { FC, useMemo } from 'react'
import { CancelTypeEnum } from '../details/OrderTrackingCanceledDetail'
import { IcanceledProduct, useConsignmentCancelation } from './cancel-actions/CancelationContext'
import CancelCardActions from './cancel-actions/CancelCardActions'

interface ICancelConsignmentCardProps {
  item: CommerceDetailOrderItem
  isSelected?: boolean
  checkedCallBack?: (lastSelectedValue: boolean, item: IcanceledProduct) => void
  updateItem?: (item: IcanceledProduct) => void
  readOnly?: boolean
  finalyCanceledCount?: number
  finalyReason?: string
  vendorName?: string
  cancelType?: CancelType
}

export interface ICancelForm {
  reason: string
  count: string
}

const CancelConsignmentCard: FC<ICancelConsignmentCardProps> = (props) => {
  const {
    checkedCallBack,
    isSelected = false,
    item,
    updateItem,
    readOnly,
    cancelType,
    vendorName,
  } = props
  const { productCancelations } = useConsignmentCancelation()

  const canceledProduct = useMemo(() => {
    const findedItem = productCancelations?.canceledProducts.some(
      (i) => i.productId === item.productId,
    )
    return findedItem
  }, [productCancelations?.canceledProducts])

  return (
    <HBForm<ICancelForm>
      defaultValues={{
        count: readOnly ? item?.cancelQuantity?.toLocaleString() : '',
        reason: item.cancelReason ?? '',
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
                    count: 0,
                    productId: item.productId!,
                    cancelationReason: '',
                    quantity: item.quantity!,
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

            <Stack sx={{ flex: 1, overflow: 'hidden' }} spacing={4}>
              <Stack
                gap={4}
                direction="row"
                flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
                sx={{ flex: 1, minWidth: 0 }}
              >
                <Stack spacing={4}>
                  <Typography variant="subtitle2">{item.productName}</Typography>

                  <Stack spacing={2}>
                    {!!item.attribute?.length ||
                      (!!item.specificAttributes?.length && (
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
                      ))}

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
                </Stack>

                <Stack
                  width={{ xs: '100%', sm: 'inherit', marginLeft: 'auto' }}
                  direction="row"
                  alignItems="flex-start"
                >
                  <Typography variant="h6">
                    {item.totalFinalPrice ? item.totalFinalPrice?.toLocaleString() : ''}
                  </Typography>
                  <Typography variant="body1">{item.currency ?? ''}</Typography>
                </Stack>
              </Stack>

              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {(canceledProduct || (readOnly && cancelType === CancelTypeEnum.Partial)) && (
                  <CancelCardActions
                    readOnly={readOnly}
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
          {(canceledProduct || (readOnly && cancelType === CancelTypeEnum.Partial)) && (
            <CancelCardActions
              readOnly={readOnly}
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

export default CancelConsignmentCard
