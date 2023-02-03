import { ApiConstants } from '@hasty-bazar-commerce/core/constants'
import { GetCostPerInquiryAccountQueryResult } from '@hasty-bazar-commerce/services/generalDataApi.generated'
import {
  useGetWebIdrCustomersByIdIndividualQuery,
  usePostWebIdrChangeStateMutation,
} from '@hasty-bazar-commerce/services/idrApi.generated'
import { useGetWebPaymentWalletBalanceQuery } from '@hasty-bazar-commerce/services/paymentApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { Box, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import profileMessage from '../../profile.messages'

interface IInquiryBankAccount {
  showedTitle: string
  id: string
  type: string
  costPerInquiryAccount: GetCostPerInquiryAccountQueryResult
}

const InquiryBankAccount: FC<IInquiryBankAccount> = ({
  showedTitle,
  id,
  type,
  costPerInquiryAccount,
}) => {
  const { formatMessage } = useIntl()
  const [dialog, setDialog] = useState<'default' | 'confirmation' | ''>('')
  const [toastDialog, setToastDialog] = useState<string>('')
  const [dialogType, setDialogType] = useState<'haveInventory' | 'chargeWallet' | ''>('')
  const { data } = useSession()

  const user = data?.user ?? null
  const { data: individualData } = useGetWebIdrCustomersByIdIndividualQuery({
    ...ApiConstants,
    id: user?.partyRoleId!,
  })

  const [checkBankAccountValidation] = usePostWebIdrChangeStateMutation()

  const { data: walletData } = useGetWebPaymentWalletBalanceQuery(
    {
      ...ApiConstants,
    },
    { skip: !user },
  )

  const onInquiry = () => {
    if (individualData?.data?.nationalCodeStateCode === '1') {
      // nationalCode is confirmed
      checkInvenory()
    } else {
      // nationalCode is not confirmed
      setDialog('default')
      setToastDialog(formatMessage(profileMessage.nationalCodeIsNotConfirmed))
    }
  }

  const checkInvenory = () => {
    if (walletData?.data?.value) {
      // we have inventory
      setDialog('confirmation')
      setDialogType('haveInventory')
      setToastDialog(
        formatMessage(profileMessage.getAmountForInquiryBankAccount, {
          cost: costPerInquiryAccount?.amount?.toLocaleString(),
          currency: costPerInquiryAccount?.currencyTitle,
        }),
      )
    } else {
      // we do not have inventory
      setDialog('confirmation')
      setDialogType('chargeWallet')
      setToastDialog(formatMessage(profileMessage.yourInventoryIsNotEnoughChargeYourWallet))
    }
  }

  const onGetInquiry = () => {
    // TODO_ROXANA: call inquiry bank account Api
    checkBankAccountValidation({
      ...ApiConstants,
      stateMachineModel: {
        entityId: id,
        stateMachineCode: type === 'card' ? '45' : '46',
        factor: '1',
        nextStateId: '1',
        reason: '',
        comment: '',
      },
    })
  }

  const onAcceptDialog = () => {
    switch (dialogType) {
      case 'haveInventory':
        setToastDialog('')
        setDialog('')
        onGetInquiry()
        break

      case 'chargeWallet':
        setToastDialog('')
        setDialog('')
        // TODO_ROXANA: go to charge your wallet
        break

      default:
        break
    }
  }

  return (
    <>
      <Box onClick={() => onInquiry()}>
        <Typography
          sx={{ ml: 4, pt: 2.5, cursor: 'pointer' }}
          variant="subtitle2"
          color="info.main"
        >
          {formatMessage(profileMessage.inquiry)} {showedTitle}
        </Typography>
      </Box>

      <HBDialog
        open={dialog === 'default'}
        onClose={() => setDialog('')}
        acceptBtn={formatMessage(profileMessage.iUnderstood)}
        onAccept={() => setDialog('')}
        title={toastDialog}
        onReject={() => setDialog('')}
      />

      <HBDialog
        open={dialog === 'confirmation'}
        onClose={() => setDialog('')}
        acceptBtn={formatMessage(profileMessage.yes)}
        rejectBtn={formatMessage(profileMessage.no)}
        onAccept={() => onAcceptDialog()}
        title={toastDialog}
        onReject={() => setDialog('')}
      />
    </>
  )
}

export default InquiryBankAccount
