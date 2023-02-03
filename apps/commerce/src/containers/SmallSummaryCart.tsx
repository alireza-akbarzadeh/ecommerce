import CheckoutPageMessages from '@hasty-bazar-commerce/domains/Checkout/CheckoutPage.messages'
import { SectionItemWrapper } from '@hasty-bazar-commerce/domains/Checkout/CheckoutPage.style'
import { HBButton, openToast } from '@hasty-bazar/core'
import { Grid, Stack, Typography } from '@mui/material'
import { FC } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ISummaryCart } from './SummaryCart'

const SmallSummaryCart: FC<
  Required<
    Pick<ISummaryCart, 'clickedCallBack' | 'currency' | 'loading' | 'paymentAmount' | 'usedPage'>
  > &
    Pick<ISummaryCart, 'hasAwaitPayment' | 'disabled'>
> = ({
  usedPage,
  clickedCallBack,
  currency,
  loading,
  paymentAmount,
  hasAwaitPayment,
  disabled,
}) => {
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
    <SectionItemWrapper
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{ px: 5, py: 2, width: '100%' }}
    >
      <Grid item xs={5} sm={6}>
        <HBButton
          fullWidth
          sx={{ maxWidth: { xs: 128, sm: 'initial' } }}
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
      </Grid>
      <Grid item>
        <Stack spacing={2} alignItems="flex-end">
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage
              {...CheckoutPageMessages[usedPage === 'basket' ? 'totalPay' : 'paymentAmount']}
            />
          </Typography>
          <Typography variant="subtitle1" color={'text.primary'}>
            {Number(paymentAmount).toLocaleString()}
            <Typography component="span" variant="subtitle2" ml={1}>
              {currency}
            </Typography>
          </Typography>
        </Stack>
      </Grid>
    </SectionItemWrapper>
  )
}

export default SmallSummaryCart
