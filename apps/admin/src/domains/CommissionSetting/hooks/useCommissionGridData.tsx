import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import {
  GridFilterFieldType,
  HBDataGridClientRef,
} from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { CommissionType, StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  catalogApi,
  useGetAdminCatalogCommissionGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminCatalogCommissionChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { Dispatch, RefObject, SetStateAction, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import CommissionSettingMessages from '../CommissionSetting.message'
import GridSwitchComponent from '../components/GridSwitchComponent'
import { descriptionColumns, gridColumns } from '../grid'
import { CommissionAddEditFormType } from '../types'

interface GridDataProps {
  gridRef?: RefObject<HBDataGridClientRef>
  handleEditCommission?: (id: string) => void
  setDeleteDialogState?: Dispatch<
    SetStateAction<{
      show: boolean
      id?: number | undefined
    }>
  >
  selectedRows: CommissionAddEditFormType[]
}
function useCommissionGridData({
  gridRef,
  handleEditCommission,
  setDeleteDialogState,
  selectedRows,
}: GridDataProps) {
  const { formatMessage } = useIntl()
  const columns = gridColumns(formatMessage)
  const descriptionColumn = descriptionColumns(formatMessage)
  const gridLoading = (show: boolean) => {
    if (show) gridRef?.current!.api.showLoadingOverlay()
    else gridRef?.current!.api.hideOverlay()
  }

  const refreshGridData = useCallback((isClearSearch?: boolean) => {
    gridRef?.current?.refreshGridData(isClearSearch)
    gridRef?.current!.api?.deselectAll()
  }, [])

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor={props?.data?.commissionType === CommissionType.Seller ? '2' : '1'}
          stateMachineCode={
            props?.data?.commissionType === CommissionType.Seller
              ? StateMachineCode.SellerCommissionSetting.toString()
              : StateMachineCode.OtherCommissionSetting.toString()
          }
          useChangeState={usePostAdminCatalogCommissionChangeStateMutation}
          useLazyGetStateList={
            catalogApi.useLazyGetAdminCatalogCommissionGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          {...props}
          menuItems={[
            {
              label: formatMessage(phrasesMessages.public),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => handleEditCommission?.(props.data.id),
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => setDeleteDialogState?.({ show: true, id: props.data.id }),
                },
              ],
            },
          ]}
          onChangesState={refreshGridData}
        />
      )
    },
    [selectedRows],
  )
  const handleChangedGridActions = (value: number | string, type: 'search' | 'status') => {
    if (type === 'search') {
      if (value) {
        const searchFields: GridFilterFieldType[] = [
          { field: 'Number', operator: 'contains', value: String(value) },
        ]
        gridRef?.current!.addFilter({
          id: 'searchCommission',
          fields: searchFields,
          type: 'search',
          addToFilter: true,
        })
      } else {
        gridRef?.current!.removeFilter('searchCommission')
      }
    }
  }
  const columnDefs = useMemo(
    () => [
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
          innerRenderer: GridActions,
        },
      },
      {
        field: 'stateName',
        headerName: formatMessage(CommissionSettingMessages.currentStage),
        minWidth: 180,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => {
          return data?.stateCode ? (
            <HBWorkflowState
              machineCode={
                data?.commissionType === CommissionType.Seller
                  ? StateMachineCode.SellerCommissionSetting
                  : StateMachineCode.OtherCommissionSetting
              }
              {...{ useGetStateInfo }}
              stateCode={data?.stateCode}
              factor={data?.commissionType === CommissionType.Seller ? '2' : '1'}
            />
          ) : (
            '-'
          )
        },
      },
      ...columns,
      ...descriptionColumn,
      {
        field: 'isOriginalPriceUsedForCommission',
        headerName: formatMessage(CommissionSettingMessages.isOriginalPriceUsedForCommission),
        filter: 'agTextColumnFilter',
        minWidth: 230,
        cellRenderer: GridSwitchComponent,
      },
      {
        field: 'isVatDeductedFromCommission',
        headerName: formatMessage(CommissionSettingMessages.isVatDeductedFromCommission),
        filter: 'agTextColumnFilter',
        minWidth: 230,
        cellRenderer: GridSwitchComponent,
      },
    ],
    [gridRef?.current?.api?.getSelectedRows()],
  )
  return {
    handleChangedGridActions,
    gridLoading,
    checkboxSelection,
    headerCheckboxSelection,
    refreshGridData,
    autoGroupColumnDef,
    GridActions,
    columnDefs,
  }
}
export default useCommissionGridData
