import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { usePutAdminIdrRolesByIdBankAccountAndBankAccountIdActiveBankAccountMutation } from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { HBIcon, HBSwitch, openToast } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'
import React from 'react'
import { useIntl } from 'react-intl'

interface IStatusFinancial extends ICellRendererParams {
  typeComponent: string
}

const StatusFinancial = (props: IStatusFinancial) => {
  const { formatMessage } = useIntl()

  const [putIdrRolesByIdBankAccountAndBankAccountIdActiveBankAccount] =
    usePutAdminIdrRolesByIdBankAccountAndBankAccountIdActiveBankAccountMutation()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    putIdrRolesByIdBankAccountAndBankAccountIdActiveBankAccount({
      'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
      'client-version': '1.0.1.100',
      id: props?.data?.partyRoleId,
      bankAccountId: props?.data?.id,
      activePartyRoleBankAccountModel: { isActive: event.target.checked },
    }).then((res: any) => {
      if (res?.data?.success) {
        openToast({
          message: formatMessage(phrasesMessages.successUpdate),
          type: 'success',
        })
      }
    })
  }

  const { isDefault, isActive } = props?.data
  return props.typeComponent === 'status' ? (
    <HBSwitch defaultChecked={isActive} onChange={handleChange} />
  ) : (
    <HBIcon
      type={isDefault ? 'check' : 'timesCircle'}
      sx={{ color: isDefault ? 'secondary.main' : 'error.main' }}
    />
  )
}

export default StatusFinancial
