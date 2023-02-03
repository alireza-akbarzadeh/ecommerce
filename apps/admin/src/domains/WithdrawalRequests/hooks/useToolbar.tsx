import { useLazyGetAdminPaymentWalletTransactionsQuery } from '@hasty-bazar/admin-shared/services/paymentApi.generated'
import { GridFilterFieldType } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { HBDataGrigToolbar } from '@hasty-bazar/core'
import messages from '../messages/index.messages'
import { GRID_DATA_ID } from '../variables'
import { ToolbarProps } from '../types'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'

function useToolbar(props: ToolbarProps) {
  const { formatMessage } = useIntl()
  const { selectedRows, setIsDownloadExcel, gridRef, oldFilters } = props
  const [getWalletList, walletList] = useLazyGetAdminPaymentWalletTransactionsQuery()

  const handleChangedGridActions = (value: string, type: 'search') => {
    if (value && type === 'search') {
      const searchFields: GridFilterFieldType[] = [
        { field: 'DisplayName', operator: 'contains', value: String(value) },
        { field: 'CellPhoneNumber', operator: 'contains', value: String(value) },
        { field: 'WithdrawAmount', operator: 'contains', value: String(value) },
        { field: 'SystemicDescription', operator: 'contains', value: String(value) },
        { field: 'PaymentReferenceCode', operator: 'contains', value: String(value) },
        { field: 'WithdrawStatus', operator: 'contains', value: String(value) },
      ]

      gridRef.current!.addFilter({
        id: 'searchWalletList',
        fields: searchFields,
        type: 'search',
        addToFilter: true,
      })
    } else {
      gridRef.current!.removeFilter('searchWalletList')
    }
  }

  const handleClickRefresh = () => {
    getWalletList({
      'client-name': 'get-wallet-list',
      'client-version': '1.0.0',
      ...oldFilters.current,
    })
  }

  const gridToolbar = useCallback(
    () => (
      <HBDataGrigToolbar
        onChange={handleChangedGridActions}
        statusProps={{
          show: false,
        }}
        searchProps={{
          show: true,
        }}
        refreshProps={{ onClick: () => handleClickRefresh() }}
        addProps={{
          show: false,
        }}
        editProps={{
          show: false,
        }}
        deleteProps={{
          show: false,
        }}
        items={[
          {
            label: formatMessage(messages.downloadExcel),
            icon: 'fileDownload',
            form: GRID_DATA_ID,
            type: 'submit',
            onClick: () => {
              setIsDownloadExcel(true)
            },
          },
        ]}
        moreProps={{
          show: true,
        }}
      ></HBDataGrigToolbar>
    ),
    [selectedRows.length, walletList.data?.data?.items?.length],
  )

  return { gridToolbar }
}

export default useToolbar
