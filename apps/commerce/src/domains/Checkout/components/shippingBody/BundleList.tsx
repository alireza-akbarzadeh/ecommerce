import { CommerceAccordion } from '@hasty-bazar-commerce/components'
import { ShippingMethodTypeEnum } from '@hasty-bazar-commerce/core/enums'
import { Divider, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'
import { SectionItemWrapper } from '../../CheckoutPage.style'
import { useShipping } from '../../Shipping'
import { CargoWrapper } from '../cargo'

interface ISummaryTitle {
  bundleIndex: number
  productsCount?: number
  vendorName?: string
  deliveryDate?: string
  currency?: string
  shippingFee?: number
}

const BundleList: FC = () => {
  const { formatDate } = useIntl()
  const { inquiries, shippingSummary, shippingMethod } = useShipping()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const summaryTitle = (props: ISummaryTitle) => {
    const { bundleIndex, deliveryDate, productsCount, shippingFee, vendorName, currency } = props

    return (
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 4 }}
        alignItems={{ sm: 'center' }}
      >
        <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2} alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            <FormattedMessage
              {...CheckoutPageMessages?.[
                shippingMethod === ShippingMethodTypeEnum.Vendor ? 'seller' : 'cargoCountTitle'
              ]}
              values={{ count: bundleIndex }}
            />
          </Typography>
          {shippingMethod === ShippingMethodTypeEnum.Vendor && (
            <Typography variant="h6" fontWeight="bold" color="info.main">
              {vendorName}
            </Typography>
          )}
          <Typography variant="subtitle1" color="text.secondary">
            <FormattedMessage
              {...CheckoutPageMessages.productsCount}
              values={{ count: productsCount ?? 0 }}
            />
          </Typography>
        </Stack>
        <Typography variant="subtitle1">
          <FormattedMessage
            {...CheckoutPageMessages?.[shippingFee ? 'bundleShippingFee' : 'freeShippingFee']}
            values={{
              count: Number(shippingFee).toLocaleString(),
              currency,
            }}
          />
        </Typography>
        {isMobile && (
          <Typography variant="subtitle1">
            <FormattedMessage
              {...CheckoutPageMessages.deliveryDatePreview}
              values={{
                date: formatDate(deliveryDate ?? '', {
                  day: '2-digit',
                  month: 'long',
                }),
              }}
            />
          </Typography>
        )}
      </Stack>
    )
  }
  return (
    <SectionItemWrapper>
      <Typography variant="h4">
        <FormattedMessage
          {...CheckoutPageMessages.basketList}
          values={{ count: shippingSummary?.totalCount ?? 0 }}
        />
      </Typography>

      <Stack sx={{ mt: 5 }}>
        {inquiries?.map((item, index) => {
          const providerDate = item.providers
            ?.flatMap((item) =>
              item.deliveryTimes?.find((date) =>
                date.deliveryTimeFrames?.find((time) => time.isDefault),
              ),
            )
            .filter((item) => item)[0]

          return (
            <CommerceAccordion
              key={index}
              type="changeable"
              summaryTitle={summaryTitle({
                bundleIndex: index + 1,
                productsCount: item.productsQuantity,
                vendorName: item?.products?.[0]?.vendor?.storeName ?? '',
                deliveryDate: providerDate?.date,
                shippingFee: item.customerShare ?? 0,
                currency: item.providers?.[0].currency ?? '',
              })}
              open={index === 0}
              endAdornment={
                !isMobile && (
                  <Typography variant="subtitle1">
                    <FormattedMessage
                      {...CheckoutPageMessages.deliveryDatePreview}
                      values={{
                        date: formatDate(providerDate?.date ?? '', {
                          day: '2-digit',
                          month: 'long',
                        }),
                      }}
                    />
                    <FormattedMessage
                      {...CheckoutPageMessages.deliveryTimePreview}
                      values={{
                        from: providerDate?.deliveryTimeFrames
                          ?.find((item) => item?.isDefault)
                          ?.from?.split(':')[0],
                        to: providerDate?.deliveryTimeFrames
                          ?.find((item) => item?.isDefault)
                          ?.to?.split(':')[0],
                      }}
                    />
                  </Typography>
                )
              }
            >
              <Stack spacing={6} p={{ sm: 4, xs: 2 }} pt={0}>
                <Divider variant="fullWidth" sx={{ color: 'grey.200' }} />
                <CargoWrapper products={item.products ?? []} bundle={item} />
              </Stack>
            </CommerceAccordion>
          )
        })}
      </Stack>
    </SectionItemWrapper>
  )
}

export default BundleList
