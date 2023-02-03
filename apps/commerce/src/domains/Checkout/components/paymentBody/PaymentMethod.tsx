import { ImageShow } from '@hasty-bazar-commerce/components'
import { PaymentMethodType } from '@hasty-bazar-commerce/core/enums'
import {
  PaymentMethodDto,
  PaymentProviderDto,
} from '@hasty-bazar-commerce/services/paymentApi.generated'
import { HBRadioButton } from '@hasty-bazar/core'
import {
  Box,
  Collapse,
  Divider,
  FormControlLabel,
  radioClasses,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import React, { FC, useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'
import { SectionItemWrapper } from '../../CheckoutPage.style'

interface IPaymentMethod {
  content: PaymentMethodDto[]
  handleChangePaymentMethod: (paymentMethodId: string) => void
  handleChangePaymentProvider: (paymentProviderId: string) => void
  selectedPaymentProvider: PaymentProviderDto | null
  selectedPaymentMethod: PaymentMethodDto | null
  userWalletBalance: number
  payableAmount: number
  currency?: string
}

interface IMethodLabel {
  icon?: string
  title: string
  methodId?: string | number
  disabled?: boolean
  variant?: Variant
}

const PaymentMethod: FC<IPaymentMethod> = ({
  content,
  handleChangePaymentMethod,
  handleChangePaymentProvider,
  selectedPaymentMethod,
  selectedPaymentProvider,
  userWalletBalance,
  payableAmount,
  currency,
}) => {
  const walletId = content.find((item) => {
    return item.paymentMethodId && +item?.paymentMethodId == PaymentMethodType.Wallet
  })?.paymentMethodId

  const MethodLabel: FC<IMethodLabel> = useCallback(
    ({ icon, title, methodId, disabled, variant = 'body1' }) => {
      return (
        <Stack direction="row" spacing={2} alignItems="center" rowGap={1} flexWrap="wrap">
          {icon && (
            <ImageShow
              type="product"
              objectFit="contain"
              objectPosition="center"
              width={20}
              height={20}
              src={icon.includes('upload') ? icon : ''}
            />
          )}
          <Typography variant={variant} color={disabled ? 'text.disabled' : 'text.primary'} ml={2}>
            {title}
          </Typography>
          {methodId && methodId === walletId && (
            <Typography variant="caption" color={disabled ? 'text.disabled' : 'text.secondary'}>
              <FormattedMessage
                {...CheckoutPageMessages.walletBalance}
                values={{ balance: userWalletBalance.toLocaleString(), currency }}
              />
            </Typography>
          )}
        </Stack>
      )
    },
    [userWalletBalance],
  )

  return (
    <SectionItemWrapper>
      <Stack spacing={4}>
        <Typography variant="h4" color="text.primary">
          <FormattedMessage {...CheckoutPageMessages.paymentMethodsTitle} />
        </Typography>
        {Array.isArray(content) && selectedPaymentMethod && (
          <RadioGroup
            value={selectedPaymentMethod?.paymentMethodId}
            onChange={(e, val) => handleChangePaymentMethod(val)}
          >
            {content?.map((item) => (
              <React.Fragment key={item.paymentMethodId}>
                <FormControlLabel
                  disabled={
                    (item.paymentMethodId === walletId && userWalletBalance < payableAmount) ||
                    !item.paymentProviders?.length
                  }
                  value={item.paymentMethodId}
                  control={<HBRadioButton />}
                  label={
                    <MethodLabel
                      icon={item?.icon ?? ''}
                      title={item?.title ?? ''}
                      methodId={item.paymentMethodId}
                      disabled={
                        (item.paymentMethodId === walletId && userWalletBalance < payableAmount) ||
                        !item.paymentProviders?.length
                      }
                      variant="subtitle1"
                    />
                  }
                  sx={{ width: 'fit-content' }}
                />
                {Array.isArray(item?.paymentProviders) &&
                  item?.paymentProviders.filter((provider) => provider.isVisible).length > 0 && (
                    <Collapse
                      in={item.paymentMethodId === selectedPaymentMethod?.paymentMethodId}
                      timeout="auto"
                    >
                      <Box
                        sx={{
                          p: 3,
                          border: ({ palette }) => `1px solid ${palette.grey[300]}`,
                          borderRadius: 2,
                          width: '100%',
                        }}
                      >
                        <RadioGroup
                          value={selectedPaymentProvider?.paymentProviderId ?? ''}
                          onChange={(e, val) => handleChangePaymentProvider(val)}
                        >
                          <Stack
                            spacing={2}
                            divider={<Divider variant="middle" sx={{ color: 'grey.200' }} />}
                          >
                            {item?.paymentProviders?.map((child) => (
                              <FormControlLabel
                                key={child.paymentProviderId}
                                sx={(theme) => ({
                                  m: 0,
                                  width: 'fit-content',
                                  [`& .${radioClasses.root}`]: {
                                    paddingLeft: 0,
                                  },
                                })}
                                value={child.paymentProviderId}
                                control={
                                  <HBRadioButton
                                    sx={{
                                      '& > span:first-of-type': {
                                        width: 16,
                                        height: 16,
                                        boxShadow:
                                          selectedPaymentProvider?.paymentProviderId ===
                                          child.paymentProviderId
                                            ? 'inset 0 0 0 3px'
                                            : 'unset',
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <MethodLabel
                                    icon={child?.icon ?? ''}
                                    title={child?.title ?? ''}
                                  />
                                }
                              />
                            ))}
                          </Stack>
                        </RadioGroup>
                      </Box>
                    </Collapse>
                  )}
              </React.Fragment>
            ))}
          </RadioGroup>
        )}
      </Stack>
    </SectionItemWrapper>
  )
}

export default PaymentMethod
