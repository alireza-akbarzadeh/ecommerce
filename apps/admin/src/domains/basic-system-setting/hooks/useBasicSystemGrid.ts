import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  usePostAdminGeneralDataSystemSettingDownloadExcelFileMutation,
  usePostAdminGeneralDataSystemSettingRealodDistributedOptionsMutation,
  usePutAdminGeneralDataSystemSettingByIdMutation,
} from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { errorsToString } from '@hasty-bazar/admin-shared/utils'
import { downloadExcelUrl, getGridOptions } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { openToast } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
} from 'ag-grid-community'
import { RefObject } from 'react'
import { useIntl } from 'react-intl'
import basicSystemSettingMessages from '../BasicSystemSetting.messages'

function useSystemSettingGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const [reloadSettings] = usePostAdminGeneralDataSystemSettingRealodDistributedOptionsMutation()

  const [updateStatus] = usePutAdminGeneralDataSystemSettingByIdMutation()
  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }
  const changeStatus = async (status: boolean, callback?: () => void) => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const requests = selectedRows.map(({ id, ...rest }) => {
        const { _actions, data, messages, success, ...prev } = rest
        return updateStatus({
          'client-name': 'admin',
          'client-version': '1.0.0',
          id,
          updateSystemSettingModel: {
            ...prev,
            isActive: status,
          },
        }).then((res: any) => res)
      })

      gridLoading(true)
      const responses = await Promise.all(requests)
      const error = responses.filter((res) => !res?.data?.success).length
      const success = responses.filter((res) => res?.data?.success).length

      if (error > 0) {
        openToast({
          message: formatMessage(basicSystemSettingMessages.errorChangeStatus, {
            changeCount: error,
          }),
          type: 'error',
        })
      }
      if (success > 0) {
        openToast({
          message: formatMessage(basicSystemSettingMessages.successChangeStatus, {
            changeCount: success,
          }),
          type: 'success',
        })
      }
      gridLoading(false)
      callback?.()
    } catch (e) {
      gridLoading(false)
      openToast({
        message: errorsToString(e) || formatMessage(basicSystemSettingMessages.errorChangeStatus),
        type: 'error',
      })
    }
  }

  const [downloadFile] = usePostAdminGeneralDataSystemSettingDownloadExcelFileMutation()

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    const { filter, filterFields, headers, pageNumber, pageSize, sortFields } = getGridOptions(
      gridRef,
      isDownloadAll,
    )

    downloadFile({
      'client-name': 'admin',
      'client-version': '1.0.0',
      getSystemSettingsExcelFileQueryFilter: {
        pageNumber,
        pageSize,
        headers,
        filter: filter ? filter : undefined,
        ordering: sortFields ? sortFields : undefined,
        ...filterFields,
      },
    }).then((res: any) => {
      if (res?.data?.success) {
        const url = res.data.data.excelFile
        downloadExcelUrl(url)
      }
    })
  }

  const getToolbarMoreItems = (handleChangeStatus: (status: boolean) => void) => {
    const selectedRows = gridRef.current?.api?.getSelectedRows()!
    const disabledOnNoSelected = selectedRows?.length === 0

    return [
      {
        label: formatMessage(phrasesMessages.reloadSetting),
        icon: 'refresh',
        disabled: false,
        onClick: () => {
          reloadSettings({
            'client-name': 'admin',
            'client-version': '1.0.0',
          }).then((res: any) => {
            openToast({
              message: formatMessage(basicSystemSettingMessages.successReloadSetting),
              type: 'success',
            })
          })
        },
      },
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
  }
  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', value: String(value), operator: 'contains' },
          { field: 'Category', value: String(value), operator: 'contains' },
          { field: 'Description', value: String(value), operator: 'contains' },
        ]
        gridRef.current!.addFilter({
          id: 'searchBasicSystemSetting',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchBasicSystemSetting')
      }
    } else if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value ? 'true' : 'false') : null,
        })
    }
    gridRef.current!.api.onFilterChanged()
  }

  return {
    gridLoading,
    changeStatus,
    getToolbarMoreItems,
    handleChangedGridActions,
    checkboxSelection,
    headerCheckboxSelection,
  }
}
export default useSystemSettingGrid
