import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogApiAttributeByIdMutation,
  usePostAdminCatalogApiAttributeDownloadExcelFileMutation,
  usePutAdminCatalogApiAttributeByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { downloadExcelUrl, getGridOptions } from '@hasty-bazar/admin-shared/utils/downloadUrl'
import { openToast } from '@hasty-bazar/core'
import { RefObject } from 'react'
import { useIntl } from 'react-intl'
import attributesPageMessages from '../../Attributes.messages'

function useAttributesGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const [deleteAttribute] = useDeleteAdminCatalogApiAttributeByIdMutation()
  const [updateStatus] = usePutAdminCatalogApiAttributeByIdMutation()

  const deleteAttributes = async (ids: string[], callback: () => void) => {
    let responses: any[] = []

    const requests = ids.map((id) => {
      return deleteAttribute({
        'client-name': 'admin',
        'client-version': '1.0.0',
        id,
      }).then((res: any) => res)
    })

    responses = await Promise.all(requests)

    const success = responses.filter((res) => res?.data?.success).length

    if (success > 0) {
      openToast({
        message: formatMessage(attributesPageMessages.attributeDeleteSuccessfully, {
          deleteCount: success,
        }),
        type: 'success',
      })
    }

    callback()
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const changeStatus = async (status: boolean, callback?: () => void) => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const requests = selectedRows.map(({ id, ...rest }) => {
        const { _actions, data, messages, success, ...prev } = rest
        const body = { ...prev, isActive: status }
        return updateStatus({
          'client-name': 'admin',
          'client-version': '1.0.0',
          id,
          updateAttributeModel: {
            ...body,
          },
        }).then((res: any) => res)
      })

      gridLoading(true)
      const responses = await Promise.all(requests)
      const success = responses.filter((res) => res?.data?.success).length
      if (success > 0) {
        openToast({
          message: formatMessage(attributesPageMessages.attributeSuccessChangeStatus, {
            changeCount: success,
          }),
          type: 'success',
        })
      }
      callback?.()
    } catch (e) {
    } finally {
      gridLoading(false)
    }
  }

  const [downloadFile] = usePostAdminCatalogApiAttributeDownloadExcelFileMutation()

  const handleDownloadPage = (isDownloadAll?: boolean) => {
    const { filter, filterFields, headers, pageNumber, pageSize, sortFields } = getGridOptions(
      gridRef,
      isDownloadAll,
    )

    downloadFile({
      'client-name': 'admin',
      'client-version': '1.0.0',
      getAttributesExcelFileQueryFilter: {
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
    const activeCount = selectedRows?.filter((row) => row.isActive)?.length || 0
    const unActiveCount = selectedRows?.filter((row) => !row.isActive)?.length || 0
    const disabledActive = unActiveCount === 0
    const disabledUnActive = activeCount === 0
    const disabledOnNoSelected = selectedRows?.length === 0

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
    if (type === 'status') {
      let filterComponent = gridRef.current!.api.getFilterInstance('isActive')
      filterComponent &&
        filterComponent.setModel({
          type: 'equals',
          filter: value !== -1 ? (value == 1 ? 'true' : 'false') : null,
        })
      gridRef.current!.api.onFilterChanged()
    } else if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Code', operator: 'contains', value: String(value) },
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchAttributes',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchAttributes')
      }
    }
  }

  return {
    deleteAttributes,
    gridLoading,
    changeStatus,
    getToolbarMoreItems,
    handleChangedGridActions,
  }
}

export default useAttributesGrid
