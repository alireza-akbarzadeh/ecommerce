import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import HBDataGridClient, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import { useDeleteAdminSaleApiShippingProvidersMutation } from '@hasty-bazar/admin-shared/services/saleApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from './components/CreateGridToolbar'
import RuleModal from './components/RuleModal'
import { breadcrumbsItems, classes } from './gridConfig'
import ShippingProviderMessages from './shippingProvider.message'
import { SelectRowModel } from './types'
import useShopingProviderPage from './useShopingProviderPage'

const ShippingProviderPage: FC = () => {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const { showToast } = useToast()
  const [deleteShippingProvider] = useDeleteAdminSaleApiShippingProvidersMutation()
  const [selectedRows, setSelectedRows] = useState<SelectRowModel[]>([])
  const [ruleId, setRuleId] = useState<string>('')
  const [showRuleModal, setShowRuleModal] = useState<boolean>(false)
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'ProviderName', operator: 'contains', value: String(value) },
        ]
        gridRef?.current!.addFilter({
          id: 'searchShippingProvider',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef?.current!.removeFilter('searchShippingProvider')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  const handleChangedSelectedRows = (selectedRows: SelectRowModel[]) => {
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
        : selectedRows.map((row) => row.id.toString()!)

      gridLoading(true)

      deleteShippingProvider({
        'client-name': 'hasty-bazar-admin',
        'client-version': '1.0.0',
        body: ids,
      }).then((res: any) => {
        if (res?.data?.success) {
          showToast(formatMessage(ShippingProviderMessages.successDelete), 'success')
          refreshGridData()
        }
        setDeleteDialogState({ show: false })
        gridLoading(false)
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: number) => {
    setDeleteDialogState({ show, id })
  }

  const setRulIdAndShowItsModal = (id: string, show: boolean) => {
    setShowRuleModal(show)
    setRuleId(id)
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = useShopingProviderPage(
    gridRef,
    selectedRows,
    onDelete,
    setRulIdAndShowItsModal,
  )

  return (
    <>
      <HBDataGridClient
        editUrl="/shippingProvider/edit/"
        actionUrl={actionUrl}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(ShippingProviderMessages.shippingProviderInfo)}
            breadItems={breadcrumbsItems(formatMessage) || []}
          />
        }
        pagination
        paginationPageSize={25}
        cacheBlockSize={25}
        rowModelType={'serverSide'}
        serverSideStoreType={'partial'}
        rowSelection="multiple"
        enableRtl
        sideBar
        detailRowAutoHeight
        autoGroupColumnDef={autoGroupColumnDef}
        onSelectedChanged={handleChangedSelectedRows}
        ref={gridRef}
        GridToolbar={(props) => (
          <CreateGridToolbar
            selectedRows={selectedRows}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={refreshGridData}
            {...{ gridRef }}
            {...props}
          />
        )}
        {...{ columnDefs, classes }}
      />
      <HBDialog
        content={formatMessage(ShippingProviderMessages.areYouSureAboutTheDeletation).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(ShippingProviderMessages.deleteShippingProvider)}
        onAccept={handleDeleteShippingProvider}
        onReject={() => setDeleteDialogState({ show: false })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false })}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
      {showRuleModal && <RuleModal {...{ ruleId, setRulIdAndShowItsModal, showRuleModal }} />}
    </>
  )
}

export default ShippingProviderPage
