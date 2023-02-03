import HBDataGridClient, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { useDeleteAdminSaleApiPlatformShippingContractMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { ColDef } from 'ag-grid-community'
import { useRouter } from 'next/dist/client/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import CreateGridToolbar from './components/CreateGridToolbar'
import PlatformDetailsGrid from './components/PlatformDetailsGrid/index'
import { breadcrumbsItems, classes } from './gridConfig'
import useColumnDefs from './hooks/usePlatformCarrierAgreementSettingsColumnDefs'
import PlatformCarrierAgrrementsMessages from './PlatformCarrierAgreementSettings.message'
import { SelectRowModel } from './types'

const PlatformCarrierAgreementSettingsPage = () => {
  const [deletePlatformShippingAgreement] = useDeleteAdminSaleApiPlatformShippingContractMutation()
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Sale/api/PlatformShippingContract`
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { showToast } = useToast()
  const [selectedRows, setSelectedRows] = useState<SelectRowModel[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: string }>({
    show: false,
  })
  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const refreshGridData = (isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }

  const onDelete = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows.map((row) => row.id)

      gridLoading(true)

      deletePlatformShippingAgreement({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        body: ids,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(PlatformCarrierAgrrementsMessages.successDelete), 'success')
          refreshGridData()
        }
        setDeleteDialogState({ show: false, id: undefined })
        gridLoading(false)
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const onEdit = (id?: string) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/PlatformCarrierAgreementSettings/edit/${id}`)
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const onSelectRows = (selectedRows: SelectRowModel[]) => {
    setSelectedRows(selectedRows)
  }

  const onChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Code', operator: 'contains', value: String(value) },
        ]
        gridRef?.current!.addFilter({
          id: 'searchPlatformCarrierAgreement',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef?.current!.removeFilter('searchPlatformCarrierAgreement')
      }
    }
  }

  const { columnDefs } = useColumnDefs({
    gridRef,
    onDelete: (id: string) => setDeleteDialogState({ show: true, id }),
    onEdit: (id: string) => onEdit(id),
    refreshGridData,
  })

  return (
    <>
      <HBDataGridClient
        {...{
          actionUrl,
          classes,
          columnDefs,
          autoGroupColumnDef,
        }}
        editUrl={'/PlatformCarrierAgreementSettings/edit/'}
        rowSelection="multiple"
        pagination
        paginationPageSize={25}
        enableRtl
        sideBar
        onSelectedChanged={onSelectRows}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(PlatformCarrierAgrrementsMessages.platformCarrierAgreement)}
            breadItems={breadcrumbsItems(formatMessage)}
          />
        }
        masterDetail
        detailCellRenderer={PlatformDetailsGrid}
        detailCellRendererParams={{
          title: formatMessage(PlatformCarrierAgrrementsMessages.showMore),
        }}
        detailRowAutoHeight
        ref={gridRef}
        GridToolbar={(props) => (
          <CreateGridToolbar
            handleSetDeleteDialogState={(show: boolean) => setDeleteDialogState({ show })}
            {...{ onChangedGridActions, onEdit, refreshGridData, selectedRows, gridRef }}
            {...props}
          />
        )}
      />

      <HBDialog
        content={formatMessage(PlatformCarrierAgrrementsMessages.areYouSure).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(PlatformCarrierAgrrementsMessages.deletePlatformShippingAgreements)}
        onAccept={onDelete}
        onReject={() => setDeleteDialogState({ show: false, id: undefined })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false, id: undefined })}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
    </>
  )
}

export default PlatformCarrierAgreementSettingsPage
