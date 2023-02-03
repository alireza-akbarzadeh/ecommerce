import { BreadCrumbSection } from '@hasty-bazar/admin-shared/components/BreadCrumb'
import HBGrid, {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid/HBDataGridClient'
import { GetAdminAccountingApiFinancialTransactionApiArg } from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import { FC, useCallback, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import CreateGridToolbar from './components/CreateGridToolbar'
import FinancialTransactionMessage from './financialTransaction.message'
import { classes } from './gridConfig'
import { useFinancialTransaction } from './hooks'

const FinancialTransactionPage: FC = () => {
  const { formatMessage } = useIntl()
  const gridRef = useRef<HBDataGridClientRef>(null)
  const [selectedRows, setSelectedRows] = useState<
    GetAdminAccountingApiFinancialTransactionApiArg[]
  >([])
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Accounting/api/FinancialTransaction`
  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'PartyName', operator: 'contains', value: String(value) },
        ]
        gridRef?.current!.addFilter({
          id: 'searchFinancialTransaction',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef?.current!.removeFilter('searchFinancialTransaction')
      }
    }
  }
  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api.deselectAll()
  }, [])

  const handleChangedSelectedRows = (
    selectedRows: GetAdminAccountingApiFinancialTransactionApiArg[],
  ) => {
    setSelectedRows(selectedRows)
  }

  const { columnDefs, autoGroupColumnDef } = useFinancialTransaction(gridRef)

  return (
    <HBGrid
      actionUrl={actionUrl}
      rightHeader={
        <BreadCrumbSection
          title={formatMessage(FinancialTransactionMessage.financialManagement)}
          breadItems={[]}
        />
      }
      rowGroupPanelShow={'always'}
      groupDisplayType={'groupRows'}
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
          selectedRows={selectedRows}
          onGridActionsChange={handleChangedGridActions}
          onRefreshClick={refreshGridData}
          {...{ gridRef }}
          {...props}
        />
      )}
      {...{ columnDefs, classes }}
    />
  )
}

export default FinancialTransactionPage
