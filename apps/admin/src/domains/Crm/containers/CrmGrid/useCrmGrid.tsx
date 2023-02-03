import { HBLink } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { HBButton, HBIcon } from '@hasty-bazar/core'
import { Box } from '@mui/material'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import crmMessages from '../../crm.message'
import { CrmGridModel } from '../../types'

export type PeriodFilterOneModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: CrmGridModel[]
  showFileView?: (row: CrmGridModel) => void
  showOrderView?: (row: CrmGridModel) => void
}

const usePeriodFilterOne = ({ gridRef, showFileView, showOrderView }: PeriodFilterOneModel) => {
  const actionUrl = `${process.env.NEXT_PUBLIC_GATEWAY}/Workflow/stateMachine`
  const { formatMessage } = useIntl()
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

  //test
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
            innerRenderer: (params: ICellRendererParams) => <></>,
          },
        },
        {
          field: 'id',
          headerName: formatMessage(phrasesMessages.id),
          hide: true,
          filter: 'agTextColumnFilter',
        },
        {
          field: 'createByFullName',
          headerName: formatMessage(crmMessages.gridCreateByFullName),
          filter: 'agTextColumnFilter',
          minWidth: 250,
        },
        {
          field: 'mobile',
          headerName: formatMessage(crmMessages.gridMobile),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'createDate',
          headerName: formatMessage(crmMessages.gridCreateDate),
          filter: 'agTextColumnFilter',
          minWidth: 150,
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
          field: 'caseTypeCaption',
          headerName: formatMessage(crmMessages.gridCaseTypeCaption),
          filter: 'agTextColumnFilter',
          minWidth: 250,
        },
        {
          field: 'requestCategoryName',
          headerName: formatMessage(crmMessages.gridRequestCategoryName),
          filter: 'agTextColumnFilter',
          minWidth: 200,
        },
        {
          field: 'secondRequestTypeName',
          headerName: formatMessage(crmMessages.gridSecondRequestTypeName),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'messageDescription',
          headerName: formatMessage(crmMessages.gridMessageDescription),
          filter: 'agTextColumnFilter',
          minWidth: 450,
          tooltipField: 'messageDescription',
        },
        {
          field: 'filePath',
          headerName: formatMessage(crmMessages.gridFilePath),
          filter: 'agTextColumnFilter',
          minWidth: 150,
          cellRenderer: (params: ICellRendererParams) => {
            return (
              <Box width={'100%'} textAlign={'center'}>
                <HBButton
                  variant="text"
                  sx={{ color: (theme) => `${theme.palette.info.main} !important`, minWidth: 30 }}
                  onClick={() => showFileView?.(params.data)}
                >
                  <HBIcon type="link" />
                </HBButton>
              </Box>
            )
          },
        },
        {
          field: 'shippingCode',
          headerName: formatMessage(crmMessages.gridShippingCode),
          filter: 'agTextColumnFilter',
          minWidth: 150,
          cellRenderer: (params: ICellRendererParams) => {
            return params.value ? (
              <HBLink
                underline="none"
                href={`/ordersManagement/?ShippingCode=${params.value}`}
                target="_blank"
              >
                {params.value}
              </HBLink>
            ) : (
              '-'
            )
          },
        },
        {
          field: 'status',
          headerName: formatMessage(crmMessages.gridStatus),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'satisfactionLevelCode',
          headerName: formatMessage(crmMessages.gridSatisfactionLevelCode),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'caseOriginCode',
          headerName: formatMessage(crmMessages.gridCaseOriginCode),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'responseDateTime',
          headerName: formatMessage(crmMessages.gridResponseDateTime),
          filter: 'agTextColumnFilter',
          minWidth: 150,
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
          field: 'statusTitle',
          headerName: formatMessage(crmMessages.gridStatusTitle),
          filter: 'agTextColumnFilter',
          minWidth: 150,
        },
        {
          field: 'caseId',
          headerName: formatMessage(crmMessages.gridCaseIdTitle),
          filter: 'agTextColumnFilter',
          minWidth: 200,
          cellRenderer: (params: ICellRendererParams) => {
            return params.value ? (
              <HBLink
                target={'_blank'}
                href={`https://callcenter.gig.services/Case/CaseDetail?CaseId=${params.value}`}
              >
                {formatMessage(crmMessages.gridEnterCRM)}
              </HBLink>
            ) : (
              '-'
            )
          },
        },
      ] as ColDef[],
    [gridRef.current?.api?.getSelectedRows()],
  )

  return {
    actionUrl,
    columnDefs,
    autoGroupColumnDef,
  }
}

export default usePeriodFilterOne
