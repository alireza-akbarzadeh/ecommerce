import { HBLink } from '@hasty-bazar/admin-shared/components'
import { GridWorkflowActionColumn, HBWorkflowState } from '@hasty-bazar/admin-shared/containers'
import { HBDataGridClientRef } from '@hasty-bazar/admin-shared/containers/HBDataGrid'
import { StateMachineCode } from '@hasty-bazar/admin-shared/core/enums'
import {
  socialApi,
  useGetAdminSocialCommentsGetStateInfoByStateCodeAndStateMachineCodeFactorQuery as getStateInfo,
  usePostAdminSocialCommentsChangeStateMutation,
} from '@hasty-bazar/admin-shared/services/socialApi.generated'
import { HBAgGridClasses } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { RefObject, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import CommentMessages from '../CommentPage.messages'
import { CommentGridContentDialog } from '../containers/CommentContentDialog'
import CommentReasonDialog from '../containers/CommentReasonDialog'

interface GridDataProps {
  gridRef?: RefObject<HBDataGridClientRef>
  selectedRows: any[]
}
function useGridData({ gridRef, selectedRows }: GridDataProps) {
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
      backgroundColor: ({ palette }) => `${palette.common.white} !important`,
      p: ({ spacing }) => spacing(1),
      height: `calc(100vh - 420px)`,
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

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridWorkflowActionColumn
          entityId={props?.data?.id}
          factor="1"
          stateMachineCode={`${StateMachineCode.commentReview}`}
          useChangeState={usePostAdminSocialCommentsChangeStateMutation}
          useLazyGetStateList={
            socialApi.useLazyGetAdminSocialCommentsGetTransitionByEntityIdAndStateMachineCodeFactorQuery
          }
          {...props}
          menuItems={[]}
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
        field: 'partyFullName',
        minWidth: 150,
        headerName: formatMessage(CommentMessages.userTitle),
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
      },
      {
        field: 'productName',
        headerName: formatMessage(CommentMessages.productName),
        minWidth: 250,
        filter: 'agTextColumnFilter',
        enableRowGroup: true,
        cellRenderer: ({ data, value }: ICellRendererParams) => {
          return value ? (
            <HBLink
              href={`/products/simple-product/edit/product-details/${data?.productId}/`}
              target="_blank"
            >
              {value}
            </HBLink>
          ) : (
            '-'
          )
        },
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
        field: 'reason',
        headerName: formatMessage(CommentMessages.changeStateReason),
        minWidth: 300,
        filter: 'agTextColumnFilter',
        cellRenderer: ({ data }: ICellRendererParams) => <CommentReasonDialog id={data.id} />,
        tooltipField: 'reason',
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
