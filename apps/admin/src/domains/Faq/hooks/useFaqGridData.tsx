import { GridActionMenuProps } from '@hasty-bazar/admin-shared/components'
import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import {
  catalogApi,
  GetQuestionsQueryResult,
  useGetAdminCatalogFaqsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as useGetStateInfo,
  usePostAdminCatalogFaqsChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/catalogApi.generated'
import { HBAgGridClasses, HBIcon } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { Dispatch, RefObject, SetStateAction, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import FaqPageMessages from '../FaqPage.messages'

interface GridDataProps {
  gridRef?: RefObject<HBDataGridClientRef>
  handleEditFAQ?: (id?: string) => void
  selectedRows: GetQuestionsQueryResult[]
  setRecordChangeHistory?: ({ show, entityId }: { show: boolean; entityId: string }) => void
  setDeleteDialogState?: Dispatch<
    SetStateAction<{
      show: boolean
      id?: string
    }>
  >
}
function useGridData({
  gridRef,
  setDeleteDialogState,
  handleEditFAQ,
  selectedRows,
  setRecordChangeHistory,
}: GridDataProps) {
  const { formatMessage } = useIntl()

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

  const classes: HBAgGridClasses = {
    wrapper: {
      p: ({ spacing }) => spacing(1),
      height: `calc(100vh - 380px)`,
      '& .ag-layout-normal .ag-header': {
        backgroundColor: ({ palette }) => `${palette.grey[100]} !important`,
        border: 'unset',
      },
      '&>div:last-child': {
        borderRadius: 2,
        backgroundColor: ({ palette }) => palette.grey[100],
      },
      '& div.ag-root-wrapper': {
        border: 'unset',
        '& div.ag-body-viewport': {
          backgroundColor: ({ palette }) => `${palette.grey[100]} !important`,
        },
      },
      '& div.MuiBox-root': {
        border: 'unset',
        px: 0,
      },
      '& div.ag-theme-alpine:nth-child(2)': {
        p: 10,
      },
    },
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const gridMenuItems = ({
    props,
    handleEditFAQ,
    setRecordChangeHistory,
  }: {
    props: ICellRendererParams
    handleEditFAQ?: (id?: string) => void
    setRecordChangeHistory?: ({ show, entityId }: { show: boolean; entityId: string }) => void
  }) => {
    let items: GridActionMenuProps[] = [
      {
        label: formatMessage(phrasesMessages.public),
        children: [
          {
            icon: 'pen',
            label: formatMessage(phrasesMessages.edit),
            onClick: () => handleEditFAQ?.(props.data.id!),
          },
          {
            icon: 'trashAlt',
            label: formatMessage(phrasesMessages.delete),
            onClick: () => setDeleteDialogState?.({ show: true, id: props.data.id }),
          },
          {
            icon: 'history',
            label: formatMessage(phrasesMessages.recordHistory),
            onClick: () => setRecordChangeHistory?.({ show: true, entityId: props.data.id }),
          },
        ],
      },
    ]

    return items
  }
  const getMenuItems = useCallback((props: ICellRendererParams) => {
    return gridMenuItems({
      props,
      handleEditFAQ,
      setRecordChangeHistory,
    })
  }, [])
  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor="1"
          stateMachineCode={`${StateMachineCode.Faq}`}
          useChangeState={usePostAdminCatalogFaqsChangeStateMutation}
          useLazyGetStateList={
            catalogApi.useLazyGetAdminCatalogFaqsGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          {...props}
          menuItems={getMenuItems(props)}
          onChangesState={refreshGridData}
        />
      )
    },
    [selectedRows],
  )
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
        field: 'questionUsageTypeCodeTitle',
        headerName: formatMessage(FaqPageMessages.questionTypeTitle),
        minWidth: 150,
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'sortOrderIndex',
        headerName: formatMessage(FaqPageMessages.sortOrderTitle),
        minWidth: 150,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'panelTypeCodeTitle',
        headerName: formatMessage(FaqPageMessages.relatedPanelTitle),
        minWidth: 250,
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'isUseful',
        headerName: formatMessage(FaqPageMessages.isUseful),
        minWidth: 200,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: { value: boolean }) => {
          return value ? <HBIcon type="check" size="medium" /> : '-'
        },
      },
      {
        field: 'displayInFaq',
        headerName: formatMessage(FaqPageMessages.displayInFaq),
        minWidth: 200,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ value }: { value: boolean }) => {
          return value ? <HBIcon type="check" size="medium" /> : '-'
        },
      },
      {
        field: 'questionText',
        headerName: formatMessage(FaqPageMessages.questionTitle),
        minWidth: 350,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'shortAnswer',
        headerName: formatMessage(FaqPageMessages.shortAnswer),
        minWidth: 350,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'numberOfViews',
        headerName: formatMessage(FaqPageMessages.numberOfViews),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'numberOfUseful',
        headerName: formatMessage(FaqPageMessages.numberOfUseful),
        minWidth: 150,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'numberOfNotUseful',
        headerName: formatMessage(FaqPageMessages.numberOfNotUseful),
        minWidth: 180,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'stateCode',
        headerName: formatMessage(FaqPageMessages.state),
        minWidth: 150,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            factor="1"
            machineCode={StateMachineCode.Faq}
            stateCode={data.stateCode}
            useGetStateInfo={useGetStateInfo}
          />
        ),
      },
    ],
    [gridRef?.current?.api?.getSelectedRows()],
  )
  return {
    columnDefs,
    gridLoading,
    classes,
    checkboxSelection,
    headerCheckboxSelection,
    refreshGridData,
    autoGroupColumnDef,
  }
}
export default useGridData
