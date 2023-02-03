import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { format } from 'date-fns-jalali'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import changeRecordHistoryMessages from '../../HBChangeRecordHistory.messages'
import { ChangeRecordHistoryRowsType } from '../../types'

const JALALI_DATE_FORMAT = 'yyyy-MM-dd'
const JALALI_HOUR_FORMAT = 'HH:mm:ss'

export type PeriodFilterOneModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: ChangeRecordHistoryRowsType[]
}

const usePeriodFilterOne = ({ gridRef }: PeriodFilterOneModel) => {
  const { formatMessage } = useIntl()
  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerCheckboxSelection: true,
      cellRenderer: 'agGroupCellRenderer',
    }
  }, [])

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: '_actions',
        headerName: '',
        maxWidth: 60,
        minWidth: 60,
        resizable: false,
        sortable: false,
        filter: false,
        suppressAutoSize: true,
        suppressMenu: true,
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true,
          suppressDoubleClickExpand: true,
          innerRenderer: () => {},
        },
      },
      {
        field: 'number',
        headerName: formatMessage(changeRecordHistoryMessages.record),
        minWidth: 100,
      },
      {
        field: 'localAuditType',
        headerName: formatMessage(changeRecordHistoryMessages.operation),
        minWidth: 120,
      },
      {
        field: 'username',
        headerName: formatMessage(changeRecordHistoryMessages.username),
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params?.data?.environment?.username || ''
        },
      },
      {
        field: 'changeDate',
        headerName: formatMessage(changeRecordHistoryMessages.changeDate),
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) =>
          format(new Date(params?.data?.createDate), JALALI_DATE_FORMAT),
      },
      {
        field: 'changeHour',
        headerName: formatMessage(changeRecordHistoryMessages.changeHour),
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) =>
          format(new Date(params?.data?.createDate), JALALI_HOUR_FORMAT),
      },
      {
        field: 'gateway',
        headerName: formatMessage(changeRecordHistoryMessages.gateway),
        minWidth: 150,
        cellRenderer: (params: ICellRendererParams) => {
          return params?.data?.environment?.platform || ''
        },
      },
      {
        field: 'userIp',
        headerName: formatMessage(changeRecordHistoryMessages.userIp),
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) => {
          return params?.data?.environment?.userIp || ''
        },
      },
    ],
    [],
  )

  return {
    columnDefs,
    autoGroupColumnDef,
  }
}

export default usePeriodFilterOne
