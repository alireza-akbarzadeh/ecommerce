import { CommerceAccordion, TextWithHBIcon } from '@hasty-bazar-commerce/components'
import { Divider, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'
import { SectionItemWrapper } from '../../CheckoutPage.style'
import { IPaymentCargosData } from '../../Payment/PaymentPage'
import { CargoWrapper } from '../cargo'

type IOrderByCargo = {
  cargos: IPaymentCargosData[]
  productsCount?: string | number
}

const OrderByCargo: FC<IOrderByCargo> = ({ cargos, productsCount }) => {
  const { formatDate, formatMessage } = useIntl()

  const setTitleInfo = (cargoItem: IPaymentCargosData, index: number) => {
    return (
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        <TextWithHBIcon
          text={formatMessage(CheckoutPageMessages.cargoCountTitle, { count: index })}
          iconType="shoppingBag"
          customVariant="h6"
        />
        {cargoItem?.shipmentUserPrice && (
          <TextWithHBIcon
            customVariant="subtitle1"
            iconType="moneyInsert"
            text={
              <FormattedMessage
                {...CheckoutPageMessages.bundleShippingFee}
                values={{
                  count: Number(cargoItem.shipmentUserPrice).toLocaleString(),
                  currency: cargoItem.currency,
                }}
              />
            }
          />
        )}
        {cargoItem?.shipmentDeliveryDate && (
          <TextWithHBIcon
            customVariant="subtitle1"
            iconType="calendarAlt"
            text={
              <>
                <FormattedMessage
                  {...CheckoutPageMessages.shipmentDeliveryDate}
                  values={{
                    date: formatDate(cargoItem.shipmentDeliveryDate, {
                      day: '2-digit',
                      month: 'long',
                    }),
                  }}
                />
                <FormattedMessage
                  {...CheckoutPageMessages.deliveryTimePreview}
                  values={{
                    from: cargoItem?.shipmentDeliveryFromHour?.split(':')[0],
                    to: cargoItem?.shipmentDeliveryToHour?.split(':')[0],
                  }}
                />
              </>
            }
          />
        )}
      </Stack>
    )
  }

  return (
    <SectionItemWrapper sx={{ px: 6, py: 0 }}>
      <CommerceAccordion
        type="unStyle"
        open
        summaryTitle={
          <Typography variant="h4">
            <FormattedMessage
              {...CheckoutPageMessages.orderList}
              values={{ count: productsCount ?? '' }}
            />
          </Typography>
        }
      >
        <Stack
          spacing={6}
          p={6}
          mt={0}
          mb={6}
          sx={{ border: ({ palette }) => `1px solid ${palette.grey[200]}`, borderRadius: 2 }}
          divider={<Divider variant="fullWidth" sx={{ color: 'grey.200' }} />}
        >
          {cargos?.map((cargoItem, index: number) => {
            return (
              <CargoWrapper
                key={index}
                withAttributes={false}
                shippingDetail={false}
                products={cargoItem.list ?? []}
                additionalTitleInfo={setTitleInfo(cargoItem, index + 1)}
                isPayment
              />
            )
          })}
        </Stack>
      </CommerceAccordion>
    </SectionItemWrapper>
  )
}

export default OrderByCargo
