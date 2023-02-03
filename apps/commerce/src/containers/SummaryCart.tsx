import CheckoutPageMessages from '@hasty-bazar-commerce/domains/Checkout/CheckoutPage.messages'
import { SectionItemWrapper } from '@hasty-bazar-commerce/domains/Checkout/CheckoutPage.style'
import { HBButton, openToast } from '@hasty-bazar/core'
import { Divider, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

type UsedPageType = 'payment' | 'shipping' | 'basket'

export interface ISummaryCart {
  totalAmount?: string | number
  totalDiscount?: string | number
  totalShippingFee?: string | number
  totalDiscountPercent?: string | number
  paymentAmount?: string | number
  walletAmount?: string | number
  voucherCode?: string | number
  currency: string
  totalCount?: string | number
  usedPage: UsedPageType
  clickedCallBack: () => void
  disabled?: boolean
  loading?: boolean
  hasAwaitPayment?: boolean
  hideButton?: boolean
}

interface PaymentPriceValueProps {
  price?: string | number
  label?: string
  currency: string
  valueColor?: string
  totalDiscountPercent?: string | number
}

const PaymentPriceValue: FC<PaymentPriceValueProps> = (props) => {
  const { price, valueColor, currency, totalDiscountPercent, label } = props
  return (
    <>
      {price ? (
        <Typography variant="subtitle1" textAlign="end" color={valueColor ?? 'text.primary'}>
          {totalDiscountPercent && `(${totalDiscountPercent}%)`}
          {Number(price).toLocaleString()}
          <Typography
            component="span"
            variant="subtitle2"
            color={valueColor ?? 'text.primary'}
            ml={1}
          >
            {currency}
          </Typography>
        </Typography>
      ) : null}
    </>
  )
}

const SummaryCart: FC<ISummaryCart> = (props) => {
  const {
    walletAmount,
    paymentAmount,
    totalShippingFee,
    totalDiscount,
    totalAmount,
    currency,
    totalDiscountPercent,
    totalCount,
    usedPage,
    clickedCallBack,
    disabled = false,
    voucherCode,
    loading,
    hasAwaitPayment,
    hideButton = false,
  } = props

  const { formatMessage } = useIntl()

  const onClickHandler = (e: React.MouseEvent) => {
    if (usedPage === 'basket' && hasAwaitPayment) {
      openToast({
        message: formatMessage({ ...CheckoutPageMessages.hasAwaitPayment }),
        type: 'info',
        vertical: 'top',
      })
      return
    }
    e.preventDefault()
    clickedCallBack()
  }

  return (
    <SectionItemWrapper width="100%">
      <Stack spacing={5}>
        {!!totalAmount && (
          <>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage
                  {...CheckoutPageMessages.totalAmount}
                  values={{ count: totalCount?.toString() }}
                />
              </Typography>
              <PaymentPriceValue price={totalAmount} currency={currency} />
            </Stack>
            <Divider variant="middle" sx={{ color: 'grey.200' }} />
          </>
        )}

        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage {...CheckoutPageMessages.shippingFee} />
            </Typography>
            {totalShippingFee && totalShippingFee !== '0' ? (
              <Typography variant="subtitle1" textAlign="end" color="text.secondary">
                {Number(totalShippingFee).toLocaleString()}
                <Typography component="span" variant="subtitle2" color="text.secondary" ml={1}>
                  {currency}
                </Typography>
              </Typography>
            ) : (
              <Typography
                sx={{ marginLeft: 'auto', width: '50%' }}
                variant="body2"
                color="text.secondary"
                textAlign="end"
              >
                <FormattedMessage
                  {...CheckoutPageMessages?.[
                    usedPage !== 'basket' && totalShippingFee === '0'
                      ? 'free'
                      : 'shippingFeeWithoutValue'
                  ]}
                />
              </Typography>
            )}
          </Stack>

          {!!voucherCode && (
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="caption" color="success.main">
                <FormattedMessage {...CheckoutPageMessages.paymentVoucherCodeTitle} />
              </Typography>
              <PaymentPriceValue
                price={voucherCode}
                valueColor="success.main"
                currency={currency}
              />
            </Stack>
          )}
        </Stack>

        {!!totalDiscount && (
          <>
            <Divider variant="middle" sx={{ color: 'grey.200' }} />
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="caption" color="error.main">
                <FormattedMessage {...CheckoutPageMessages.totalDiscount} />
              </Typography>
              <PaymentPriceValue
                price={totalDiscount}
                valueColor="error.main"
                currency={currency}
                {...(totalDiscountPercent && { totalDiscountPercent })}
              />
            </Stack>
          </>
        )}

        {!!walletAmount && (
          <>
            <Divider variant="middle" sx={{ color: 'grey.200' }} />
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="caption" color="primary">
                <FormattedMessage {...CheckoutPageMessages.wallet} />
              </Typography>
              <PaymentPriceValue valueColor="primary" price={walletAmount} currency={currency} />
            </Stack>
          </>
        )}

        {!!paymentAmount && (
          <>
            <Divider variant="middle" sx={{ color: 'grey.200' }} />
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage
                  {...CheckoutPageMessages[usedPage === 'basket' ? 'totalPay' : 'paymentAmount']}
                />
              </Typography>
              <PaymentPriceValue price={paymentAmount} currency={currency} />
            </Stack>
          </>
        )}

        {!hideButton && (
          <HBButton
            sx={{ height: 44 }}
            onClick={onClickHandler}
            loading={!!loading}
            disabled={!!loading || disabled}
          >
            <FormattedMessage
              {...CheckoutPageMessages[
                usedPage === 'payment'
                  ? 'paymentLable'
                  : usedPage === 'shipping'
                  ? 'shippingLable'
                  : 'continueLable'
              ]}
            />
          </HBButton>
        )}
      </Stack>
    </SectionItemWrapper>
  )
}

export default SummaryCart
