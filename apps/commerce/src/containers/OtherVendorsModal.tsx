import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { useLazyGetWebCatalogProductsSameProductsByProductIdAndVendorIdQuery } from '@hasty-bazar-commerce/services/catalogApi.generated'
import { HBAccordion, HBDialog, HBIcon, HBLoading } from '@hasty-bazar/core'
import {
  accordionClasses,
  accordionDetailsClasses,
  accordionSummaryClasses,
  Stack,
  Typography,
} from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ContainersMessages from './Containers.message'
import OtherVendorItem from './OtherVendors/OtherVendorItem'

interface IOtherVendorModalProps {
  open: boolean
  onClose: () => void
  productId: string
  vendorId: string
}

const OtherVendorModal: FC<IOtherVendorModalProps> = (props) => {
  const { onClose, open, productId, vendorId } = props
  const { formatMessage } = useIntl()
  const [expanded, setExpanded] = useState<boolean>(true)

  const [getQuery, { isLoading, data }] =
    useLazyGetWebCatalogProductsSameProductsByProductIdAndVendorIdQuery()

  useEffect(() => {
    if (!!vendorId && !!productId && open) {
      getQuery({
        ...ApiConstants,
        productId,
        vendorId,
      })
    }
  }, [open])

  return (
    <HBDialog
      open={open}
      title={formatMessage({ ...ContainersMessages.buyFromOtherVendors })}
      onReject={onClose}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <Stack direction="row" justifyContent="center" alignItems="center">
        {isLoading && <HBLoading />}
        {!isLoading && (
          <HBAccordion
            customSummary={
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  bgcolor: 'grey.100',
                  width: '100%',
                  py: 2,
                  paddingLeft: 4,
                  paddingRight: 2,
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography color="text.prmary" variant="subtitle1">
                    <FormattedMessage
                      {...ContainersMessages.vendorsCount}
                      values={{ count: data?.data?.vendors?.length ?? '' }}
                    />
                  </Typography>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      height: 32,
                      width: 32,
                    }}
                  >
                    <HBIcon
                      type="angleDown"
                      sx={{
                        color: 'grey.500',
                        transition: 'transform 0.2s',
                        ...(expanded && { transform: 'rotate(180deg)' }),
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            }
            expanded={expanded}
            sx={{
              flex: 1,
              [`& .${accordionClasses.expanded}`]: {
                margin: (theme) => `${theme.spacing(1)}!important`,
              },
              [`& .${accordionSummaryClasses.content}`]: {
                margin: (theme) => `${theme.spacing(1)}!important`,
              },
              boxShadow: 'none',
              [`& .${accordionSummaryClasses.root}`]: { minHeight: 'unset', padding: 0 },
              [`& .${accordionDetailsClasses.root}`]: {
                p: 0,
              },
              bgcolor: 'grey.100',
            }}
            detail={
              <Stack sx={{ paddingBottom: 4 }} px={4} spacing={4}>
                {data?.data?.vendors
                  ?.filter((v) => v.productAvailableCount)
                  ?.map((vendor) => (
                    <OtherVendorItem
                      key={vendor.vendorId}
                      inventory={vendor.productAvailableCount ?? 0}
                      vendor={{
                        delivery: { value: vendor.productDeliveryTypeTitle, icon: '' },
                        finalPrice: vendor.productFinalPrice ?? 0,
                        guaranty: { value: vendor.productHasGuarantee, icon: '' },
                        icon: vendor.storeLogo,
                        id: vendor.vendorId,
                        name: vendor.storeName,
                        productId: `${vendor.productId ?? ''}`,
                        vendorId: vendor.vendorId,
                        vendorRate: {
                          count: vendor.vendorRatingCount,
                          icon: '',
                          value: vendor.vendorRating,
                        },
                      }}
                    />
                  ))}
              </Stack>
            }
          />
        )}
      </Stack>
    </HBDialog>
  )
}

export default OtherVendorModal
