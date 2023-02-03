import { CommerceAccordion } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { BankAccountType } from '@hasty-bazar-commerce/core/enums'
import { useGetWebGeneralDataSystemSettingCostPerInquiryAccountQuery } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import {
  GetBankAccountModel,
  useGetWebIdrCustomersByIdBankAccountsQuery,
  usePutWebIdrCustomersByIdBankAccountsAndBankAccountIdDefaultMutation,
} from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBForm, HBIcon, HBMenu, HBToast } from '@hasty-bazar/core'
import {
  Box,
  Divider,
  Grid,
  popoverClasses,
  RadioGroup,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { BankAccountRadioItem, BankInformationForm } from '.'
import { ShowTostType } from '../../addressManagment/AddressManagment'
import AccountMessages from '../account.messages'
import { IBankAccountType } from './BankInformationForm'

const { log } = console

export interface IBankAccountIformationsForm {
  iban: string
  cardNo: string
}

const DividerStyle = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.grey[200],
}))

export const BANK_ACCOUNT_INFORMATION_ID = 'bank-account-information'
export const ADD_NEW_CARD = 'add-new-card'

const BankAccountIformations = () => {
  const router = useRouter()
  const AddNewCard = router.asPath.includes(ADD_NEW_CARD)

  const isOpen = router.asPath.includes(BANK_ACCOUNT_INFORMATION_ID)
  const [creatingType, setCreatingType] = useState<IBankAccountType | null>(null)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeDefaultBankAccount((event.target as HTMLInputElement).value)
  }
  const [lastActiveId, setLastActiveId] = useState<string>('')
  const [changedActiveId, setChanagedActiveId] = useState<string>('')
  const [showTost, setShowToast] = useState<ShowTostType>({ open: false, message: '' })

  const { data } = useSession()
  const user = data?.user ?? null
  const [openAccordion, setOpenAccordion] = useState<boolean>(false)
  const { formatMessage } = useIntl()
  const { data: bankAccountsData, refetch } = useGetWebIdrCustomersByIdBankAccountsQuery(
    {
      ...ApiConstants,
      id: user?.partyRoleId ?? '',
    },
    { skip: !user?.partyRoleId },
  )

  const { data: costPerInquiryAccountData } =
    useGetWebGeneralDataSystemSettingCostPerInquiryAccountQuery(
      {
        ...ApiConstants,
      },
      { skip: !user?.partyRoleId },
    )

  const [updateBankAccount, { isError: updateError }] =
    usePutWebIdrCustomersByIdBankAccountsAndBankAccountIdDefaultMutation()

  const [billings, setBillings] = useState<GetBankAccountModel[]>([])

  useEffect(() => {
    if (user?.partyRoleId) {
      refetch()
    }
  }, [user])

  useEffect(() => {
    if (bankAccountsData?.data?.items) {
      setBillings(bankAccountsData?.data?.items)
    }
  }, [bankAccountsData])

  useEffect(() => {
    if (AddNewCard) {
      setOpenAccordion(true)
      setCreatingType('card')
    }
  }, [AddNewCard])

  const changeDefaultBankAccount = (id: string) => {
    updateBankAccount({
      ...ApiConstants,
      bankAccountId: id,
      id: user?.partyRoleId ?? '',
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          setLastActiveId(id.toString())
          setShowToast({
            message: formatMessage({ ...AccountMessages.changeDefaultAccounySuccessfulyDone }),
            open: true,
            type: 'success',
          })
        } else {
          setShowToast({
            message: res?.messages?.[0].message || '',
            open: true,
            type: 'error',
          })
        }
      })
    setChanagedActiveId(id)
  }

  useEffect(() => {
    if (updateError) {
      setChanagedActiveId(lastActiveId)
    }
  }, [updateError])

  useEffect(() => {
    const defaultId = billings.find((i) => i.isDefault === true)?.id
    if (defaultId) {
      setLastActiveId(defaultId.toString())
      setChanagedActiveId(defaultId.toString())
    }
  }, [billings])

  const handleRemoveInUi = (id: string) => {
    const temps = billings.filter((i) => i.id !== id)
    setBillings(temps)
  }

  return (
    <Stack sx={{ width: '100%' }} spacing={8}>
      <CommerceAccordion
        summaryButton={
          <HBMenu
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            buttonProps={{
              startIcon: <HBIcon sx={{ lineHeight: 0 }} type="angleDown" />,
              variant: 'contained',
            }}
            menuItemSx={{ minHeight: 30 }}
            menuSx={{ [`& .${popoverClasses.paper}`]: { boxShadow: 'none' } }}
            content={
              <Box id={BANK_ACCOUNT_INFORMATION_ID}>
                <Typography variant="subtitle2">
                  <FormattedMessage {...AccountMessages.add} />
                </Typography>
              </Box>
            }
            menus={[
              {
                content: formatMessage({ ...AccountMessages.cardNumber }),
                onClick: () => {
                  setCreatingType('card')
                  setOpenAccordion(true)
                },
              },
              {
                content: formatMessage({ ...AccountMessages.shabaNumber }),
                onClick: () => {
                  setCreatingType('shaba')
                  setOpenAccordion(true)
                },
              },
            ]}
          />
        }
        summaryTitle={formatMessage({ ...AccountMessages.bankAccount })}
        open={openAccordion || isOpen}
        onCLose={() => setOpenAccordion(false)}
      >
        <Stack spacing={6}>
          {!!creatingType && (
            <HBForm<IBankAccountIformationsForm>
              onSubmit={(value) => log(value)}
              defaultValues={{ cardNo: '', iban: '' }}
              mode="all"
            >
              <BankInformationForm
                type={creatingType}
                disableAdding={() => setCreatingType(null)}
                newAccountAdded={() => refetch()}
                costPerInquiryAccount={costPerInquiryAccountData?.data!}
                bankAccountNumber={billings.length || 0}
              />
            </HBForm>
          )}
          <Stack>
            <RadioGroup value={changedActiveId} onChange={handleChange}>
              <Grid container rowSpacing={6}>
                {billings.map((data, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} lg={8}>
                      <BankAccountRadioItem
                        id={data.id!}
                        checked={changedActiveId === data.id?.toString()}
                        accountRemoved={() => handleRemoveInUi(data.id!)}
                        number={data.cardNumber ? data.cardNumber! : data.iban!}
                        status={
                          data.cardNumberStateCode === BankAccountType.verified ||
                          data.ibanStateCode === BankAccountType.verified
                            ? 'accepted'
                            : 'rejected'
                        }
                        type={data.cardNumber ? 'card' : 'shaba'}
                        costPerInquiryAccount={costPerInquiryAccountData?.data!}
                      />
                    </Grid>
                    {index !== billings.length - 1 && (
                      <Grid item xs={12}>
                        <DividerStyle />
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
              </Grid>
            </RadioGroup>
          </Stack>
        </Stack>
      </CommerceAccordion>
      <HBToast
        open={showTost.open}
        message={showTost.message}
        type={showTost?.type || 'error'}
        vertical="top"
        autoHideDuration={6000}
        onClose={() => setShowToast({ open: false, message: '', type: showTost?.type })}
      />
    </Stack>
  )
}

export default BankAccountIformations
