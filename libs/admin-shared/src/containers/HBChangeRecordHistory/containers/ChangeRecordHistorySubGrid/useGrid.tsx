import { Box } from '@mui/material'
import { ColDef, ICellRendererParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { RefObject, useMemo } from 'react'
import { useIntl } from 'react-intl'
import changeRecordHistoryMessages from '../../HBChangeRecordHistory.messages'
import { ChangeRecordHistoryEnvironmentType } from '../../types'

export type PeriodFilterOneModel = {
  gridRef: RefObject<AgGridReact>
  selectedRows: ChangeRecordHistoryEnvironmentType[]
}

const usePeriodFilterOne = ({ gridRef }: PeriodFilterOneModel) => {
  const { formatMessage } = useIntl()
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: 'number',
        headerName: formatMessage(changeRecordHistoryMessages.record),
      },
      {
        field: 'columnName',
        headerName: formatMessage(changeRecordHistoryMessages.fieldName),
        cellRenderer: (params: ICellRendererParams) => {
          return params?.data?.localColumnName ?? params?.data?.columnName
        },
      },
      {
        field: 'originalValue',
        headerName: formatMessage(changeRecordHistoryMessages.fromValue),
        cellRenderer: (params: ICellRendererParams) => {
          return <Box sx={{ direction: (theme) => theme.direction }}>{params?.value}</Box>
        },
      },
      {
        field: 'currentValue',
        headerName: formatMessage(changeRecordHistoryMessages.toValue),
        cellRenderer: (params: ICellRendererParams) => {
          return <Box sx={{ direction: (theme) => theme.direction }}>{params?.value}</Box>
        },
      },
    ],
    [],
  )

  return {
    columnDefs,
  }
}

export default usePeriodFilterOne
