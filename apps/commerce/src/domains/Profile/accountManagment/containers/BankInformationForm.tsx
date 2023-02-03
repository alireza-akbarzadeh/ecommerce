import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetBanksQueryResult,
  GetCostPerInquiryAccountQueryResult,
  useGetWebGeneralDataBankQuery,
  useGetWebGeneralDataSystemSettingMaxNumberAccountCustomerQuery,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { usePostWebIdrCustomersByIdBankAccountsMutation } from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBTextFieldController } from '@hasty-bazar/auth'
import { HBButton, HBIcon, HBToast } from '@hasty-bazar/core'
import {
  Avatar,
  formHelperTextClasses,
  Grid,
  InputAdornment,
  inputAdornmentClasses,
  inputBaseClasses,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { ShowTostType } from '../../addressManagment/AddressManagment'
import profileMessage from '../../profile.messages'
import { ADD_NEW_CARD } from './BankAccountIformations'

export type IBankAccountType = 'shaba' | 'card'

interface IForm {
  iban: string
  cardNo: string
}

const HelperText: React.FC<{ costData: GetCostPerInquiryAccountQueryResult }> = ({ costData }) => {
  const { formatMessage } = useIntl()
  return (
    <Stack>
      <Typography color="text.secondary" variant="button" textAlign="justify" lineHeight={1.5}>
        {formatMessage(profileMessage.userAccountNameAndAccountOwnerNameMustBeSame)}
        {formatMessage(
          profileMessage.toActivateEachBankCartfiveThousandRialWillBeDeductedFromYourAccount,
          {
            cost: costData?.amount?.toLocaleString(),
            currency: costData?.currencyTitle,
          },
        )}
      </Typography>
    </Stack>
  )
}
const ButtonStyle = styled(HBButton)(({ theme }) => ({
  width: 56,
  minWidth: 56,
  height: 40,
}))

interface IBankInformationFormProps {
  type: IBankAccountType
  disableAdding: () => void
  newAccountAdded: () => void
  costPerInquiryAccount: GetCostPerInquiryAccountQueryResult
  bankAccountNumber: number
}

const BankInformationForm: FC<IBankInformationFormProps> = (props) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const addNewCard = router.asPath.includes(ADD_NEW_CARD)
  const cardInputRef = useRef<HTMLInputElement>(null)
  const { type, disableAdding, newAccountAdded, costPerInquiryAccount, bankAccountNumber } = props
  const {
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useFormContext<IForm>()

  const { data } = useSession()
  const user = data?.user ?? null
  const [cardPrefix, setCardPrefix] = useState('')

  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })
  const [bankDataState, setBankDataState] = useState<GetBanksQueryResult | null>(null)

  const { data: { data: bankData } = {}, isFetching } = useGetWebGeneralDataBankQuery({
    ...ApiConstants,
    filter: type === 'card' ? 'CardPrefix==@CardPrefix' : 'Iban==@Iban',
    ...(type === 'card' && { cardPrefix }),
    ...(type === 'shaba' && { iban: cardPrefix }),
  })

  const { data: maxNumberAccountData } =
    useGetWebGeneralDataSystemSettingMaxNumberAccountCustomerQuery(
      {
        ...ApiConstants,
      },
      { skip: !user?.partyRoleId },
    )

  const formValues: IForm = {
    cardNo: watch('cardNo'),
    iban: watch('iban'),
  }

  useEffect(() => {
    reset()
    resetBankData()
  }, [type])

  useEffect(() => {
    if (bankData?.items?.[0]) {
      setBankDataState(bankData.items[0])
    } else {
      setBankDataState(null)
    }
  }, [bankData])

  useEffect(() => {
    if (addNewCard) {
      cardInputRef.current?.focus()
    }
  }, [addNewCard])

  const [createBankAccountRequest, { isLoading, data: createdBankAccount, error }] =
    usePostWebIdrCustomersByIdBankAccountsMutation()

  const createBankAccount = () => {
    if (!bankDataState?.latinSummaryName) return
    const cardNo = formValues.cardNo.replace(/\s/g, '')
    const iban = formValues.iban ? `IR${formValues.iban.replace(/\s/g, '')}` : ''
    if (bankAccountNumber < +maxNumberAccountData?.data?.value! || 0) {
      createBankAccountRequest({
        ...ApiConstants,
        addBankAccountModel: {
          cardNo,
          iban,
          latinSummaryName: bankDataState?.latinSummaryName,
        },
        id: user?.partyRoleId!,
      })
        .unwrap()
        .then((res) => {
          if (!res.success) {
            setShowToast({ message: res?.messages?.[0].message || '', open: true, type: 'error' })
          } else {
            setShowToast({
              message: formatMessage(profileMessage.accountAddedSuccessfully),
              open: true,
              type: 'success',
            })
          }
        })
        .finally(() => {
          setBankDataState(null)
        })
    } else {
      setShowToast({
        message: formatMessage(profileMessage.maxNumberAccount, {
          number: maxNumberAccountData?.data?.value,
        }),
        open: true,
        type: 'error',
      })
    }
  }

  useEffect(() => {
    if (createdBankAccount?.success) {
      newAccountAdded()
      setValue('cardNo', '')
      setValue('iban', '')
    }
  }, [createdBankAccount])

  useEffect(() => {
    setValue('cardNo', '')
    setValue('iban', '')
  }, [error])

  const resetBankData = () => {
    setCardPrefix('')
    setBankDataState(null)
  }

  useEffect(() => {
    if (watch('cardNo')) {
      if (watch('cardNo').replace(/\s/g, '')?.length >= 6) {
        setCardPrefix(watch('cardNo').replace(/\s/g, '').substring(0, 6) || '')
      } else if (watch('cardNo').replace(/\s/g, '')?.length! < 6) {
        resetBankData()
      }
    }
  }, [watch('cardNo')])

  useEffect(() => {
    if (watch('iban')) {
      if (watch('iban').replace(/\s/g, '')?.length >= 5) {
        setCardPrefix(watch('iban').replace(/\s/g, '').substring(0, 5) || '')
      } else if (watch('iban').replace(/\s/g, '')?.length! < 5) {
        resetBankData()
      }
    }
  }, [watch('iban')])

  return (
    <Grid container rowSpacing={6} columnSpacing={4}>
      <Grid item xs={12} lg={8}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={9} md={9} lg={9}>
            {type === 'card' && (
              <HBTextFieldController
                sx={{
                  [`& .${inputBaseClasses.input}`]: {
                    direction: 'rtl!important',
                  },
                  [`& .${formHelperTextClasses.root}`]: {
                    marginRight: 0,
                    marginLeft: 0,
                    '& span': { marginRight: 0, textAlign: 'justify' },
                  },
                  [`& .${formHelperTextClasses.root}`]: {
                    marginLeft: 0,
                    '& div': {
                      alignItems: 'flex-start',
                      '& i': {
                        marginTop: (theme) => theme.spacing(1.5),
                        color: (theme) => theme.palette.text.secondary,
                      },
                    },
                  },
                }}
                inputRef={cardInputRef}
                helperText={<HelperText costData={costPerInquiryAccount} />}
                name="cardNo"
                label={formatMessage(profileMessage.cardNumber)}
                mask="0000\ \ \ 0000\ \ \ 0000\ \ \ 0000"
                type="number"
                formRules={{ required: true, pattern: /^.{25,25}$/ }}
                InputProps={{
                  endAdornment:
                    cardPrefix && !!bankDataState ? (
                      <InputAdornment position="end">
                        {isFetching ? (
                          <Skeleton variant="circular" width={28} height={28} />
                        ) : (
                          <Avatar
                            sizes="small"
                            src={`${process.env.NEXT_PUBLIC_CDN}/${bankDataState.path}`}
                            alt={bankDataState.name || ''}
                            variant="circular"
                            sx={{
                              width: 28,
                              height: 28,
                            }}
                          />
                        )}
                      </InputAdornment>
                    ) : null,
                }}
              />
            )}
            {type === 'shaba' && (
              <HBTextFieldController
                helperText={<HelperText costData={costPerInquiryAccount} />}
                name="iban"
                label={formatMessage(profileMessage.shebaNumber)}
                formRules={{ required: true, pattern: new RegExp(/^(?=.{24}$)[0-9]*$/, 'ig') }}
                mask="000000000000000000000000"
                type="number"
                sx={{
                  '& input': { direction: 'rtl' },
                  [`& .${inputAdornmentClasses.root}`]: {
                    marginLeft: 0,
                  },
                  [`& .${formHelperTextClasses.root}`]: {
                    marginRight: 0,
                    marginLeft: 0,
                    '& span': { marginRight: 0, textAlign: 'justify' },
                  },
                }}
                InputProps={{
                  endAdornment:
                    cardPrefix && !!bankDataState ? (
                      <InputAdornment position="end">
                        {isFetching ? (
                          <Skeleton variant="circular" width={28} height={28} />
                        ) : (
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography>IR</Typography>
                            <Avatar
                              sizes="small"
                              src={`${process.env.NEXT_PUBLIC_CDN}/${bankDataState.path}`}
                              alt={bankDataState.name || ''}
                              variant="circular"
                              sx={{
                                width: 28,
                                height: 28,
                              }}
                            />
                          </Stack>
                        )}
                      </InputAdornment>
                    ) : (
                      <>IR</>
                    ),
                }}
              />
            )}
          </Grid>

          <Grid container item xs={12} sm={3} md={3} lg={3}>
            <Stack direction="row" spacing={2}>
              <ButtonStyle
                disabled={
                  !isValid ||
                  !!errors.cardNo?.type ||
                  !!errors.iban?.type ||
                  !bankDataState?.latinSummaryName
                }
                loading={isLoading}
                variant="contained"
                onClick={(e) => createBankAccount()}
              >
                <HBIcon type="check" sx={{ color: 'secondary.main', lineHeight: 0 }} />
              </ButtonStyle>
              <ButtonStyle onClick={disableAdding} variant="outlined">
                <HBIcon size="small" type="multiply" sx={{ color: 'grey.700', lineHeight: 0 }} />
              </ButtonStyle>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        vertical="top"
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </Grid>
  )
}

export default BankInformationForm
