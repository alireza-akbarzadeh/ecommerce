import { HBLoginChecker, NationalCodeValidationModal } from '@hasty-bazar-commerce/containers'
import useNationalCodeValidator from '@hasty-bazar-commerce/core/hook/useNationalCodeValidator'
import { HBButton } from '@hasty-bazar/core'
import { Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import BasketMessages from '../../basket.messages'

interface IBillProps {
  totalAmount: string
  totalDiscount: string | null
  currency: string
  routeToBasketCallback: () => void
  disableShippment?: boolean
}

const Bill: FC<IBillProps> = (props) => {
  const { totalAmount, totalDiscount, currency, routeToBasketCallback, disableShippment } = props
  const [showNationalCodeValidator, setShowNationalCodeValidator] = useState(false)
  const { push } = useRouter()

  const { handleCheckNationalCode, isLoading } = useNationalCodeValidator({
    onValid: () => push('/checkout/shipping'),
    onInvalid: () => setShowNationalCodeValidator(true),
  })

  return (
    <>
      <Stack
        p={4}
        sx={{
          width: 'inherit',
          bgcolor: 'common.white',
          boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.1)',
          marginTop: 'auto!important',
        }}
        spacing={4}
        alignItems="center"
      >
        <Stack spacing={2} sx={{ width: '100%' }}>
          {!!totalDiscount && (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography color="text.secondary" variant="body2">
                <FormattedMessage {...BasketMessages.off} />
              </Typography>
              <Typography variant="h6" color="error.main">
                <FormattedMessage
                  {...BasketMessages.priceWithCurrency}
                  values={{ price: totalDiscount ?? 0, currency }}
                />
              </Typography>
            </Stack>
          )}

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography color="text.secondary" variant="body2">
              <FormattedMessage {...BasketMessages.totalCart} />
            </Typography>
            <Typography variant="h6" color="text.primary">
              <FormattedMessage
                {...BasketMessages.priceWithCurrency}
                values={{ price: (totalAmount ?? 0).toString(), currency }}
              />
            </Typography>
          </Stack>
        </Stack>
        <HBLoginChecker disabled={disableShippment} onSignedInAction={handleCheckNationalCode}>
          <HBButton
            disabled={disableShippment}
            loading={isLoading}
            sx={{ width: 'fit-content', height: 48, minHeight: 48, minWidth: 180 }}
          >
            <FormattedMessage {...BasketMessages.order} />
          </HBButton>
        </HBLoginChecker>
        <HBButton
          onClick={() => {
            push('/basket')
            routeToBasketCallback()
          }}
          variant="text"
          sx={{ width: 'fit-content', color: (theme) => `${theme.palette.info.main}!important` }}
        >
          <FormattedMessage {...BasketMessages.showFullCart} />
        </HBButton>
      </Stack>
      {showNationalCodeValidator && (
        <NationalCodeValidationModal
          onSuccess={() => push('/checkout/shipping')}
          onClose={() => setShowNationalCodeValidator(false)}
        />
      )}
    </>
  )
}

export default Bill
