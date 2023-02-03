import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import { HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import CommentMessages from '@hasty-bazar-admin/domains/CommentReview/CommentPage.messages'
import { CommentGridContentDialog } from '@hasty-bazar-admin/domains/CommentReview/containers/CommentContentDialog'
import CommentReasonDialog from '@hasty-bazar-admin/domains/CommentReview/containers/CommentReasonDialog'
import { useGetAdminSocialCommentsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as getStateInfo } from '@hasty-bazar/admin-shared/services/socialApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'

interface GridDataProps {
  gridRef?: RefObject<HBDataGridClientRef>
  selectedRows: any[]
}
function useUserFeedbackGrid({ gridRef, selectedRows }: GridDataProps) {
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
      height: 500,
    },
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return <GridActionColumn {...props} menuItems={[]} />
    },
    [selectedRows],
  )

  const columnDefs = useMemo(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 50,
        minWidth: 50,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: GridActions,
        },
      },
      {
        field: 'productName',
        headerName: formatMessage(CommentMessages.productName),
        minWidth: 250,
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'createdOn',
        headerName: formatMessage(CommentMessages.dateTitle),
        minWidth: 250,
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(params.value).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'
        },
      },
      {
        field: 'subject',
        headerName: formatMessage(CommentMessages.subject),
        minWidth: 150,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'body',
        headerName: formatMessage(CommentMessages.body),
        minWidth: 300,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'rate',
        headerName: formatMessage(CommentMessages.rate),
        minWidth: 150,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'recommendationTypeTitle',
        headerName: formatMessage(CommentMessages.recommendationTypeTitle),
        minWidth: 250,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'attachmentFileCount',
        headerName: formatMessage(CommentMessages.attachmentsCount),
        minWidth: 200,
        filter: 'agTextColumnFilter',
        cellRenderer: CommentGridContentDialog,
      },
      {
        field: 'stateCode',
        headerName: formatMessage(CommentMessages.stateTitle),
        minWidth: 200,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBWorkflowState
            factor="1"
            machineCode={StateMachineCode.commentReview}
            stateCode={data?.stateCode}
            useGetStateInfo={getStateInfo}
          />
        ),
      },
      {
        headerName: formatMessage(CommentMessages.changeStateReason),
        minWidth: 300,
        filter: 'agTextColumnFilter',
        cellRenderer: CommentReasonDialog,
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
export default useUserFeedbackGrid
