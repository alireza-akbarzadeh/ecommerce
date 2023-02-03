import { GridActionColumn } from '@hasty-bazar/admin-shared/components'
import phrasesMessages from '@hasty-bazar-admin/core/translations/phrases.messages'
import { GetProcessMessageTemplateSettingQueryResult } from '@hasty-bazar/admin-shared/services/generalDataApi.generated'
import { HBSwitch } from '@hasty-bazar/core'
import {
  CheckboxSelectionCallbackParams,
  HeaderCheckboxSelectionCallbackParams,
  ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import ProcessPageMessages from '../../ProcessPage.messages'

const useShopingProviderPage = (
  gridRef: RefObject<AgGridReact>,
  selectedRows: GetProcessMessageTemplateSettingQueryResult[],
  onDelete: (show: boolean, id: number) => void,
  onEdit: () => void,
) => {
  const { formatMessage } = useIntl()

  const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
    return params.columnApi.getRowGroupColumns().length === 0
  }

  const GridActions = useCallback(
    (props: ICellRendererParams) => {
      return (
        <GridActionColumn
          {...props}
          menuItems={[
            {
              label: formatMessage(ProcessPageMessages.general),
              children: [
                {
                  icon: 'pen',
                  label: formatMessage(phrasesMessages.edit),
                  onClick: () => onEdit(),
                },
                {
                  icon: 'trashAlt',
                  label: formatMessage(phrasesMessages.delete),
                  onClick: () => onDelete(true, props.data.id),
                },
              ],
            },
          ]}
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
        field: 'id',
        headerName: formatMessage(ProcessPageMessages.id),
        filter: 'agNumberColumnFilter',
        minWidth: 100,
        hide: true,
      },
      {
        field: 'messageName',
        headerName: formatMessage(ProcessPageMessages.messageTempletName),
        filter: 'agTextColumnFilter',
        minWidth: 180,
      },
      {
        field: 'isRepeatable',
        headerName: formatMessage(ProcessPageMessages.isRepeatable),
        minWidth: 130,
        cellRenderer: ({ data }: ICellRendererParams) => <HBSwitch checked={data.isRepeatable} />,
      },
      {
        field: 'intervalTitle',
        headerName: formatMessage(ProcessPageMessages.interval),
        filter: 'agTextColumnFilter',
        minWidth: 130,
      },
      {
        field: 'startDateTime',
        headerName: formatMessage(ProcessPageMessages.sendStartDate),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(
                String(params.value).slice(0, String(params.value).indexOf('+')) + 'Z',
              ).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
      {
        field: 'endDateTime',
        headerName: formatMessage(ProcessPageMessages.sendEndDate),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(
                String(params.value).slice(0, String(params.value).indexOf('+')) + 'Z',
              ).toLocaleDateString('fa-IR', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })
            : '-'
        },
      },
      {
        field: 'startDateTime',
        headerName: formatMessage(ProcessPageMessages.sendStartTime),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(
                String(params.value).slice(0, String(params.value).indexOf('+')) + 'Z',
              ).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'
        },
      },
      {
        field: 'endDateTime',
        headerName: formatMessage(ProcessPageMessages.sendEndTime),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(
                String(params.value).slice(0, String(params.value).indexOf('+')) + 'Z',
              ).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'
        },
      },
      {
        field: 'sendImmediately',
        headerName: formatMessage(ProcessPageMessages.immediatelyAfterSend),
        minWidth: 155,
        cellRenderer: ({ data }: ICellRendererParams) => (
          <HBSwitch checked={data.sendImmediately} />
        ),
      },
      {
        field: 'sendAfterMinute',
        headerName: formatMessage(ProcessPageMessages.timeIntervalAfterCreation),
        minWidth: 170,
      },
      {
        field: 'startTime',
        headerName: formatMessage(ProcessPageMessages.sendStartTime),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(
                String(params.value).slice(0, String(params.value).indexOf('+')) + 'Z',
              ).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'
        },
      },
      {
        field: 'endTime',
        headerName: formatMessage(ProcessPageMessages.sendEndTime),
        filter: 'agTextColumnFilter',
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params.value
            ? new Date(
                String(params.value).slice(0, String(params.value).indexOf('+')) + 'Z',
              ).toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'
        },
      },
      {
        field: 'status',
        headerName: formatMessage(ProcessPageMessages.status),
        filter: 'agTextColumnFilter',
        minWidth: 100,
      },
    ],
    [gridRef.current?.api?.getSelectedRows()],
  )
  return {
    columnDefs,
  }
}

export default useShopingProviderPage
