import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import HBGrid, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetAdminSaleApiVendorShippingContractGetAllApiArg,
  useDeleteAdminSaleApiVendorShippingContractMutation,
} from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from './components/CreateGridToolbar'
import { breadcrumbsItems, classes } from './gridConfig'
import useVendorShippingAgreementPage from './hooks/useVendorShippingAgreementPage'
import VendorShippingAgrrementsMessages from './VendorShippingAgreements.message'

const ShippingProviderPage: FC = () => {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { showToast } = useToast()
  const [deleteShippingProvider] = useDeleteAdminSaleApiVendorShippingContractMutation()
  const [selectedRows, setSelectedRows] = useState<
    GetAdminSaleApiVendorShippingContractGetAllApiArg[]
  >([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'VendorTitle', operator: 'contains', value: String(value) },
        ]
        gridRef?.current!.addFilter({
          id: 'searchVendorShippingAgreement',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef?.current!.removeFilter('searchVendorShippingAgreement')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const handleChangedSelectedRows = (
    selectedRows: GetAdminSaleApiVendorShippingContractGetAllApiArg[],
  ) => {
    setSelectedRows(selectedRows)
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handleDeleteShippingProvider = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id.toString()]
        : selectedRows.map((row) => row?.id!)

      gridLoading(true)

      deleteShippingProvider({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        body: ids!,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(VendorShippingAgrrementsMessages.successDelete), 'success')
          refreshGridData()
        }
        setDeleteDialogState({ show: false, id: undefined })
        gridLoading(false)
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: number) => {
    setDeleteDialogState({ show, id })
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = useVendorShippingAgreementPage(
    gridRef,
    selectedRows,
    onDelete,
  )

  return (
    <>
      <HBGrid
        editUrl="/vendorShippingAgreementSetting/edit/"
        actionUrl={actionUrl}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(VendorShippingAgrrementsMessages.vendorShippingAgreement)}
            breadItems={breadcrumbsItems(formatMessage) || []}
          />
        }
        pagination
        paginationPageSize={25}
        rowSelection="multiple"
        enableRtl
        sideBar
        detailRowAutoHeight
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <CreateGridToolbar
            {...{ gridRef }}
            selectedRows={selectedRows}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={refreshGridData}
            {...props}
          />
        )}
        {...{ columnDefs, classes }}
      />
      <HBDialog
        content={formatMessage(VendorShippingAgrrementsMessages.areYouSure).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(VendorShippingAgrrementsMessages.deleteVendorShippingAgreements)}
        onAccept={handleDeleteShippingProvider}
        onReject={() => setDeleteDialogState({ show: false })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false })}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
    </>
  )
}

export default ShippingProviderPage
