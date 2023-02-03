import { TextWithHBIcon } from '@hasty-bazar-commerce/components'
import { Inquiry } from '@hasty-bazar-commerce/services/saleApi.generated'
import { ButtonBase, Stack, Theme, Typography, useMediaQuery } from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'
import { SelectDeliveryDateModal } from '../modals'

interface ICargoShippingBox {
  bundle?: Inquiry
  onChangeProvider: (optionId: string) => void
}

const CargoShippingBox: FC<ICargoShippingBox> = ({ bundle, onChangeProvider }) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { formatMessage, formatDate } = useIntl()
  const [showDeliveryDateModal, setShowDeliveryDateModal] = useState(false)

  const currentActiveProvider = useMemo(
    () => bundle?.providers?.find((item) => item.isDefault),
    [bundle],
  )

  const currentProviderDate = useMemo(
    () =>
      currentActiveProvider?.deliveryTimes?.find((item) =>
        item.deliveryTimeFrames?.find((timeItem) => timeItem.isDefault),
      ),
    [bundle],
  )

  const changeProvider = (optionId: string) => {
    onChangeProvider(optionId)
    setShowDeliveryDateModal(false)
  }

  return (
    <Stack
      spacing={4}
      sx={(theme) => ({
        p: { sm: 6, xs: 2 },
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: theme.spacing(2),
      })}
    >
      <Stack direction="row" rowGap={4} alignItems="center" justifyContent="space-between">
        <TextWithHBIcon
          iconType="calendarAlt"
          text={<FormattedMessage {...CheckoutPageMessages.deliveryDateMessage} />}
          customVariant="subtitle1"
        />
        <ButtonBase disableRipple onClick={() => setShowDeliveryDateModal(true)}>
          <Stack direction="row" gap={2} alignItems={isSmall ? 'flex-end' : 'center'}>
            <TextWithHBIcon
              text={isSmall ? '' : <FormattedMessage {...CheckoutPageMessages.changeDeliverDate} />}
              iconType="editAlt"
              iconColor="info.main"
              textColor="info.main"
              customVariant="button"
              size="small"
            />
            <Typography variant="subtitle1">
              {formatDate(currentProviderDate?.date, {
                day: '2-digit',
                month: 'long',
              })}
              <FormattedMessage
                {...CheckoutPageMessages.deliveryTimePreview}
                values={{
                  from: currentProviderDate?.deliveryTimeFrames
                    ?.find((item) => item?.isDefault)
                    ?.from?.split(':')[0],
                  to: currentProviderDate?.deliveryTimeFrames
                    ?.find((item) => item?.isDefault)
                    ?.to?.split(':')[0],
                }}
              />
            </Typography>
          </Stack>
        </ButtonBase>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <TextWithHBIcon
          iconType="moneyInsert"
          text={formatMessage(CheckoutPageMessages.shippingFee)}
          customVariant="subtitle1"
        />
        <Typography variant="subtitle1">
          <FormattedMessage
            {...CheckoutPageMessages?.[bundle?.customerShare ? 'feeWithCurrency' : 'free']}
            values={{
              fee: Number(bundle?.customerShare).toLocaleString(),
              currency: currentActiveProvider?.currency,
            }}
          />
        </Typography>
      </Stack>

      {(!!bundle?.vendorShare || !!bundle?.platformShare) && (
        <Typography variant="subtitle2" color="text.secondary" textAlign="end">
          {formatMessage(CheckoutPageMessages.shippingFeeDetail, {
            initialShippingFee: Number(currentActiveProvider?.price).toLocaleString(),
            shippingFeeDiscount: (
              Number(bundle?.vendorShare) + Number(bundle?.platformShare)
            )?.toLocaleString(),
            currency: currentActiveProvider?.currency,
          })}
        </Typography>
      )}

      {showDeliveryDateModal && (
        <SelectDeliveryDateModal
          onClose={() => setShowDeliveryDateModal(false)}
          onAccept={changeProvider}
          currentActiveProvider={currentActiveProvider}
        />
      )}
    </Stack>
  )
}

export default CargoShippingBox
