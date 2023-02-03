import { HBCheckStatus, HBCheckStatusType } from '@hasty-bazar-commerce/components'
import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import {
  GetCostPerInquiryAccountQueryResult,
  useGetWebGeneralDataBankQuery,
} from '@hasty-bazar-commerce/services/generalDataApi.generated'
import { useDeleteWebIdrCustomersByIdBankAccountsAndBankAccountIdMutation } from '@hasty-bazar-commerce/services/idrApi.generated'
import { HBDialog, HBTextField } from '@hasty-bazar/core'
import {
  Avatar,
  InputAdornment,
  inputBaseClasses,
  Radio,
  Skeleton,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import profileMessage from '../../profile.messages'

const AccountRemoveStyle = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.error.main,
}))

interface IBankAccountRowProps {
  type: 'shaba' | 'card'
  status: HBCheckStatusType
  number: string
  accountRemoved: () => void
  checked: boolean
  id: string
  costPerInquiryAccount: GetCostPerInquiryAccountQueryResult
}

const BankAccountRow: FC<IBankAccountRowProps> = (props) => {
  const { formatMessage } = useIntl()
  const { type, status, number, checked, id, accountRemoved, costPerInquiryAccount } = props
  const { data } = useSession()
  const user = data?.user ?? null
  const [cardPrefix, setCardPrefix] = useState('')

  const { data: { data: bankData } = {}, isFetching } = useGetWebGeneralDataBankQuery(
    {
      ...ApiConstants,
      filter: 'CardPrefix==@CardPrefix',
      cardPrefix,
    },
    {
      skip: !cardPrefix,
    },
  )

  const [removeAccountRequest, { isLoading }] =
    useDeleteWebIdrCustomersByIdBankAccountsAndBankAccountIdMutation()
  const [dialog, setDialog] = useState<'default' | 'confirmation' | ''>('')

  const [showedTitle, setShowedTitle] = useState<string>('')

  useEffect(() => {
    if (type === 'card') {
      setShowedTitle(formatMessage(profileMessage.cardNumber))
      setCardPrefix(number?.substring(0, 6))
    } else {
      setShowedTitle(formatMessage(profileMessage.shebaNumber))
      setCardPrefix(number?.substring(0, 5))
    }
  }, [type])

  const removeAccount = () => {
    if (checked) {
      setDialog('default')
    } else {
      setDialog('confirmation')
    }
  }

  const sendRemoveAccountRequest = () => {
    removeAccountRequest({
      ...ApiConstants,
      bankAccountId: id,
      id: user?.partyRoleId! as any,
    })
      .unwrap()
      .then((res) => {
        if (res.success) {
          accountRemoved()
          setDialog('')
        } else {
          setDialog('')
        }
      })
      .catch((err) => {
        setDialog('')
      })
  }

  return (
    <Stack>
      <Stack direction="row" alignItems="flex-start">
        <Stack direction="row" alignItems="center">
          <Radio
            value={id}
            checked={checked}
            sx={{ mr: { xs: 2, sm: 5.5 }, height: 'fit-content' }}
          />
          <Typography sx={{ mr: { xs: 4, sm: 7.5 } }} variant="button" color="grey.700">
            {showedTitle}
          </Typography>
        </Stack>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <HBTextField
            fullWidth
            value={type === 'card' ? number.replace(/\d{4}(?=.)/g, '$&-') : number}
            label={showedTitle}
            InputProps={{
              readOnly: true,
              endAdornment:
                cardPrefix && bankData?.items?.length ? (
                  <InputAdornment position="end">
                    {isFetching ? (
                      <Skeleton variant="circular" width={28} height={28} />
                    ) : (
                      <Avatar
                        sizes="small"
                        src={`${process.env.NEXT_PUBLIC_CDN}/${bankData?.items[0].path}`}
                        alt={bankData?.items[0]?.name || ''}
                        variant="circular"
                        sx={{
                          width: 28,
                          height: 28,
                        }}
                      />
                    )}
                  </InputAdornment>
                ) : (
                  <></>
                ),
            }}
            sx={{
              [`& .${inputBaseClasses.input}`]: {
                direction: 'rtl!important',
              },
            }}
          />
          {user?.partyRoleId && (
            <Stack direction="row" justifyContent="space-between">
              <HBCheckStatus status={status} />
              <AccountRemoveStyle onClick={() => removeAccount()}>
                {formatMessage(profileMessage.delete)} {showedTitle}
              </AccountRemoveStyle>
            </Stack>
          )}
        </Stack>
        {/* comment it till api be ready */}
        {/* <InquiryBankAccount
          showedTitle={showedTitle}
          id={id}
          type={type}
          costPerInquiryAccount={costPerInquiryAccount}
        /> */}
      </Stack>
      <HBDialog
        open={dialog === 'default'}
        onClose={() => setDialog('')}
        acceptBtn={formatMessage(profileMessage.iUnderstood)}
        onAccept={() => setDialog('')}
        title={formatMessage(profileMessage.youCannotDeleteTheDefaultAccount)}
        onReject={() => setDialog('')}
      />

      <HBDialog
        open={dialog === 'confirmation'}
        onClose={() => setDialog('')}
        acceptBtn={formatMessage(profileMessage.yes)}
        rejectBtn={formatMessage(profileMessage.no)}
        onAccept={() => sendRemoveAccountRequest()}
        title={formatMessage(profileMessage.areYouSureToDeleteThisAccount)}
        onReject={() => setDialog('')}
        loading={isLoading}
      />
    </Stack>
  )
}

export default BankAccountRow
