import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  useDeleteWebSaleBasketVoucherMutation,
  usePutWebSaleBasketVoucherMutation,
} from '@hasty-bazar-commerce/Service-Enhancers/BasketApi.enhanced'
import { HBForm, HBLoading, openToast, toEnNumConverter } from '@hasty-bazar/core'
import { fontWeights } from '@hasty-bazar/material-provider'
import { ButtonBase, Grid, InputBase, Stack, styled, Typography } from '@mui/material'
import { FC, MouseEvent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import CheckoutPageMessages from '../../CheckoutPage.messages'
import { SectionItemWrapper } from '../../CheckoutPage.style'

interface IPaymentVoucherCode {
  defaultVoucherCode?: string | null
}

type FormInputs = {
  voucherCode: string
}

const ButtonBaseStyle = styled(ButtonBase)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  width: '100%',
  padding: theme.spacing(3),
}))

const PaymentVoucherCode: FC<IPaymentVoucherCode> = ({ defaultVoucherCode }) => {
  const { formatMessage } = useIntl()
  const [addVoucherMutate, { isLoading, isSuccess, data, reset: resetVoucher }] =
    usePutWebSaleBasketVoucherMutation()

  const [deleteVoucherMutate] = useDeleteWebSaleBasketVoucherMutation()
  const {
    control,
    reset,
    register,
    formState: { isSubmitted, isValid, errors },
    handleSubmit,
    getValues,
  } = useForm<FormInputs>({
    defaultValues: { voucherCode: '' },
  })
  const [response, setResponse] = useState<{ status?: 'success' | 'failed'; message?: string }>({})
  const [code, setCode] = useState('')

  const handleDisableInput = () => {
    if (
      (defaultVoucherCode && getValues('voucherCode') === defaultVoucherCode) ||
      (isSubmitted && isValid && response.status == 'success')
    ) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (defaultVoucherCode && defaultVoucherCode.length > 0) {
      reset({ voucherCode: defaultVoucherCode })
      setCode(defaultVoucherCode)
    }
  }, [defaultVoucherCode])

  const submitVoucherCode: SubmitHandler<FormInputs> = ({ voucherCode }) => {
    addVoucherMutate({
      ...ApiConstants,
      assignVoucherToBasketCommandRequest: {
        voucherCode,
      },
    })
      .unwrap()
      .then((payload) => {
        setCode(voucherCode)
        setResponse({
          status: payload.data?.isSuccessful ? 'success' : 'failed',
          message: formatMessage(
            CheckoutPageMessages?.[
              payload.data?.isSuccessful
                ? 'paymentVoucherCodeSuccessMessage'
                : 'paymentVoucherCodeFailedMessage'
            ],
          ),
        })
      })
      .catch((error) => {
        resetVoucher()
        if (error?.status == 400) {
          setResponse({
            status: 'failed',
            message:
              error.data.messages[0].message ??
              formatMessage(CheckoutPageMessages.paymentVoucherCodeFailedMessage),
          })
        } else {
          setResponse({})
        }
      })
  }

  const onError = () => {
    openToast({
      message: formatMessage(CheckoutPageMessages.paymentVoucherCodeEmptyErrorMessage),
      type: 'error',
      vertical: 'top',
    })
  }

  const handleRemoveVoucherCode = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    deleteVoucherMutate({
      ...ApiConstants,
      unAssignVoucherToBasketCommandRequest: {
        voucherCode: code,
      },
    })
      .unwrap()
      .then(() => {
        resetVoucher()
        setResponse({})
      })
      .catch(() => {
        resetVoucher()
      })
    reset({ voucherCode: '' })
  }

  useEffect(() => {
    !getValues('voucherCode') && setResponse({})
  }, [getValues('voucherCode')])

  return (
    <SectionItemWrapper>
      <Stack spacing={4}>
        <Typography variant="h4" color="text.primary">
          <FormattedMessage {...CheckoutPageMessages.voucherSectionTitle} />
        </Typography>
        <HBForm
          mode="all"
          reValidateMode="onChange"
          onSubmit={handleSubmit(submitVoucherCode, onError)}
        >
          <Stack spacing={3}>
            <Grid
              container
              item
              alignItems="baseline"
              justifyContent="space-between"
              xs={12}
              md={7}
              sx={{
                border: ({ palette }) => `1px solid ${palette.grey[300]}`,
                borderRadius: 2,
                pl: 4,
                overflow: 'hidden',
              }}
            >
              <Grid item xs={9.3} sm={10} md={9}>
                <Controller
                  control={control}
                  name="voucherCode"
                  render={() => {
                    return (
                      <InputBase
                        {...register('voucherCode', {
                          required: true,
                          onChange: (e) => {
                            !isSuccess && !code && reset({}, { keepValues: true })
                            return toEnNumConverter(e.target.value)
                          },
                        })}
                        sx={{
                          width: '100%',
                          fontWeight: fontWeights.fontWeightRegular,
                        }}
                        placeholder={formatMessage(
                          CheckoutPageMessages.paymentVoucherCodePlaceholder,
                        )}
                        error={!!errors.voucherCode}
                        disabled={handleDisableInput()}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item xs={2.3} sm={1.5} md={2.5}>
                {(defaultVoucherCode && getValues('voucherCode') === defaultVoucherCode) ||
                (isSubmitted && isValid && response.status == 'success') ? (
                  <ButtonBaseStyle onClick={handleRemoveVoucherCode}>
                    <Typography color="info.main">
                      {formatMessage(CheckoutPageMessages.deleteBtn)}
                    </Typography>
                  </ButtonBaseStyle>
                ) : (
                  <ButtonBaseStyle type="submit" disabled={isLoading}>
                    <Typography color="info.main">
                      {isLoading ? (
                        <HBLoading countCircle={3} />
                      ) : (
                        formatMessage(CheckoutPageMessages.registerBtn)
                      )}
                    </Typography>
                  </ButtonBaseStyle>
                )}
              </Grid>
            </Grid>
            {response.message && (
              <Typography
                variant="body2"
                color={response?.status === 'success' ? 'success.main' : 'error.main'}
              >
                {response.message}
              </Typography>
            )}
          </Stack>
        </HBForm>
      </Stack>
    </SectionItemWrapper>
  )
}

export default PaymentVoucherCode
