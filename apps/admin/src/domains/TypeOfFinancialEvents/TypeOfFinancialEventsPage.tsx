import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import HBDataGridClient, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import useToast from '@hasty-bazar/admin-shared/hooks/useToast'
import {
  GetAllTransactionTypesQueryResult,
  useDeleteAdminAccountingApiTransactionTypeByIdMutation,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { HBDialog } from '@hasty-bazar/core'
import { useRouter } from 'next/router'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from './components/CreateGridToolbar'
import { breadcrumbsItems, classes } from './gridConfig'
import useTypeOfFinancialEventsPage from './hooks/useTypeOfFinancialEventsPage'
import TypeOfFinancialEventsMessages from './typeOfFinancialEvents.message'

const TypeOfFinancialEventsPage: FC = () => {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const router = useRouter()
  const { showToast } = useToast()
  const [deleteFinancialEvent] = useDeleteAdminAccountingApiTransactionTypeByIdMutation()
  const [selectedRows, setSelectedRows] = useState<GetAllTransactionTypesQueryResult[]>([])
  const [deleteDialogState, setDeleteDialogState] = useState<{ show: boolean; id?: number }>({
    show: false,
  })

  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Name', operator: 'contains', value: String(value) },
        ]
        gridRef?.current!.addFilter({
          id: 'searchTypeOfFinancialEvents',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef?.current!.removeFilter('searchTypeOfFinancialEvents')
      }
    }
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  const handleChangedSelectedRows = (selectedRows: GetAllTransactionTypesQueryResult[]) => {
    setSelectedRows(selectedRows)
  }

  const gridLoading = (show: boolean) => {
    if (show) {
      gridRef.current!.api.showLoadingOverlay()
    } else {
      gridRef.current!.api.hideOverlay()
    }
  }

  const handledeleteFinancialEvent = useCallback(async () => {
    try {
      const ids = deleteDialogState?.id
        ? [deleteDialogState?.id]
        : selectedRows?.map((row: GetAllTransactionTypesQueryResult) => row.id)

      gridLoading(true)

      ids?.map((id) => {
        return deleteFinancialEvent({
          'client-name': 'hasty-bazar-admin',
          'client-version': '1.0.0',
          id: id?.toString()!,
        }).then((res: any) => {
          if (res.data?.success) {
            setDeleteDialogState({ show: false })
            showToast(formatMessage(TypeOfFinancialEventsMessages.successDelete), 'success')
          }
          refreshGridData()
          gridLoading(false)
        })
      })
    } catch (e) {}
  }, [selectedRows, deleteDialogState])

  const onDelete = (show: boolean, id: number) => {
    setDeleteDialogState({ show, id })
  }

  const { actionUrl, columnDefs, autoGroupColumnDef } = useTypeOfFinancialEventsPage(
    gridRef,
    selectedRows,
    onDelete,
  )

  const financialEventEdit = (id?: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/typeOfFinancialEvents/edit/${id}`)
  }

  return (
    <>
      <HBDataGridClient
        editUrl="/typeOfFinancialEvents/edit/"
        actionUrl={actionUrl}
        rightHeader={
          <BreadCrumbSection
            title={formatMessage(TypeOfFinancialEventsMessages.typeOfFinancialEvents)}
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
            {...{ selectedRows, gridRef }}
            handleSetDeleteDialogState={onDelete}
            onGridActionsChange={handleChangedGridActions}
            onRefreshClick={refreshGridData}
            onEdit={financialEventEdit}
            {...props}
          />
        )}
        {...{ columnDefs, classes }}
      />
      <HBDialog
        content={formatMessage(TypeOfFinancialEventsMessages.areYouSureAboutTheDeletation).replace(
          'count',
          String(deleteDialogState?.id ? 1 : selectedRows.length),
        )}
        title={formatMessage(TypeOfFinancialEventsMessages.deleteFinancialEvent)}
        onAccept={handledeleteFinancialEvent}
        onReject={() => setDeleteDialogState({ show: false })}
        open={deleteDialogState.show}
        onClose={() => setDeleteDialogState({ show: false })}
        acceptBtn={formatMessage(phrasesMessages.yes)}
        rejectBtn={formatMessage(phrasesMessages.no)}
      />
    </>
  )
}

export default TypeOfFinancialEventsPage
