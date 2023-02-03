import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { DownloadMethodType } from '@hasty-bazar/admin-shared/containers/HBDataGrid/useDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  GetAllTransactionTypesQueryResult,
  usePostAdminAccountingApiTransactionTypeDownloadExcelFileMutation,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { HBDataGrigToolbar, MenuItemProps } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'

export interface CreateToolbarModel {
  selectedRows: GetAllTransactionTypesQueryResult[]
  handleSetDeleteDialogState: (show: boolean, id?: number) => void
  onGridActionsChange: (value: number | string, type: 'search' | 'status') => void
  onRefreshClick: () => void
  onEdit: (id?: string | number) => void
  gridRef: RefObject<HBDataGridClientRef>
}

const CreateGridToolbar = ({
  selectedRows,
  handleSetDeleteDialogState,
  onGridActionsChange,
  onRefreshClick,
  onEdit,
  gridRef,
  ...otherProps
}: CreateToolbarModel) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const financialEventAdd = () => router.push('/typeOfFinancialEvents/add')

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0

    return { disabledOnSelected, disabledOnNoSelected }
  }, [selectedRows])

  const [downloadFile] = usePostAdminAccountingApiTransactionTypeDownloadExcelFileMutation()

  const handleDownload = async (props: DownloadMethodType) => {
    const { filterFields, ...res } = props
    return await downloadFile({
      'client-name': 'hasty-bazar-admin',
      'client-version': '1.0.0',
      getAllTransactionTypesExcelQueryFilter: {
        ...res,
        ...filterFields,
      },
    })
  }

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    gridRef.current?.downloadGridData({
      downloadFileMethod: handleDownload,
      downloadAll: isDownloadAll,
    })
  }

  const toolbarMoreItems = useMemo<MenuItemProps[]>(() => {
    return [
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'fileDownload',
        onClick: handleDownloadPage,
      },
      {
        label: formatMessage(phrasesMessages.downloadAll),
        icon: 'fileDownloadAlt',
        onClick: () => handleDownloadPage(true),
      },
    ]
  }, [selectedRows])

  return (
    <HBDataGrigToolbar
      statusProps={{ show: false }}
      onChange={onGridActionsChange}
      addProps={{
        disabled: toolbarStatus.disabledOnSelected,
        onClick: financialEventAdd,
      }}
      editProps={{
        disabled: selectedRows.length !== 1,
        onClick: onEdit,
      }}
      deleteProps={{
        disabled: toolbarStatus.disabledOnNoSelected,
        onClick: () => handleSetDeleteDialogState(true),
      }}
      refreshProps={{ onClick: () => onRefreshClick() }}
      items={toolbarMoreItems}
      {...otherProps}
    />
  )
}

export default CreateGridToolbar
