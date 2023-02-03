import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { usePostWebPaymentWalletWithdrawMutation } from '@hasty-bazar-commerce/Service-Enhancers/PaymentApi.enhanced'
import { WalletDistributedOptionsResultApiResult } from '@hasty-bazar-commerce/services/paymentApi.generated'
import {
  commafy,
  HBButton,
  HBDialog,
  HBTextField,
  openToast,
  useYupValidationResolver,
} from '@hasty-bazar/core'
import { Box, InputAdornment, Stack, Typography } from '@mui/material'
import { numberToWords } from 'libs/utils/src'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { NumericFormat } from 'react-number-format'
import * as yup from 'yup'
import {
  ADD_NEW_CARD,
  BANK_ACCOUNT_INFORMATION_ID,
} from '../../accountManagment/containers/BankAccountIformations'
import WalletMessages from '../wallet.messages'

interface DepositDialogProps {
  onClose: () => void
  handleSuccess: () => void
  data: {
    cardNumber: string
    shabaNumber: string
    walletValue: number
    walletSetting?: WalletDistributedOptionsResultApiResult
  }
}

const WithdrawDialog: FC<DepositDialogProps> = ({
  onClose,
  handleSuccess,
  data: { walletValue, cardNumber, shabaNumber, walletSetting },
}) => {
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false)
  const router = useRouter()

  const [withdrawWalletRequest, { isLoading: withdrawLoading }] =
    usePostWebPaymentWalletWithdrawMutation()

  const { currency } = walletSetting?.data || {}
  const { formatMessage } = useIntl()
  const maximumWithdrawAmount = walletSetting?.data?.buyerMaxWithdraw ?? 100000
  const minimumWithdrawAmount = walletSetting?.data?.buyerMinWithdraw ?? 0

  const schema = yup.object().shape({
    amount: yup
      .number()
      .required()
      .typeError(
        formatMessage(WalletMessages.minimumAmountOfWithdraw, {
          amount: commafy(walletSetting?.data?.buyerMinDeposite),
          currency,
        }),
      )
      .min(
        minimumWithdrawAmount,
        formatMessage(WalletMessages.minimumAmountOfWithdraw, {
          amount: commafy(walletSetting?.data?.buyerMinWithdraw),
          currency,
        }),
      )
      .max(
        maximumWithdrawAmount,
        formatMessage(WalletMessages.maximumAmountOfWithDraw, {
          amount: commafy(walletSetting?.data?.buyerMaxDeposite),
          currency,
        }),
      )
      .max(
        walletValue,
        formatMessage(WalletMessages.maximumAmountOfWithDraw, {
          amount: commafy(walletValue),
          currency,
        }),
      ),
  })

  const resolver = useYupValidationResolver(schema)
  const {
    control,
    reset,
    formState: { isValid },
  } = useForm<{
    amount: string
  }>({
    defaultValues: {
      amount: '',
    },
    resolver,
    mode: 'all',
  })
  const { amount = '' } = useWatch({
    control,
  })

  const handleSubmit = () => {
    if (showConfirmationMessage) {
      withdrawWalletRequest({
        ...ApiConstants,
        withdrawModel: {
          amount: +amount * 10,
          cardNumber: cardNumber || shabaNumber,
        },
      })
        .unwrap()
        .then(() => {
          openToast({
            message: formatMessage(WalletMessages.requestSuccessMessage),
            type: 'success',
            vertical: 'top',
          })
          handleSuccess()
        })
        .catch(() => {
          openToast({
            message: formatMessage(WalletMessages.requestFailedMessage),
            type: 'error',
            vertical: 'top',
          })
        })
        .finally(() => {
          handleClose()
        })
    } else {
      if (cardNumber || shabaNumber) {
        setShowConfirmationMessage(true)
      } else {
        router.push(`/profile/managment/#${BANK_ACCOUNT_INFORMATION_ID}?${ADD_NEW_CARD}`)
      }
    }
  }
  const handleClose = () => {
    setShowConfirmationMessage(false)
    reset()
    onClose()
  }

  return (
    <HBDialog
      open
      maxWidth="lg"
      title={formatMessage(WalletMessages.amountOfWithdrawFromTheWallet)}
      sx={(theme) => ({
        [theme.breakpoints.only('xs')]: {
          '& .HBDialogTitle': {
            alignItems: 'flex-start',
            '& button': {
              paddingTop: 0.5,
            },
          },
        },
      })}
      onClose={() => handleClose()}
      onBackdropClick={() => handleClose()}
    >
      {showConfirmationMessage ? (
        <>
          <Typography mb={4} variant="subtitle2" sx={{ mt: 2 }} display="flex">
            {formatMessage(WalletMessages.confirmationWithdrawMessage, {
              amount: commafy(amount),
              currency,
              cardNumber: (
                <Typography mx={1}>
                  {cardNumber ? cardNumber.replace(/\B(?=(\d{4})+(?!\d))/g, '-') : shabaNumber}
                </Typography>
              ),
            })}
          </Typography>
          <Typography mb={4} variant="caption">
            {formatMessage(WalletMessages.subTitleConfirmationWithdrawMessage)}
          </Typography>
        </>
      ) : (
        <>
          <Stack spacing={6} mt={6}>
            <Stack width={'100%'} spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">
                {formatMessage(WalletMessages.withdrawableAmount)}:
                <Typography mx={1} variant="subtitle2" color="info.main" component={'span'}>
                  {commafy(walletValue)} {currency}
                </Typography>
              </Typography>
            </Stack>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value, ...rest }, fieldState }) => (
                <NumericFormat
                  label={formatMessage(WalletMessages.withdrawLabel)}
                  onValueChange={(values) => {
                    onChange(values.value)
                  }}
                  {...rest}
                  value={commafy(value)}
                  size="small"
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                  thousandSeparator=","
                  customInput={HBTextField}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
                  }}
                />
              )}
            />
          </Stack>

          <Typography variant="subtitle2" mt={1}>
            {numberToWords(amount)} {currency}
          </Typography>
        </>
      )}
      <Box display="flex" mt={10}>
        <HBButton
          variant="outlined"
          sx={{ flex: 1, mr: 4 }}
          onClick={() => {
            if (showConfirmationMessage) {
              router.push(`/profile/managment/#${BANK_ACCOUNT_INFORMATION_ID}?${ADD_NEW_CARD}`)
            } else {
              handleClose()
            }
          }}
        >
          {formatMessage(WalletMessages[showConfirmationMessage ? 'changeCardNumber' : 'cancel'])}
        </HBButton>
        <HBButton
          onClick={handleSubmit}
          loading={withdrawLoading}
          sx={{ flex: 1 }}
          disabled={!isValid}
        >
          {formatMessage(WalletMessages[showConfirmationMessage ? 'confirm' : 'withdrawWallet'])}
        </HBButton>
      </Box>
    </HBDialog>
  )
}

export default WithdrawDialog
