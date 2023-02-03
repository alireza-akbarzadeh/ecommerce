import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import usePay from '@hasty-bazar-commerce/core/hook/usePay'
import { englishNumber } from '@hasty-bazar-commerce/core/utils/persianConvert'
import { useGetWebPaymentWalletOptionsQuery } from '@hasty-bazar-commerce/services/paymentApi.generated'
import {
  commafy,
  HBButton,
  HBDialog,
  HBTextField,
  useYupValidationResolver,
} from '@hasty-bazar/core'
import {
  Box,
  buttonClasses,
  dialogClasses,
  dialogContentClasses,
  InputAdornment,
  paperClasses,
  Stack,
  Theme,
  Typography,
} from '@mui/material'
import { numberToWords } from 'libs/utils/src'
import { FC, useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { NumericFormat } from 'react-number-format'
import * as yup from 'yup'
import WalletMessages from '../wallet.messages'
interface DepositDialogProps {
  onClose: () => void
}

const prices = [10000, 20000, 30000, 40000, 50000]

const DepositDialog: FC<DepositDialogProps> = ({ onClose }) => {
  const { formatMessage } = useIntl()

  const { data: walletSetting } = useGetWebPaymentWalletOptionsQuery({
    ...ApiConstants,
  })

  const { currency } = walletSetting?.data || {}
  const schema = yup.object().shape({
    price: yup
      .number()
      .transform((value) => (isNaN(value) ? 0 : value))
      .required()
      .typeError(
        formatMessage(WalletMessages.minimumAmountOfCreditIncrease, {
          price: commafy(walletSetting?.data?.buyerMinDeposite),
          currency,
        }),
      )
      .min(
        walletSetting?.data?.buyerMinDeposite || 0,
        formatMessage(WalletMessages.minimumAmountOfCreditIncrease, {
          price: commafy(walletSetting?.data?.buyerMinDeposite),
          currency,
        }),
      )
      .max(
        walletSetting?.data?.buyerMaxDeposite || 0,
        formatMessage(WalletMessages.maximumAmountOfCreditIncrease, {
          price: commafy(walletSetting?.data?.buyerMaxDeposite),
          currency,
        }),
      ),
  })

  const resolver = useYupValidationResolver(schema)
  const {
    control,
    reset,
    clearErrors,
    trigger,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<{
    price: string
  }>({
    defaultValues: {
      price: '',
    },
    resolver,
    mode: 'all',
  })
  const { price = '' } = useWatch({
    control,
  })

  useEffect(() => {
    clearErrors()
  }, [watch('price')])

  const handleClose = () => {
    onClose()
    reset()
  }

  const { depositWalletReq, walletChargingIsLoading } = usePay()

  return (
    <HBDialog
      open
      maxWidth="sm"
      fullWidth
      title={formatMessage(WalletMessages.amountOfCreditIncrease)}
      sx={(theme) => ({
        [`& .${dialogContentClasses.root}`]: {
          padding: (theme) => theme.spacing(5, 6, 6),
        },
        [theme.breakpoints.down('sm')]: {
          [`& .${dialogClasses.container}`]: {
            [`& .${paperClasses.root}`]: {
              minWidth: 300,
            },
          },
        },
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
      <Stack spacing={6} mt={6}>
        <Stack direction="row-reverse" flexWrap="wrap" spacing={2}>
          {prices.map((amount, index) => (
            <HBButton
              key={index}
              variant={'outlined'}
              onClick={() => {
                setValue('price', amount.toString())
                trigger('price')
              }}
              sx={(theme) => ({
                p: theme.spacing(2.5, 4.5),
                m: { sm: `${theme.spacing(0.5)} !important`, xs: `${theme.spacing(1)} !important` },
                minWidth: { sm: 80, xs: 'calc(100% / 2 - 10px)' },
                [`&.${buttonClasses.root}`]: {
                  '&:nth-last-of-type(-n+2):not(:nth-of-type(even))': {
                    minWidth: { sm: 80, xs: 'calc(100% - 10px)' },
                  },
                  [`&.${buttonClasses.outlined}`]: {
                    color: +price === amount ? theme.palette.warning.dark : theme.palette.grey[700],
                    borderColor:
                      +price === amount ? theme.palette.warning.main : theme.palette.grey[300],
                  },
                },
              })}
            >
              {commafy(amount, '.')} {currency}
            </HBButton>
          ))}
        </Stack>
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value, ...rest }, fieldState }) => (
            <NumericFormat
              onValueChange={(values) => {
                onChange(values.value)
              }}
              {...rest}
              value={commafy(value)}
              label={formatMessage(WalletMessages.otherAmounts)}
              size="small"
              error={!!fieldState.error?.message}
              helperText={fieldState.error?.message}
              thousandSeparator=","
              customInput={HBTextField}
              InputProps={{
                endAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
              }}
              sx={(theme: Theme) => ({
                m: {
                  sm: `${theme.spacing(6, 'auto', 0)} !important`,
                  xs: `${theme.spacing(2, 'auto', 0)} !important`,
                },
                width: { sm: '100%', xs: 'calc(100% - 7px)' },
              })}
            />
          )}
        />
      </Stack>

      <Typography variant="subtitle2" mt={1}>
        {numberToWords(price)}{' '}
        {typeof price === 'number' && Number.isSafeInteger(price) && currency}
      </Typography>

      <Box display="flex" mt={{ sm: 10, xs: 2 }}>
        <HBButton variant="outlined" sx={{ flex: 1, mr: 4 }} onClick={() => handleClose()}>
          {formatMessage(WalletMessages.cancel)}
        </HBButton>
        <HBButton
          loading={walletChargingIsLoading}
          onClick={() => depositWalletReq({ payableAmountInRial: +englishNumber(price) * 10 ?? 0 })}
          sx={{ flex: 1 }}
          disabled={!isValid || (isValid && walletChargingIsLoading)}
        >
          {formatMessage(WalletMessages.chargeWallet)}
        </HBButton>
      </Box>
    </HBDialog>
  )
}

export default DepositDialog
