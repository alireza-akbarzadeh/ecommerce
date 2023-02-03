import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { UserFinancialInformationFormType } from '@hasty-bazar-admin/domains/Users/components/UserFormFinancialInfo'
import userPageMessages from '@hasty-bazar-admin/domains/Users/UserPage.messages'
import {
  usePostAdminIdrRolesByIdBankAccountMutation,
  usePostAdminIdrRolesCopyBankAccountMutation,
  usePutAdminIdrRolesByIdBankAccountAndBankAccountIdMutation,
} from '@hasty-bazar/admin-shared/services/idrApi.generated'
import { openToast } from '@hasty-bazar/core'
import { useTheme } from '@mui/material'
import { RefObject, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'

interface IFinancialForm {
  setStepDialog: (val: null) => void
  gridRef: RefObject<HBDataGridClientRef>
  refetch: () => void
}

function useUserFinancialFormController({ setStepDialog, gridRef, refetch }: IFinancialForm) {
  const [typeCart, setTypeCart] = useState<string>('cardNo')
  const { formatMessage } = useIntl()
  const { spacing, palette } = useTheme()

  const [postIdrRolesByIdBankAccount, { isLoading: createLoading }] =
    usePostAdminIdrRolesByIdBankAccountMutation()
  const [putIdrRolesByIdBankAccountAndBankAccountId, { isLoading: updateLoading }] =
    usePutAdminIdrRolesByIdBankAccountAndBankAccountIdMutation()
  const [postIdrRolesCopyBankAccount, { isSuccess: copyIsSuccess, isLoading: copyLoading }] =
    usePostAdminIdrRolesCopyBankAccountMutation()

  const gridRowsData = gridRef?.current?.api?.getSelectedRows()

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  function createFinancialInfo(data: UserFinancialInformationFormType, role: string) {
    if (gridRowsData) {
      postIdrRolesByIdBankAccount({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: role ? role : gridRowsData[0]?.partyRoleId,
        addPartyRoleAddBankAccountsModel: { ...data, isActive: true },
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(userPageMessages.statusMsg, {
              msg: formatMessage(userPageMessages.create),
            }),
            type: 'success',
          })
          setStepDialog(null)
          refreshGridData()
        }
      })
    }
  }

  function editFinancialInfo(data: UserFinancialInformationFormType, role: string) {
    if (gridRowsData) {
      putIdrRolesByIdBankAccountAndBankAccountId({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        id: role ? role : gridRowsData[0]?.partyRoleId,
        bankAccountId: gridRowsData[0]?.id,
        updatePartyRoleBankAccountModel: data,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(userPageMessages.statusMsg, {
              msg: formatMessage(userPageMessages.edit),
            }),
            type: 'success',
          })
          setStepDialog(null)
          refreshGridData()
        }
      })
    }
  }

  function copyFinancialInfo(role: string) {
    if (gridRowsData) {
      let copyAddress = {
        fromPartyRoleId: gridRowsData[0]?.partyRoleId,
        toPartyRoleId: role,
        bankAccountId: gridRowsData[0]?.id,
      }
      postIdrRolesCopyBankAccount({
        'client-name': 'Swagger on HIT.Hastim.Catalog.Endpoints.WebApi',
        'client-version': '1.0.1.100',
        addCopyBankAccountModel: copyAddress,
      }).then((res: any) => {
        if (res?.data?.success) {
          openToast({
            message: formatMessage(userPageMessages.statusMsg, {
              msg: formatMessage(userPageMessages.copyNoun),
            }),
            type: 'success',
          })
          refreshGridData()
        }
      })
    }
  }

  if (copyIsSuccess) {
    setStepDialog(null)
  }

  return {
    createFinancialInfo,
    editFinancialInfo,
    copyFinancialInfo,
    spacing,
    formatMessage,
    palette,
    typeCart,
    setTypeCart,
    updateLoading,
    createLoading,
    copyLoading,
  }
}

export default useUserFinancialFormController
