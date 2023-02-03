import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { PlatformState } from '@hasty-bazar/admin-shared/core/enums'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { HBDataGrigToolbar } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import useExcelDownload from '../hooks/useExcelDownload'
import PlatformCarrierAgrrementsMessages from '../PlatformCarrierAgreementSettings.message'
import { SelectRowModel } from '../types'

export interface CreateToolbarModel {
  selectedRows: SelectRowModel[]
  handleSetDeleteDialogState: (show: boolean) => void
  onChangedGridActions: (value: number | string, type: 'search' | 'status') => void
  gridRef: RefObject<HBDataGridClientRef>
  onEdit: (id: string) => void
  refreshGridData: (isClearSearch?: boolean) => void
}

const CreateGridToolbar = ({
  selectedRows,
  handleSetDeleteDialogState,
  onChangedGridActions,
  gridRef,
  onEdit,
  refreshGridData,
  ...otherProps
}: CreateToolbarModel) => {
  const router = useRouter()
  const { toolbarMoreItems } = useExcelDownload({ gridRef, selectedRows })
  const { showToast } = useToast()
  const { formatMessage } = useIntl()

  const toolbarStatus = useMemo(() => {
    const disabledOnSelected = selectedRows.length > 0
    const disabledOnNoSelected = selectedRows.length === 0
    return {
      disabledOnSelected,
      disabledOnNoSelected,
    }
  }, [selectedRows])

  const onAdd = () => router.push('/PlatformCarrierAgreementSettings/add')

  return (
    <HBDataGrigToolbar
      onChange={onChangedGridActions}
      addProps={{
        disabled: toolbarStatus.disabledOnSelected,
        onClick: onAdd,
      }}
      statusProps={{ show: false }}
      editProps={{
        disabled: selectedRows.length !== 1,
        onClick: () => onEdit(selectedRows[0].id),
      }}
      deleteProps={{
        disabled: toolbarStatus.disabledOnNoSelected,
        onClick: () => {
          if (
            selectedRows.filter((row) => row.contractStateCode !== PlatformState.Draft).length > 0
          ) {
            showToast(
              formatMessage(
                PlatformCarrierAgrrementsMessages.someSelectedRecordsCannotBeDeletedAccordingToTheState,
              ),
              'error',
            )
            return
          }
          handleSetDeleteDialogState(true)
        },
      }}
      refreshProps={{ onClick: () => refreshGridData(true) }}
      items={toolbarMoreItems}
      {...otherProps}
    />
  )
}

export default CreateGridToolbar
