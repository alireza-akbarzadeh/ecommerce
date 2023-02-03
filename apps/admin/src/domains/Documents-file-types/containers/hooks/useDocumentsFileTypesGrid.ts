import { Status } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  useDeleteAdminCmsFileTypesByIdMutation,
  usePutAdminCmsFileTypesByIdMutation,
} from '@hasty-bazar/admin-shared/services/cmsApi.generated'
import { MenuItemProps } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject } from 'react'
import { useIntl } from 'react-intl'
import documentsPageMessages from '../../Documents-File-Types.messages'

function useDocumentsAttributesGrid(gridRef: RefObject<AgGridReact>) {
  const [deleteFile] = useDeleteAdminCmsFileTypesByIdMutation()
  const [updateFile] = usePutAdminCmsFileTypesByIdMutation()
  const { showToast } = useToast()
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleRemoveFile = async (userIds: string[], callback: () => void) => {
    const requests = userIds.map((id) => {
      return deleteFile({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
      }).then((res) => res)
    })

    gridLoading(true)
    let responses: any[] = []
    responses = await Promise.all(requests)
    const failed = responses.filter((res) => !res?.data?.success).length
    const success = responses.filter((res) => res?.data?.success).length

    if (failed > 0) {
      showToast(formatMessage(documentsPageMessages.deleteFailed, { fileCount: failed }), 'error')
    }
    if (success > 0) {
      showToast(
        formatMessage(documentsPageMessages.deleteSuccessFully, { fileCount: success }),
        'success',
      )
    }
    gridLoading(false)
    callback()
  }

  const documentGridColumns = () => {
    return [
      {
        field: 'id',
        headerName: formatMessage(phrasesMessages.id),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        cellRenderer: (params: ICellRendererParams) => params.value,
        hide: true,
      },
      {
        field: 'name',
        headerName: formatMessage(documentsPageMessages.gridFieldName),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'type',
        headerName: formatMessage(documentsPageMessages.gridFieldType),
        filter: 'agTextColumnFilter',
      },
      {
        field: 'isActive',
        headerName: formatMessage(documentsPageMessages.formItemIsActive),
        filter: 'agTextColumnFilter',
        maxWidth: 200,
        cellRenderer: Status,
        cellRendererParams: {
          active: formatMessage(phrasesMessages.active),
          inActive: formatMessage(phrasesMessages.deActive),
        },
      },
    ]
  }

  const documentGridToolbarMenu = ({
    disabledOnNoSelected,
    disabledActive,
    disabledUnActive,
    handleChangeStatus,
  }: {
    disabledOnNoSelected: boolean
    disabledActive: boolean
    disabledUnActive: boolean
    handleChangeStatus: (status: boolean) => void
  }): MenuItemProps[] => {
    return [
      {
        label: formatMessage(phrasesMessages.active),
        icon: 'toggleOn',
        disabled: disabledOnNoSelected || disabledActive,
        onClick: () => handleChangeStatus(true),
        show: !disabledActive,
      },
      {
        label: formatMessage(phrasesMessages.deActive),
        icon: 'toggleOff',
        disabled: disabledOnNoSelected || disabledUnActive,
        onClick: () => handleChangeStatus(false),
        show: !disabledUnActive,
      },
      {
        label: formatMessage(phrasesMessages.download),
        icon: 'arrowDown',
        disabled: disabledOnNoSelected,
      },
    ]
  }

  const changeActive = async (status: boolean, callback: () => void) => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const requests = selectedRows.map((row) => {
        return updateFile({
          'client-name': 'admin',
          'client-version': '1.0.0',
          id: row.id,
          updateFileTypeModel: {
            ...row,
            isActive: status,
          },
        }).then((res) => res)
      })

      gridLoading(true)
      let responses: any[] = []
      responses = await Promise.all(requests)
      const failed = responses.filter((res) => !res?.data?.success).length
      const success = responses.filter((res) => res?.data?.success).length

      if (failed > 0) {
        showToast(formatMessage(documentsPageMessages.changeFailed, { fileCount: failed }), 'error')
      }
      if (success > 0) {
        showToast(
          formatMessage(documentsPageMessages.changeSuccessFully, { fileCount: success }),
          'success',
        )
      }
      gridLoading(false)
      callback()
    } catch (e) {}
  }

  return {
    handleRemoveFile,
    checkboxSelection,
    headerCheckboxSelection,
    documentGridColumns,
    documentGridToolbarMenu,
    gridLoading,
    changeActive,
  }
}

export default useDocumentsAttributesGrid
