import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  useDeleteAdminCatalogCertificatesByIdMutation,
  usePutAdminCatalogCertificatesByIdMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { openToast } from '@hasty-bazar/core'
import { RefObject, useCallback } from 'react'
import { useIntl } from 'react-intl'
import certificatesMessages from '../certificates.messages'

function useCertificatesGrid(gridRef: RefObject<HBDataGridClientRef>) {
  const { formatMessage } = useIntl()

  const [updateCertificate] = usePutAdminCatalogCertificatesByIdMutation()
  const [deleteCertificate] = useDeleteAdminCatalogCertificatesByIdMutation()

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
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
    ]
  }

  const changeStatus = async (status: boolean, callback?: () => void, certificatesId?: string) => {
    try {
      const selectedRows = gridRef.current!.api.getSelectedRows()
      const requests = selectedRows.map(({ id, ...rest }) => {
        const { _actions, data, messages, success, ...prev } = rest
        const body = { ...prev, isActive: status }
        return updateCertificate({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id,
          updateCertificateModel: { ...body },
        }).then((res: any) => res)
      })

      gridLoading(true)
      const responses = await Promise.all(requests)
      const success = responses.filter((res) => res?.data?.success).length
      if (success > 0) {
        openToast({
          message: formatMessage(certificatesMessages.certificatesSuccessChangeStatus, {
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
          { field: 'Title', operator: 'contains', value: String(value) },
        ]
        gridRef.current!.addFilter({
          id: 'searchCertificate',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef.current!.removeFilter('searchCertificate')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  const handleRemoveCertificate = async (
    bankIds: string[],
    setLoading: (loading: boolean) => void,
    callback: () => void,
  ) => {
    const requests = bankIds.map((id) => {
      return deleteCertificate({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        id,
      }).then((res) => {
        return res
      })
    })
    setLoading(true)
    let responses: any[] = []
    responses = await Promise.all(requests)
    const success = responses.filter((res) => res?.data?.success).length

    if (success > 0) {
      openToast({
        message: formatMessage(certificatesMessages.certificatesDeleteSuccessFully, {
          certificatesCount: success,
        }),
        type: 'success',
      })
    }
    setLoading(false)
    callback()
  }

  return {
    getToolbarMoreItems,
    changeStatus,
    gridLoading,
    handleChangedGridActions,
    refreshGridData,
    handleRemoveCertificate,
  }
}

export default useCertificatesGrid
