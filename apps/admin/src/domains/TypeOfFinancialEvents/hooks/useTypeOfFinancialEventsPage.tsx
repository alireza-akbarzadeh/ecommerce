import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import {
  GetAllTransactionTypesQueryResult,
  useGetAdminAccountingApiTransactionTypeGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
} from '@hasty-bazar/admin-shared/services/accountingApi.generated'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  ColGroupDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { useRouter } from 'next/router'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import GridAction from '../components/GridAction'
import TypeOfFinancialEventsMessages from '../typeOfFinancialEvents.message'

const useTypeOfFinancialEventsPage = (
  gridRef: RefObject<HBDataGridClientRef>,
  selectedRows: GetAllTransactionTypesQueryResult[],
  onDelete: (show: boolean, id: number) => void,
) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Admin/Accounting/api/TransactionType`
  const { formatMessage } = useIntl()
  const router = useRouter()
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const financialEventEdit = (id?: string | number) => {
    id = typeof id === 'string' ? id : selectedRows[0]?.id
    router.push(`/typeOfFinancialEvents/edit/${id}`)
  }

  const onEdit = (id: string | number) => {
    financialEventEdit(id)
  }

  const columnDefs = useMemo(
    () =>
      [
        {
          field: '_actions',
          headerName: '',
          maxWidth: 110,
          minWidth: 110,
          resizable: false,
          sortable: false,
          filter: false,
          suppressAutoSize: true,
          suppressMenu: true,
          checkboxSelection,
          headerCheckboxSelection,
          showRowGroup: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {
            suppressCount: true,
            suppressDoubleClickExpand: true,
            innerRenderer: (params: ICellRendererParams) => (
              <GridAction {...params} {...{ onEdit, onDelete, gridRef }} />
            ),
          },
        },
        {
          field: 'stateTitle',
          headerName: formatMessage(TypeOfFinancialEventsMessages.state),
          minWidth: 180,
          filter: 'agTextColumnFilter',
          cellRenderer: ({ data }: ICellRendererParams) =>
            data?.stateCode && (
              <HBWorkflowState
                machineCode={StateMachineCode.ShippingProvider}
                {...{ useGetStateInfo }}
                stateCode={data?.stateCode}
                factor={'1'}
              />
            ),
        },
        {
          field: 'id',
          headerName: formatMessage(TypeOfFinancialEventsMessages.code),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'name',
          headerName: formatMessage(TypeOfFinancialEventsMessages.title),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'description',
          headerName: formatMessage(TypeOfFinancialEventsMessages.description),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
      ] as (ColDef | ColGroupDef)[],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default useTypeOfFinancialEventsPage
